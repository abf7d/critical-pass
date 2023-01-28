import { Injectable } from '@angular/core';
import { StackedResourcesState } from '../stacked-resources-state/stacked-resources-state';
import * as d3 from 'd3';
import { Activity, Project, Resource, Role } from '@critical-pass/project/types';

@Injectable({
    providedIn: 'root',
})
export class StackedResourcesSchedulerService {
    barWidth: number;
    size: number;

    constructor() {
        this.barWidth = 25;
        this.size = 1200;
    }

    getStackedResourceData(project: Project, state: StackedResourcesState) {
        this.barWidth = state.barWidth!;
        this.size = state.innerWidth!;
        const validActivities = this.getValidActivities(project);
        if (validActivities.length === 0) {
            return null;
        }
        const uniqueRoles = this.getUniqueRoles(project);
        const bars = this.splitProjectIntoEqualTimeframes(project);
        this.initRolesForBars(uniqueRoles, bars);
        this.proccessDataForBars(project.resources, validActivities, bars);
        return bars;
    }
    getValidActivities(project: Project): Activity[] {
        const validTime = project.activities.filter(a => this.validTimeframe(a));
        const validResources = validTime.filter(a => a.assign.resources.length > 0);
        return validResources;
    }
    validTimeframe(activity: Activity): boolean {
        if (activity.profile.planned_completion_date_dt === null || activity.profile.duration === null) {
            return false;
        }
        return true;
    }
    getUniqueRoles(project: Project): Role[] {
        const roles = project.roles.filter(r => r.name);
        return roles;
    }
    splitProjectIntoEqualTimeframes(project: Project) {
        const activitiesWithDates = project.activities.filter(a => a.profile.planned_completion_date_dt !== null && a.profile.duration !== 0);
        const timeFrames = activitiesWithDates.map(a => {
            return {
                date: this.getPlannedStartDate(a),
                duration: a.profile.duration,
            };
        });
        const sortedStart = timeFrames.sort((a, b) => a.date.getTime() - b.date.getTime());
        const start = sortedStart[0];
        const startDateMs = start.date.getTime();
        const sortedEnd = timeFrames.sort((a, b) => this.getDateFromStart(a) - this.getDateFromStart(b));
        const end = sortedEnd[sortedEnd.length - 1];
        const endDateMs = this.getDateFromStart(end);
        const span = endDateMs - startDateMs;
        const numBars = Math.ceil(this.size / this.barWidth);
        const interval = Math.floor((span * this.barWidth) / this.size);
        const bars = [];
        let prevMs = Math.ceil(startDateMs + interval / 2);
        for (let i = 0; i < numBars; ++i) {
            bars.push({
                midDate: new Date(prevMs),
                startDate: new Date(prevMs - interval / 2),
                endDate: new Date(prevMs + interval / 2),
                unmarked: 0,
            });
            prevMs = prevMs + interval;
        }
        return bars;
    }
    getDateFromTimeframe(frame: Frame) {
        const milisecs = this.getDateFromStart(frame);
        const date = new Date(milisecs);
        return date;
    }
    getDateFromStart(time: Frame) {
        const durationMs = time.duration! * 1000 * 60 * 60 * 24;
        return time.date.getTime() + durationMs;
    }
    getActivityPlannedEndMs(activity: Activity) {
        return activity.profile.planned_completion_date_dt!.getTime();
    }
    getPlannedStart(activity: Activity) {
        const durationMs = activity.profile.duration! * 1000 * 60 * 60 * 24;
        const start = activity.profile.planned_completion_date_dt!.getTime() - durationMs;
        return start;
    }
    getPlannedStartDate(activity: Activity) {
        const durationMs = activity.profile.duration! * 1000 * 60 * 60 * 24;
        const start = activity.profile.planned_completion_date_dt!.getTime() - durationMs;
        return new Date(start);
    }
    initRolesForBars(roles: Role[], bars: any[]) {
        if (roles.length === 0 || bars.length === 0) {
            return bars;
        }
        bars.forEach(b => {
            roles.forEach(r => {
                const regex = new RegExp(' ', 'g');
                const str = r.name.replace(regex, '_');
                b[str] = 0;
            });
        });
        return bars;
    }
    proccessDataForBars(resourceConfigs: Resource[], validActivities: Activity[], bars: any[]) {
        resourceConfigs.forEach(r => {
            const usersActivities = this.getUsersActivities(r, validActivities);
            if (usersActivities.length > 0) {
                if (r.profile.chargeInbetweenTasks) {
                    const sorted = usersActivities.sort((a, b) => this.getPlannedStart(a) - this.getPlannedStart(b));
                    const resourceStartDateMs = this.getPlannedStart(sorted[0]);
                    const endSorted = usersActivities.sort((a, b) => this.getActivityPlannedEndMs(a) - this.getActivityPlannedEndMs(b));
                    const resourceEndDateMs = this.getActivityPlannedEndMs(endSorted[endSorted.length - 1]);
                    bars.forEach(bar => {
                        const fits = this.barFitsWithinActivityTimeframe(resourceStartDateMs, resourceEndDateMs, bar);
                        if (fits) {
                            this.incrementRoleOnbar(r, bar);
                        }
                    });
                } else {
                    usersActivities.forEach(activity => {
                        const activityStartMs = this.getPlannedStart(activity);
                        const activityEndMs = this.getActivityPlannedEndMs(activity);
                        bars.forEach(bar => {
                            const fits = this.barFitsWithinActivityTimeframe(activityStartMs, activityEndMs, bar);
                            if (fits) {
                                this.incrementRoleOnbar(r, bar);
                            }
                        });
                    });
                }
            }
        });
        // for each resourceConfigs
        // getUsersActivities
        // if resourceConfig.chargeInBetweenTasks
        // take startDate of the first activity and end date of last
        // the take all bars between those dates and increment the resources role
        // if not chargeInBetweenTasks find the bars that fall into the timeframe of each activity
        // and increment the role on the bar
    }

    // Used to determine if charege in between tasks
    getUsersActivities(resource: Resource, activities: Activity[]): Activity[] {
        const filtered = activities.filter(a => this.activityContainsResource(a, resource.profile.name));
        return filtered;
    }
    activityContainsResource(activity: Activity, name: string) {
        const summary = activity.assign.resources.find(r => r.name === name);
        return summary != null;
    }
    barFitsWithinActivityTimeframe(startDate: number, endDate: number, bar: Bar) {
        const barStart = bar.startDate.getTime();
        const barEnd = bar.endDate.getTime();
        if (
            (startDate <= barStart && barStart < endDate) || // Start date of bar splits acgtivity start and end
            (startDate < barEnd && barEnd <= endDate) || // End date of bar splits acgtivity start and end
            (startDate <= barStart && barEnd <= endDate) || // The activity's timeframe contains the bar's timeframe
            (barStart <= startDate && endDate <= barEnd)
        ) {
            // The bar's timeframe contains the activity's timeframe
            return true;
        }
        return false;
    }
    incrementRoleOnbar(resource: Resource, bar: any) {
        const role = resource.assign.roles.find(r => r.name !== '');
        let adjusted = null;
        if (role === undefined) {
            adjusted = 'unmarked';
        } else {
            const regex = new RegExp(' ', 'g');
            adjusted = role.name.replace(regex, '_');
        }
        if (bar[adjusted] !== undefined) {
            bar[adjusted]++;
        }
    }
}

export interface Frame {
    date: Date;
    duration?: number;
}

export interface Bar {
    midDate: Date;
    startDate: Date;
    endDate: Date;
    unmarked: number;
}
