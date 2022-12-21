import { Inject, Injectable } from '@angular/core';
import { Project } from '@critical-pass/project/models';
// import { LoggerBase } from '../../../models/base/logger-base';
// import { Project } from '../../../models/project/project';

@Injectable({
    providedIn: 'root',
})
export class ProjectValidatorService {
    constructor(/*@Inject('LoggerBase') private logger: LoggerBase*/) {}

    public validateProject(project: Project) {
        if (project.profile.start === null || !project.profile.end === null) {
            return false;
        }

        const hasDups = this.hasDuplicates(project);
        if (hasDups) {
            // this.logger.error('dups', project.integrations, project.activities);
            console.error('project has dups');
            return false;
        }
        return true;
    }
    public hasDuplicates(project: Project) {
        const dups = project.integrations.filter(i => project.integrations.filter(x => x.id === i.id).length > 1);
        return dups.length > 0;
    }
}
