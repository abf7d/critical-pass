import { Project } from '../project/project';

export interface TreeNode {
    parent: TreeNode | null;
    children: TreeNode[];
    data: Project | null;
    name: string;
    id: number;
    group: number;
    subgroup: number;
    parentNodeId: number | null; // This is for reconstructing tree after file load
    metadata: ProjectMetadata | null;
}

export interface ProjectMetadata {
    assignmentCompleted: boolean;
    cost: number | null;
    time: number | null;
}
