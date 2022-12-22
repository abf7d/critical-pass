import { Injectable } from '@angular/core';
import { Project } from '@critical-pass/project/models';
import { subBusinessDays, addBusinessDays, lightFormat } from 'date-fns';
 import { P_CONST } from '@critical-pass/project/processor'

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
        if (endDateOfStartActivity !== null) {
            const startDate = subBusinessDays(endDateOfStartActivity, project.activities[0].profile.duration ?? 0);
            for (let i = 1; i < project.activities.length; ++i) {
                const activity = project.activities[i];
                if (!!activity.chartInfo.target && !!activity.chartInfo.target.eft) {
                    const previousActivityFinish = +activity.chartInfo.target.eft;
                    activity.profile.planned_completion_date = lightFormat(addBusinessDays(startDate, previousActivityFinish), P_CONST.MAIN_DATE_FORMAT);
                    activity.profile.planned_completion_date_dt = new Date(activity.profile.planned_completion_date);
                    const actStart = subBusinessDays(activity.profile.planned_completion_date_dt, activity.profile.duration ?? 0);
                    activity.profile.start_date = lightFormat(actStart, P_CONST.MAIN_DATE_FORMAT);
                    activity.profile.start_date_dt = actStart;
                }
            }
        }
    }
}
