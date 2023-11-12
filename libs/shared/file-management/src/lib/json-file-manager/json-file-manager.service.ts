import { Injectable } from '@angular/core';
import { Project, TreeNode } from '@critical-pass/project/types';
import { ProjectStorageApiService } from '@critical-pass/shared/data-access';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { FileManagerBaseService } from '../file-manager-base.service';
import { API_CONST } from '@critical-pass/shared/data-access';
import { HistoryMapperService } from '../history-file-manager/history-mapper/history-mapper.service';
import { ProjectSanatizerService } from '@critical-pass/shared/project-utils';
import { ProjectTreeNodeSerializerService } from '@critical-pass/charts';
@Injectable({
    providedIn: 'root',
})
export class JsonFileManagerService implements FileManagerBaseService<TreeNode[]> {
    constructor(private storageApi: ProjectStorageApiService, private mapper: HistoryMapperService, private projSerializer: ProjectSerializerService,private treeSerializer: ProjectTreeNodeSerializerService,  private sanitizer: ProjectSanatizerService) {}
    
    public import(file: File): Promise<TreeNode[]> {
        return new Promise<TreeNode[]>((resolve, reject) => {
            const reader: FileReader = new FileReader();
            reader.readAsText(file);
            reader.onload = (e: any) => {
                const contentTxt: string = e.target.result;
                const contentJson: Project[] = JSON.parse(contentTxt);
                const projSerializer = new ProjectSerializerService();
                const projects = contentJson.map(x => {
                    return projSerializer.fromJson(x);
                });
                const head = this.mapper.createTreeHeadNode();
                const innerNodes = projects.map(x => this.mapper.mapProjectToNode(x))
                const treeNodes = [head, ...innerNodes];
                resolve(treeNodes);
            };
        });
    }
    public export(content: TreeNode[]): void {

        // If you wish to save project list instead of treenodes, skip node serialization
        const newNodes = content.map(x => {
            const node = this.treeSerializer.fromJson(x);
            node.children = [];
            node.parent = null;

            if (x.data) {
                const proj = this.projSerializer.fromJson(x.data);
                this.sanitizer.sanatizeForSave(proj);
                node.data = proj;
            }
            return node;
        });
        const projectTxt = JSON.stringify(newNodes);
        const blob = new Blob([projectTxt], { type: 'application/json' });
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = 'data.json'; // Specify the desired filename
        downloadLink.click();

    }

    // TODO: Finish this. It pulls tree nodes from the file, I need to serialize
    // the tree nodes (and their projects seperately) and connect them to form a tree
    public importTree(file: File): Promise<TreeNode[]> {
        return new Promise<TreeNode[]>((resolve, reject) => {
            const reader: FileReader = new FileReader();
            reader.readAsText(file);
            reader.onload = (e: any) => {
                const contentTxt: string = e.target.result;
                const contentJson: TreeNode[] = JSON.parse(contentTxt);
                resolve(contentJson);
            };
        });
    }
}
