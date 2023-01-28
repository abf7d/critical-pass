import { Injectable } from '@angular/core';
import { Project } from '@critical-pass/project/types';

@Injectable({
    providedIn: 'root',
})
export class CompletionCalcService {
    constructor() {}

    public calculateCompleted(project: Project) {
        for (const link of project.activities) {
            const completed = !!link.profile.finish;
            link.processInfo.completed = completed;
            if (link.chartInfo.target == null || link.chartInfo.source == null) {
                continue;
            }
            if (!link.chartInfo.target.completed) {
                link.chartInfo.target.completed = completed;
            }
            if (!link.chartInfo.source.completed) {
                link.chartInfo.source.completed = completed;
            }
        }

        for (const link of project.activities) {
            if (
                (link.chartInfo.target != null || link.chartInfo.source != null) &&
                link.chartInfo.isDummy &&
                link.chartInfo.target?.completed === true &&
                link.chartInfo.source?.completed === true
            ) {
                link.processInfo.completed = true;
            }
        }
    }
}
