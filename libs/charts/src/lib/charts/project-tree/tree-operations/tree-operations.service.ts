import { Inject, Injectable } from '@angular/core';
import { NodeConnectorService } from '@critical-pass/project/processor';
import { Project, ProjectMetadata, TreeNode } from '@critical-pass/project/types';
import { DashboardService, DASHBOARD_TOKEN } from '@critical-pass/shared/data-access';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { ProjectTreeNodeSerializerService } from '../../../services/project-tree-node-serializer/project-tree-node-serializer.service';
import { ProjectTreeState } from '../project-tree-state/project-tree-state';
import * as CONST from '../../../constants/constants';
@Injectable({
    providedIn: 'root',
})
export class TreeOperationsService {
    public st!: ProjectTreeState;
    constructor(
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        private projSerializer: ProjectSerializerService,
        private treeNodeSerializer: ProjectTreeNodeSerializerService,
        private nodeConnector: NodeConnectorService,
    ) {}

    public setState(st: ProjectTreeState) {
        this.st = st;
    }
    public initializeHeadNode(project: Project): void {
        const factory = this.projSerializer;
        const copy = factory.fromJson(project);
        const node = this.treeNodeSerializer.head();
        node.data = copy;
        this.st.head = node;
        this.st.selected = node;
        this.st.seedProject = factory.fromJson(project);
    }

    public countNodes(node: TreeNode, array: TreeNode[]): number {
        array.push(node);
        for (const child of node.children) {
            this.countNodes(child, array);
        }
        if (array.length > 0) {
            return Math.max(...array.map(x => (x.id ? x.id : 0))) + 1;
        }
        return 0;
    }

    public selectNode(id: number): void {
        const node = this.getNodeById(this.st.head!, id);
        if (node) {
            this.st.selected = this.copyNode(node);
        }
    }

    private getNodeById(node: TreeNode, id: number): TreeNode | null {
        if (node.id === id) {
            return node;
        }
        let foundnode = null;
        for (const child of node.children) {
            const searchnode = this.getNodeById(child, id);
            if (searchnode) {
                foundnode = searchnode;
            }
        }
        return foundnode;
    }

    public commit(curProject: Project): TreeNode[] {
        const newNode = this.createNode(curProject);
        this.st.selected!.children.push(newNode);
        newNode.parent = this.st.selected;
        newNode.parentNodeId = this.st.selected!.id;
        this.st.selected = newNode;
        const array = this.getHistoryArray(this.st.head!);
        return array;
    }

    public branch(curProject: Project): TreeNode[] | null {
        if (this.st.selected!.parent != null) {
            this.st.selected = this.st.selected!.parent;
            const branch = this.createNode(curProject);
            branch.parent = this.st.selected;
            branch.parentNodeId = this.st.selected.id;
            this.st.selected.children.push(branch);
            this.st.selected = branch;
            const array = this.getHistoryArray(this.st.head!);
            return array;
        }
        return null;
    }

    public reset(): TreeNode {
        const copySeed = new ProjectSerializerService().fromJson(this.st.seedProject);
        const copyNode = this.copyNode(this.st.head!);
        copyNode.data = copySeed;
        copyNode.children = [];
        this.st.head = copyNode;
        this.st.selected = this.copyNode(copyNode);
        return copyNode;
    }
    public copyNode(node: TreeNode) {
        const projCopy = new ProjectSerializerService().fromJson(node.data);
        const nodeCopy = new ProjectTreeNodeSerializerService().fromJson(node);

        // hack to get lassoOn to persist for the resources arrow chart after assignment
        projCopy.profile.view.lassoOn = node.data!.profile.view.lassoOn;
        nodeCopy.data = projCopy;
        return nodeCopy;
    }
    private createNode(project: Project): TreeNode {
        const currentNode = this.st.selected!;
        this.st.latestId++;

        let group = null;
        let subgroup = null;
        const id = this.st.latestId;
        if (currentNode.children.length > 0) {
            this.st.latestGroupId++;
            group = this.st.latestGroupId;
            subgroup = 0;
        } else {
            group = currentNode.group;
            subgroup = currentNode.subgroup + 1;
        }
        const name = `${group}-${subgroup}-${id}`;

        // TODO: Inject a NodeDataFactoryBase and Implement with ProjectNodeFactory
        const data = this.projSerializer.fromJson(project);

        // hack to get lassoOn to persist for the resources arrow chart after assignment
        data.profile.view.lassoOn = project.profile.view.lassoOn;

        const newNode: TreeNode = { id, group, subgroup, data, name, children: [], metadata: null, parent: null, parentNodeId: null };
        this.nodeConnector.connectArrowsToNodes(data);

        // TODO abstract this as a base class injected so the Tree component can be used
        this.processMetadata(newNode);
        return newNode;
    }

    // TODO add to a base class
    private processMetadata(node: TreeNode): void {
        const nonDummy = node.data!.activities.filter(a => !a.chartInfo.isDummy);
        const unassigned = nonDummy.filter(a => a.assign.resources.length === 0);
        const metadata: ProjectMetadata = { assignmentCompleted: unassigned.length === 0, time: null, cost: null };
        node.metadata = metadata;
    }

    private getHistoryArray(headNode: TreeNode): TreeNode[] {
        const array: TreeNode[] = [];
        this.walkTree(headNode, array, 0);
        return array;
    }
    private walkTree(node: TreeNode, array: TreeNode[], iteration: number): void {
        if (!node) {
            return;
        }
        const projCopy = this.projSerializer.fromJson(node.data);
        const nodeCopy = this.treeNodeSerializer.fromJson(node);
        this.nodeConnector.connectArrowsToNodes(projCopy);
        nodeCopy.data = projCopy;
        array.push(nodeCopy);
        for (const child of node.children) {
            this.walkTree(child, array, ++iteration);
        }
    }

    public loadState(st: ProjectTreeState, nodes: TreeNode[]): Project {
        const first = nodes.find(x => x.id === 0);
        const selected = this.copyNode(first!);
        selected.data = this.projSerializer.fromJson(first!.data);
        st.head = selected;
        st.selected = selected;
        st.seedProject = this.projSerializer.fromJson(st.head.data);
        const ids = nodes.map(n => n.id);
        st.latestId = Math.max(...ids) + 1;
        st.latestGroupId = CONST.INITIAL_NODE_COUNT;
        this.buildBranch(st.head, nodes, null);
        nodes.forEach(n => this.nodeConnector.connectArrowsToNodes(n.data!));
        return this.projSerializer.fromJson(first!.data);
    }

    private buildBranch(current: TreeNode, nodes: TreeNode[], parent: TreeNode | null) {
        if (current) {
            if (parent) {
                parent.children.push(current);
                current.parent = parent;
            }
            const children = nodes.filter(x => x.parentNodeId === current.id);
            for (const child of children) {
                this.buildBranch(child, nodes, current);
            }
        }
    }
}
