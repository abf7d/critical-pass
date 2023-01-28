import { Activity } from '../project/activity/activity';
import { ScheduleEntry } from './schedule-entry';

export class PlanningResource {
    public name;
    public schedule: ScheduleEntry[];
    constructor() {
        this.name = '';
        this.schedule = [];
    }
    public scheduleActivity(activity: Activity) {
        let isAvailable = true;
        for (const entry of this.schedule) {
            isAvailable = isAvailable && !this.isOverlap(entry, activity);
        }
        if (isAvailable) {
            const newEntry = new ScheduleEntry(activity);
            this.schedule.push(newEntry);
            return true;
        }
        return false;
    }

    public isOverlap(entry: ScheduleEntry, activity: Activity): boolean {
        if (!activity.profile.planned_completion_date || activity.profile.duration === undefined) {
            return false;
        }
        const endDate = new Date(activity.profile.planned_completion_date);
        const startDate = new Date(endDate.getTime() - 60 * 60 * 1000 * 24 * activity.profile.duration);
        return entry.isOverlap(startDate.getTime(), endDate.getTime());
    }
}
