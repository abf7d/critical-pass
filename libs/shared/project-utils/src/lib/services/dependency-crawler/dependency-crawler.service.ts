import { Injectable } from '@angular/core';
import { Activity } from '../../../models/project/activity/activity';
import { Integration } from '../../../models/project/integration/integration';
import { Project } from '../../../models/project/project';

@Injectable({
    providedIn: 'root',
})
export class DependencyCrawlerService {
    constructor() {}

    public setDependencyDataFromGraph(project: Project): void {
        for (const activity of project.activities) {
            const deps = this.getActivityDependencies(project, activity);
            activity.profile.depends_on = deps.toString();
        }
    }
    public getActivityDependencies(project: Project, activity: Activity): number[] {
        if (activity.chartInfo.milestoneNodeId !== null) {
            const milestoneDeps = this.setMilestoneDependencies(project, activity.chartInfo.milestoneNodeId);
            return milestoneDeps;
        }
        const inArrows = this.getInArrows(activity.chartInfo.source, project);
        let deps = [];
        for (const a of inArrows) {
            if (a.chartInfo.isDummy) {
                const dummyDeps = this.getActivityDependencies(project, a);
                deps = this.union(dummyDeps, deps);
            } else {
                deps.push(a.profile.id);
            }
        }
        deps = this.uniq(deps); 
        return deps;
    }
    private uniq(array: number []): number[] {
      return [...new Set(array)];
    }
    private union(array1: number[], array2: number[]) {
      const set1 = new Set(array1);
      const set2 = new Set(array2);
      return [... new Set([...set1, ...set2])];
    }
    private getInArrows(node: Integration, project: Project) {
      return project.activities.filter( a => a.chartInfo.target === node);
    }
    private setMilestoneDependencies(project: Project, milestoneId: number): number [] {
        if (milestoneId === null) {
            return;
        }
        const milestoneNode = project.integrations.find(x => x.id === milestoneId);
        if (milestoneNode) {
            const inComing = project.activities.filter(a => a.chartInfo.target_id === milestoneNode.id);
            let deps = [];
            for (const a of inComing) {
                if (a.chartInfo.isDummy) {
                    const dummyDeps = this.getActivityDependencies(project, a);
                    deps = this.union(dummyDeps, deps);
                } else {
                    deps.push(a.profile.id);
                }
            }
            deps = this.uniq(deps);
            return deps;
        }
    }
}
