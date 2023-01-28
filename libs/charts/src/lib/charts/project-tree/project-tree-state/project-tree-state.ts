import { Project, TreeNode } from "@critical-pass/project/types";

export interface ProjectTreeState {
    svg: any;
    mainG: any;
    innerWidth: number | null;
    innerHeight: number | null;
    focusLine: any;
    margin: { top: number; bottom: number; left: number; right: number };
    scales: { x: any; y: any } | null;

    selected: TreeNode | null;
    head: TreeNode | null;
    latestId: number;
    latestGroupId: number;
    seedProject: Project | null;
}

export class ProjectTreeFactory {
    create(): ProjectTreeState {
        return {
            svg: null,
            mainG: null,
            innerWidth: null,
            innerHeight: null,
            margin: { top: 60, right: 90, bottom: 100, left: 90 },
            scales: null,
            focusLine: null,
            selected: null,
            head: null,
            latestId: 0,
            latestGroupId: 0,
            seedProject: null
        };
    }
}
