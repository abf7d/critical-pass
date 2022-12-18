import { Injectable } from '@angular/core';
import { Project } from '../../../models/project/project';
import { subBusinessDays, addBusinessDays, lightFormat } from 'date-fns';
import * as Keys from '../../../constants/keys';

@Injectable({
    providedIn: 'root',
})
export class PcdAutogenService {
    constructor() {}

    public autogeneratePcds(project: Project) {
        if (project.activities.length < 1 || !project.activities[0].profile.planned_completion_date) {
            return;
        }
        const endDateOfStartActivity = project.activities[0].profile.planned_completion_date_dt;
        const startDate = subBusinessDays(endDateOfStartActivity, project.activities[0].profile.duration ?? 0);
        for (let i = 1; i < project.activities.length; ++i) {
            const activity = project.activities[i];
            if (!!activity.chartInfo.target && !!activity.chartInfo.target.eft) {
                const previousActivityFinish = +activity.chartInfo.target.eft;
                activity.profile.planned_completion_date = lightFormat(addBusinessDays(startDate, previousActivityFinish), Keys.mainDateFormat);
                activity.profile.planned_completion_date_dt = new Date(activity.profile.planned_completion_date);
                const actStart = subBusinessDays(activity.profile.planned_completion_date_dt, activity.profile.duration);
                activity.profile.start_date = lightFormat(actStart, Keys.mainDateFormat);
                activity.profile.start_date_dt = actStart;
            }
        }
    }
}
