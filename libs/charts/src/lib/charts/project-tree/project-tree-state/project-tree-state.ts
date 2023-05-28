import { Injectable } from '@angular/core';
import { Project, TreeNode } from '@critical-pass/project/types';

@Injectable({
    providedIn: 'root',
})
export class ProjectTreeStateService {
    svg: any = null;
    mainG: any = null;
    innerWidth: number | null = null;
    innerHeight: number | null = null;
    focusLine: any = null;
    margin: { top: number; bottom: number; left: number; right: number } = { top: 60, right: 90, bottom: 100, left: 90 };
    scales: { x: any; y: any } | null = null;

    selected: TreeNode | null = null;
    head: TreeNode | null = null;
    latestId: number = 0;
    latestGroupId: number = 0;
    seedProject: Project | null = null;

    reset() {
        this.svg = null;
        this.mainG = null;
        this.innerWidth = null;
        this.innerHeight = null;
        this.focusLine = null;
        this.margin = { top: 60, right: 90, bottom: 100, left: 90 };
        this.scales = null;

        this.selected = null;
        this.head = null;
        this.latestId = 0;
        this.latestGroupId = 0;
        this.seedProject = null;
    }
}
