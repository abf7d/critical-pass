import { Injectable } from '@angular/core';
import { Activity, Project, TreeNode } from '@critical-pass/project/models';
// import { TreeNode } from '../../../models/assign/tree-node';
// import { Activity } from '../../../models/project/activity/activity';
// import { Project } from '../../../models/project/project';
import { parse } from 'date-fns';
// import * as Keys from '../../../constants/keys';
// import * as CONST from '../../constants';
import { P_CONST } from '@critical-pass/project/processor';

@Injectable({
    providedIn: 'root',
})
export class IndirectCostCalculatorService {
    constructor() {}

    public calculateIndirectCosts(project: Project): number | null {
        const isValid = this.validateNodeCost(project);
        if (isValid) {
            return this.calculateResourcesCost(project);
        }
        return null;
    }

    private validateNodeCost(project: Project): boolean {
        let isCompleted = true;
        let hasProjDurations = true;
        isCompleted = isCompleted && project.activities.filter(x => !x.chartInfo.isDummy && x.assign.resources.length === 0).length === 0;
        hasProjDurations = hasProjDurations && this.getTimeSpanBetweenPoints(project.activities) !== 0;
        return isCompleted;
    }

    private calculateResourcesCost(project: Project) {
        // Have multiplier or another way to calculate salary
        // Get timespan between all activities
        // const projectDuration = this.getTimeSpanBetweenPoints(project.activities);
        let totalCost = 0;
        for (const resource of project.resources) {
            const resourcesActivities = project.activities.filter(a => a.assign.resources.filter(r => r.id === resource.id).length > 0);
            let timeSpan = 0;
            if (resourcesActivities.length > 0) {
                const chargeBetween = true;
                if (chargeBetween) {
                    // Sort, get all source nodes, get earliest lft, get all target nodes, get latest lft, subtract the two to get the time inbtween
                    timeSpan = this.getDaysBetweenPoints(resourcesActivities, project);
                } else {
                    timeSpan = this.getDiscreteActivitiesTimeSpan(resourcesActivities);
                }
                totalCost = totalCost + this.calculateCostFromSpan(resource.id, timeSpan, project);
            }
        }
        return totalCost;
    }
    private getDaysBetweenPoints(activities: Activity[], project: Project) {
        const sources = project.integrations.filter(i => activities.find(a => a.chartInfo.source_id === i.id) !== null);
        const targets = project.integrations.filter(i => activities.find(a => a.chartInfo.target_id === i.id) !== null);
        if (sources.length > 0 && targets.length > 0) {
            const sortedStarts = sources.map(s => s.lft).sort((a, b) => a - b);
            const sortedEnds = targets.map(s => s.lft).sort((a, b) => a - b);
            const span = sortedEnds[sortedEnds.length - 1] - sortedStarts[0];
            return span;
        }
        return 0;
    }

    // Commented out because TreeNode should be in Chart and not here? This is for time const chart in AssignResources so we can plot cost...
    // Maybe it should be here, tree node is apart of planning
    private validateNodesCost(nodes: TreeNode[], project: Project): boolean {
        let isCompleted = true;
        let hasProjDurations = true;
        for (const node of nodes) {
            isCompleted = isCompleted && node.data.activities.filter(x => x.assign.resources.length === 0).length === 0;
            hasProjDurations = hasProjDurations && this.getTimeSpanBetweenPoints(node.data.activities) !== 0;
        }

        return isCompleted;
    }
    private calculateCostFromSpan(resourceId: number, timeSpan: number, project: Project): number {
        const resource = project.resources.find(r => r.id === resourceId);
        if (resource !== undefined) {
            return Math.round(resource.profile.skillMultiplier * timeSpan);
        }
        return timeSpan;
    }
    private getTimeSpanBetweenPoints(activities: Activity[]): number {
        const sorted = activities.filter(a => !a.chartInfo.isDummy).sort((a, b) => this.getPlannedStart(a) - this.getPlannedStart(b));
        const resourceStartDateMs = this.getPlannedStart(sorted[0]);
        const endSorted = activities.filter(a => !a.chartInfo.isDummy).sort((a, b) => this.getActivityPlannedEndMs(a) - this.getActivityPlannedEndMs(b));
        const resourceEndDateMs = this.getActivityPlannedEndMs(endSorted[endSorted.length - 1]);
        const span = (resourceEndDateMs - resourceStartDateMs) / (1000 * 60 * 60 * 24);

        return Math.round(span);
    }
    private getDiscreteActivitiesTimeSpan(resourcesActivities: Activity[]): number {
        let totalSpan = 0;
        for (const act of resourcesActivities) {
            totalSpan = totalSpan + this.getActivitySpan(act);
        }
        return totalSpan;
    }

    private getActivitySpan(activity: Activity) {
        const startMs = this.getPlannedStart(activity);
        const endMs = this.getActivityPlannedEndMs(activity);
        const span = (endMs - startMs) / (1000 * 60 * 60 * 24);
        return Math.round(span);
    }

    // TODO: planned completion date is null here because the project coming from the backend doesn't have pcd on it. Need to transfer
    // pcd from the nodeProject to the new calculated one and make sure the values are not null. Step through the backend
    private getPlannedStart(activity: Activity): number {
        if (!activity || activity.profile.duration === undefined || activity.profile.planned_completion_date_dt === null) {
            return 0;
        }
        const pcdIsValid = parse(activity.profile.planned_completion_date ?? '', P_CONST.MAIN_DATE_FORMAT, new Date()); //isValid(activity.profile.planned_completion_date); //moment(activity.profile.planned_completion_date, 'M/D/YYYY');

        if (!isNaN(pcdIsValid.getTime())) {
            activity.profile.planned_completion_date_dt = pcdIsValid; //pcd.toDate();
        }

        const durationMs = activity.profile.duration * 1000 * 60 * 60 * 24;
        const start = activity.profile.planned_completion_date_dt.getTime() - durationMs;
        return start;
    }

    private getActivityPlannedEndMs(activity: Activity): number {
        if(!activity.profile.planned_completion_date || activity.profile.duration === undefined || activity.profile.planned_completion_date_dt === null) {
            return 0;
        }
        const pcdIsValid = parse(activity.profile.planned_completion_date, P_CONST.MAIN_DATE_FORMAT, new Date()); //isValid(activity.profile.planned_completion_date);

        if (!isNaN(pcdIsValid.getTime())) {
            activity.profile.planned_completion_date_dt = pcdIsValid; //pcd.toDate();
        }
        let durationMs = activity.profile.duration * 1000 * 60 * 60 * 24;
        return activity.profile.planned_completion_date_dt.getTime() + durationMs;
    }

    private getPlannedStartDate(activity: Activity): Date | null{
        if (activity.profile.duration === undefined || activity.profile.planned_completion_date === undefined || activity.profile.planned_completion_date_dt === null){
            return null;
        }
        const pcdIsValid = parse(activity.profile.planned_completion_date, P_CONST.MAIN_DATE_FORMAT, new Date()); //isValid(activity.profile.planned_completion_date);

        if (!isNaN(pcdIsValid.getTime())) {
            activity.profile.planned_completion_date_dt = pcdIsValid; //pcd.toDate();
        }

        const durationMs = activity.profile.duration * 1000 * 60 * 60 * 24;
        const start = activity.profile.planned_completion_date_dt.getTime() - durationMs;
        return new Date(start);
    }
}
