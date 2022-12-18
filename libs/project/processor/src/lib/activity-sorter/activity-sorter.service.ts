import { Injectable } from '@angular/core';
import { Activity } from '../../../models/project/activity/activity';
import { Project } from '../../../models/project/project';
import { PlanningResource } from '../../../models/scheduling/planning-resource';

@Injectable({
    providedIn: 'root',
})
export class ActivitySorterService {
    constructor() {}

    public sortDummiesLast(project: Project): void {
        const ordered = project.activities.sort((a, b) => a.profile.id - b.profile.id);
        const nonDummies = ordered.filter(a => !a.chartInfo.isDummy || a.chartInfo.milestoneNodeId !== null);
        const dummies = ordered.filter(a => a.chartInfo.isDummy && a.chartInfo.milestoneNodeId === null);
        dummies.forEach(a => nonDummies.push(a));
        project.activities = nonDummies;
    }

    public reorderIds(project: Project): void {
        project.activities.sort((a, b) => a.profile.id - b.profile.id);
        const nonEmpty = project.activities.filter((a: Activity) => a.profile.planned_completion_date !== null);
        const empty = project.activities.filter((a: Activity) => a.profile.planned_completion_date === null);
        const orderedList = nonEmpty.concat(empty);
        project.activities = orderedList;
        project.activities.forEach((x, i) => {
            x.profile.sortOrder = i;
        });

        project.activities.forEach((x, i) => {
            x.profile.sortOrder = i;
        });
    }

    public sortById(project: Project): void {
        project.activities.sort((a, b) => a.profile.id - b.profile.id);
        project.activities.forEach(a => (a.assign.isStartBranch = false));
    }

    public sortByBranches(project: Project): void {
        const phasedActivities = project.activities.filter(a => a.assign.phases.length > 0);
        const byPhase = phasedActivities.length > 0;
        let resourceGroups: PlanningResource[][] = [];
        const activities = project.activities.filter(a => a.profile.planned_completion_date !== null && a.profile.duration !== 0);
        const invalidActivities = project.activities.filter(a => a.profile.planned_completion_date === null || a.profile.duration === 0);
        this.sortActivitiesForResources(activities);
        if (byPhase === true) {
            const phases = project.phases.map(p => p.name);
            const uniquePhases = phases.filter((value, index, self) => self.indexOf(value) === index);
            uniquePhases.forEach(phase => {
                const phaseActivities = activities.filter(a => {
                    const foundPhase = a.assign.phases.find(p => p.name === phase);
                    return foundPhase !== undefined;
                });
                const phaseResources = this.assignResources(phaseActivities);
                resourceGroups.push(phaseResources);
            });
        } else {
            const resourceGroup = this.assignResources(activities);
            resourceGroups.push(resourceGroup);
        }
        resourceGroups = resourceGroups.filter(rg => rg !== undefined);
        this.sortActivities(project, resourceGroups, invalidActivities);
    }

    private sortActivities(project: Project, resourceGroups: PlanningResource[][], invalidActivities: Activity[]): void  {
        const activities: Activity[] = [];
        resourceGroups.forEach(rg => {
            rg.forEach(resource => {
                const sortedSchedule = resource.schedule.sort((a, b) => a.startDate - b.startDate);
                let index = 0;
                sortedSchedule.forEach(entry => {
                    const found = project.activities.find(a => a.profile.id === entry.activityId);
                    if (found !== null) {
                        if (index === 0) {
                            found.assign.isStartBranch = true;
                        }
                        activities.push(found);
                    }
                    index++;
                });
            });
        });
        invalidActivities.forEach(i => {
            activities.push(i);
        });
        project.activities = activities;
    }

    private getStartDate(activity: Activity): number {
        const startDate = new Date(activity.profile.planned_completion_date);
        const startDateDays = startDate.getTime() - 1000 * 60 * 60 * 24 * activity.profile.duration;

        return startDateDays;
    }

    private sortActivitiesForResources(activities: Activity[]): Activity[] {
        activities.sort((a, b) => {
            return this.getStartDate(a) - this.getStartDate(b);
        });

        activities.sort((a, b) => {
            return a.chartInfo.tf - b.chartInfo.tf;
        });
        return activities;
    }

    private assignResources(activities: Activity[]): PlanningResource[] {
        const isValid = this.validateActivities(activities);
        if (!isValid) {
            return;
        }
        const resources: PlanningResource[] = [];
        activities.forEach(a => {
            if (a.chartInfo.isDummy === false) {
                this.setResource(a, resources);
            }
        });
        return resources;
    }

    private validateActivities(activities: Activity[]): boolean {
        const validTime = activities.filter(a => this.validTimeframe(a));
        return validTime.length > 0;
    }

    private validTimeframe(activity: Activity): boolean {
        if (activity.profile.planned_completion_date === null || activity.profile.duration === 0) {
            return false;
        }
        return true;
    }

    private setResource(activity: Activity, resources: PlanningResource[]): void {
        if (resources.length === 0) {
            const resource = new PlanningResource();
            resource.name = 'Resource 1';
            resource.scheduleActivity(activity);
            resources.push(resource);
            return;
        }
        // iterate through resources, if free then set, if non free then create
        let resourceScheduled = false;
        resources.forEach(r => {
            if (!resourceScheduled) {
                const isScheduled = r.scheduleActivity(activity);
                resourceScheduled = resourceScheduled || isScheduled;
            }
        });
        if (!resourceScheduled) {
            const resource = new PlanningResource();
            resource.name = 'Resource ' + (resources.length + 1);
            resource.scheduleActivity(activity);
            resources.push(resource);
        }
    }
}
