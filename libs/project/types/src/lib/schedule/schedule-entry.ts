import { Activity } from '../project/activity/activity';

export class ScheduleEntry {
    private endDate: number | null;
    private duration: number | null;
    public startDate: number | null;
    public activityId;

    constructor(a: Activity) {
        if (a == null || !a.profile.planned_completion_date) {
            this.endDate = null;
            this.duration = 0;
            this.startDate = null;
        } else {
            this.endDate = new Date(a.profile.planned_completion_date).getTime();
        }
        this.duration = a.profile.duration ?? 0;
        this.activityId = a.profile.id;
        const start = new Date(a.profile.planned_completion_date ?? '').getTime() - 1000 * 60 * 60 * 24 * this.duration;
        this.startDate = start;
        return;
    }

    public isOverlap(startDate: number, endDate: number) {
        if (!this.startDate || !this.endDate) {
            return false;
        }
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
