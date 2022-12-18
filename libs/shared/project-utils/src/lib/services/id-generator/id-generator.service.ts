import { Injectable } from '@angular/core';
import { Project } from '../../../models/project/project';

@Injectable({
    providedIn: 'root',
})
export class IdGeneratorService {
    constructor() {}

    public resetIds(project: Project): void {
        if (!project.profile.start || !project.profile.end) {
            return;
        }

        project.activities.forEach(a => {
            a.profile.id = null;
        });
        const currentId = 0;
        let idIndex = this.setIds(project, project.profile.start, currentId);
        project.activities
            .filter(x => x.profile.id === null)
            .forEach(a => {
                idIndex++;
                a.profile.id = idIndex;
            });
    }
    private setIds(project: Project, nodeId: number, idIndex: number): number {
        const outActivities = project.activities.filter(a => a.chartInfo.source_id === nodeId);
        if (outActivities.length === 0) {
            return idIndex;
        }

        for (const activity of outActivities) {
            if (activity.profile.id === null) {
                idIndex++;
                activity.profile.id = idIndex;
                idIndex = this.setIds(project, activity.chartInfo.target_id, idIndex);
            }
        }

        return idIndex;
    }
}
