import { ChangeDetectorRef, Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { getDay } from 'date-fns';
import { GridEventsService } from './grid-events/grid-events.service';
import { Activity, ActivityProfile, Project } from '@critical-pass/project/models';

@Component({
    selector: 'cp-activity-grid',
    templateUrl: './activity-grid.component.html',
    styleUrls: ['./activity-grid.component.scss'],
})
export class ActivityGridComponent implements OnInit, OnDestroy {
    @Input() id!: number;
    public project!: Project;
    public showDummies: boolean = false;
    private subscription: Subscription | null = null;
    private viewDumSub: Subscription | null = null;

    constructor(private zone: NgZone, private events: GridEventsService) {}

    public ngOnInit() {
        this.events.id = this.id;
        this.showDummies = false;
        this.events.init();
        this.subscription = this.events.project$.pipe(filter(x => !!x)).subscribe(project => {
            this.zone.run(() => {
                this.project = project;
            });
        });
        this.viewDumSub = this.events.viewDummies$.pipe(filter(x => x !== null && x !== undefined)).subscribe(show => {
            this.showDummies = show;
        });
    }

    public ngOnDestroy() {
        this.subscription?.unsubscribe();
        this.viewDumSub?.unsubscribe();
    }

    public startEditDeps(activity: Activity): void {
        this.events.startEditDeps(activity, this.project);
    }

    public submitEditDepsClicked(activity: Activity): void {
        this.events.submitEditDepsClicked(activity, this.project);
    }

    public cancelEditDepsClicked(activity: Activity): void {
        this.events.cancelEditDepsClicked(activity, this.project);
    }

    public editDepsClicked(activity: Activity): void {
        this.events.editDepsClicked(activity, this.project);
    }

    public drop(event: CdkDragDrop<string[]>): void {
        this.events.drop(event, this.project);
    }

    public updateStartDate(date: Date | null, profile: ActivityProfile) {
        this.events.updateDate(date, profile, 'start_date', this.project);
    }

    public updateFinishDate(date: Date | null, profile: ActivityProfile) {
        this.events.updateDate(date, profile, 'finish', this.project);
    }

    public updatePCD(date: Date | null, activity: Activity): void {
        if (date) {
            this.events.updatePCD(date, activity, this.project);
        }
    }

    public updateDuration(activity: Activity, duration: string): void {
        this.events.updateDuration(activity, +duration, this.project);
    }

    public updateProject() {
        this.events.updateProject(this.project, true);
    }

    public removeActivity(activity: Activity): void {
        this.events.removeActivity(activity, this.project);
    }

    public dateFilter(date: Date | null): boolean {
        const dayNum = getDay(date || new Date());
        return dayNum !== 0 && dayNum !== 6;
    }

    public updatName(): void {
        this.events.updateProject(this.project, false);
    }

    public sortBy(column: string): void {
        this.events.sortBy(column, this.project);
    }
}
