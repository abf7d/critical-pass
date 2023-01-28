import { Injectable } from '@angular/core';
import { Project } from '@critical-pass/project/types';

@Injectable({
    providedIn: 'root',
})
export class ProjectSanatizerService {
    constructor() {}

    public sanatizeForSave(project: Project) {
        this.sanitizeNumbers(project);
        this.removeCircularStructure(project);
        this.calculateSortOrder(project);
    }

    public sanitizeNumbers(project: Project): void {
        project.integrations.forEach(i => {
            i.x = i.x ? Math.round(i.x) : i.x;
            i.y = i.y ? Math.round(i.y) : i.y;
        });
    }

    private removeCircularStructure(project: Project): void {
        for (const activity of project.activities) {
            if (activity.subProject.subGraphLoaded !== null && activity.subProject.subGraphLoaded !== undefined) {
                activity.subProject.subGraphLoaded.profile.parentProject = null;
                this.removeCircularStructure(activity.subProject.subGraphLoaded);
            }
        }
    }

    public updateIds(current: Project, next: Project): void {
        current.profile.id = next.profile.id;
        for (let i = 0; i < next.activities.length; ++i) {
            const nextAct = next.activities[i];
            const curAct = current.activities[i];
            if (nextAct.subProject.subGraphLoaded !== null && nextAct.subProject.subGraphLoaded !== undefined) {
                curAct.subProject.subGraphId = nextAct.subProject.subGraphId;
                if (curAct.subProject.subGraphLoaded !== undefined) {
                    this.updateIds(curAct.subProject.subGraphLoaded, nextAct.subProject.subGraphLoaded);
                }
            }
        }
    }

    private calculateSortOrder(project: Project) {
        project.activities.forEach((a, i) => (a.profile.sortOrder = i));
    }
}
