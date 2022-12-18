import { Injectable } from '@angular/core';
import { Activity } from '../../../models/project/activity/activity';
import { Project } from '../../../models/project/project';
import { Stats, StatsCalculatorService } from '../stats-calculator/stats-calculator.service';
import { getISODay, subBusinessDays } from 'date-fns';

@Injectable({
    providedIn: 'root',
})
export class ActivityValidatorService {
    constructor(private statsCalc: StatsCalculatorService) {}

    public validateActivities(project: Project) {
        const stats = this.statsCalc.getStatProps(project, 0);
        project.activities.forEach(a => {
            this.validateProperties(a, project, stats);
        });
    }
    private validateProperties(activity: Activity, project: Project, stats: Stats) {
        const remainder = +activity.profile.duration % 5;
        if (!isNaN(activity.profile.duration) && activity.profile.duration) {
            if (remainder !== 0) {
                activity.errors.showDivisibleBy5Error = true;
            } else {
                activity.errors.showDivisibleBy5Error = false;
            }

            if (!activity.chartInfo.isDummy) {
                activity.errors.showAbnormalError = !this.withinStd(activity, project, stats);
            }
        } else {
            activity.errors.showDivisibleBy5Error = false;
        }
        const d = new Date(activity.profile.planned_completion_date);

        if (!isNaN(d.getTime())) {
            const newMin = subBusinessDays(d, +activity.profile.duration - 1);
            const n = getISODay(newMin);
            const count = project.activities.length;
            let firstActivityId = null;
            if (count > 0) {
                firstActivityId = project.activities[0].profile.id; // take start node and the first activity
            }
            if (((firstActivityId !== null && count === 0) || firstActivityId === activity.profile.id) && n !== 1) {
                activity.errors.showMondayStartError = true;
            } else {
                activity.errors.showMondayStartError = false;
            }
        } else {
            activity.errors.showMondayStartError = false;
        }
    }

    private withinStd(activity: Activity, project: Project, stats: Stats) {
        const low = stats.mean - +project.profile.numStDev * stats.deviation;
        const hi = stats.mean + +project.profile.numStDev * stats.deviation;
        return activity.profile.duration > low && activity.profile.duration < hi;
    }
}
