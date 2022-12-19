import { Activity } from '../project/activity/activity';

export class ScheduleEntry {
    
    private endDate;
    private duration;
    public startDate;
    public activityId;

    constructor(a: Activity) {
        if (a == null) {
            this.endDate = null;
            this.duration = 0;
            this.startDate = null;
        } else {
            this.endDate = new Date(a.profile.planned_completion_date).getTime();
        }
        this.duration = a.profile.duration;
        this.activityId = a.profile.id;
        const start = new Date(a.profile.planned_completion_date).getTime() - 1000 * 60 * 60 * 24 * this.duration;
        this.startDate = start;
        return;
    }

    public isOverlap(startDate, endDate) {
        if (this.startDate < startDate && this.endDate > endDate) {
            return true;
        }
        if (this.startDate > startDate && this.startDate < endDate) {
            return true;
        }
        if (this.endDate > startDate && this.endDate < endDate) {
            return true;
        }
        if (this.startDate > startDate && this.endDate < endDate) {
            return true;
        }
        return false;
    }
}
