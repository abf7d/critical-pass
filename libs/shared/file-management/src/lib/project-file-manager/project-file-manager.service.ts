import { Injectable } from '@angular/core';
// import { Project } from '../../../../models/project/project';
// import { FileManagerBaseService } from '../../../../models/base';
import * as XLSX from 'xlsx';
// import * as Keys from '../../../../constants/keys';
import { FileManagerBaseService } from '../file-manager-base.service';
import { ProjectMapperService } from './project-mapper/project-mapper.service';
import { Project } from '@critical-pass/project/types';
import * as CONST from '../constants';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { ProjectSanatizerService } from '@critical-pass/shared/project-utils';

@Injectable({
    providedIn: 'root',
})
export class ProjectFileManagerService implements FileManagerBaseService<Project> {
    constructor(private mapper: ProjectMapperService, private serializer: ProjectSerializerService, private projSanitizer: ProjectSanatizerService) {}
    public export(project: Project) {
        const profiles = project.activities.map(x => {
            return { ...x.profile, graphId: project.profile.id };
        });
        const charttInfos = project.activities.map(a => {
            return { ...a.chartInfo, id: a.profile.id, graphId: project.profile.id };
        });
        const nodes = project.integrations;
        const name = project.profile.name || 'critical-pass-project';

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(profiles);
        const nds: XLSX.WorkSheet = XLSX.utils.json_to_sheet(nodes);
        const arrows: XLSX.WorkSheet = XLSX.utils.json_to_sheet(charttInfos);
        const proj: XLSX.WorkSheet = XLSX.utils.json_to_sheet([project.profile]);

        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, CONST.ACTIVITIES_WS_NAME);
        XLSX.utils.book_append_sheet(wb, arrows, CONST.ARROW_WS_NAME);
        XLSX.utils.book_append_sheet(wb, nds, CONST.INTEGRATION_WS_NAME);
        XLSX.utils.book_append_sheet(wb, proj, CONST.PROFILE_WS_NAME);
        XLSX.writeFile(wb, name + '.xlsx');
    }
    public import(file: File): Promise<Project> {
        return new Promise<Project>((resolve, reject) => {
            const reader: FileReader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = (e: any) => {
                const binarystr: string = e.target.result;
                const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary', cellDates: true });

                const activityData = this.getWorksheetData(wb, CONST.ACTIVITIES_WS_NAME);
                const arrowData = this.getWorksheetData(wb, CONST.ARROW_WS_NAME); // to get 2d array pass 2nd parameter as object {header: 1}
                const integrationData = this.getWorksheetData(wb, CONST.INTEGRATION_WS_NAME);
                const profileData = this.getWorksheetData(wb, CONST.PROFILE_WS_NAME);

                const projActivities = this.mapper.createActivities(activityData, arrowData);
                const integrations = this.mapper.createIntegrations(integrationData);
                const project = this.mapper.getCritPathProject(profileData);

                project.activities = projActivities;
                project.integrations = integrations;

                resolve(project);
            };
        });
    }

    public getWorksheetData(wb: XLSX.WorkBook, sheetName: string) {
        const ws = wb.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(ws);
    }

    public exportToJSON(project: Project[] | Project) {
        let contentTxt: string = '';
        let name = 'critical-pass-project';
        if (!Array.isArray(project)) {
            const copy = this.serializer.fromJson(project) as any;
            this.projSanitizer.sanatizeForSave(copy);
            contentTxt = JSON.stringify(copy);
        } else {
            name = 'critical-pass-projects';
            const entries = project.map(p => {
                const copy = this.serializer.fromJson(p) as any;
                this.projSanitizer.sanatizeForSave(copy);
                return copy;
            });
            contentTxt = JSON.stringify(entries);
        }

        const blob = new Blob([contentTxt], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = name + '.json';
        anchor.href = url;
        anchor.click();
    }
    public importFromJSON(file: File): Promise<Project | Project[]> {
        return new Promise<Project | Project[]>((resolve, reject) => {
            const reader: FileReader = new FileReader();
            reader.readAsText(file);
            reader.onload = (e: any) => {
                const data = e.target.result;
                const projectJson = JSON.parse(data);
                if (!Array.isArray(projectJson)) {
                    const project = this.serializer.fromJson(projectJson);
                    resolve(project);
                } else {
                    const projects = projectJson.map(p => this.serializer.fromJson(p));
                    resolve(projects)
                }
            };
        });
    }
}
