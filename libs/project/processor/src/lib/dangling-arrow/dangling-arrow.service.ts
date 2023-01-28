import { Injectable } from '@angular/core';
import { Project } from '@critical-pass/project/types';

@Injectable({
    providedIn: 'root',
})
export class DanglingArrowService {
    constructor() {}

    public calculateDanglingActivities(project: Project) {
        project.activities.forEach(a => {
            if (a.profile.depends_on === null || a.profile.depends_on === '') {
                a.assign.noDependencies = true;
            }
        });
        project.activities.forEach(activity => {
            const goTo = project.activities.find(a => {
                const deps = a.profile.depends_on == null ? '' : (a.profile.depends_on + '').split(',');
                return deps.indexOf('' + activity.profile.id) > -1;
            });
            if (goTo === undefined) {
                activity.assign.noGoto = true;
            }
        });
    }
}
