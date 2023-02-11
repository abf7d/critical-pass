import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActivitySorterService } from '@critical-pass/project/processor';
import { Activity, ActivityProfile, Project } from '@critical-pass/project/types';
import { DashboardService, DASHBOARD_TOKEN } from '@critical-pass/shared/data-access';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AssignFrameworkService } from '../../services/assign-framework/assign-framework.service';

@Component({
    selector: 'cp-assign-activity-grid',
    templateUrl: './assign-activity-grid.component.html',
    styleUrls: ['./assign-activity-grid.component.scss'],
})
export class AssignActivityGridComponent implements OnInit {
    @Input() id!: number;
    public project!: Project;
    private subscription!: Subscription;
    public isEditing = false;
    public sortByBranch = true;
    public activities: Activity[] = [];
    constructor(
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        private aManager: AssignFrameworkService,
        private activitySorter: ActivitySorterService,
    ) {}
    ngOnInit() {
        this.subscription = this.dashboard.activeProject$.pipe(filter(x => !!x)).subscribe(project => {
            this.project = project;
            const selectedAct = this.project.profile.view.lassoedLinks;
            if (selectedAct.length > 0) {
                this.activities = this.project.activities.filter(x => selectedAct.includes(x.profile.id));
            } else {
                this.activities = this.project.activities;
            }
        });
    }

    public isAssigned(activity: Activity) {
        let colorBy = 'resource';
        let assigned = false;
        switch (colorBy) {
            case 'phase':
                assigned = activity.assign.phases.length > 0;
                break;
            case 'resource':
                assigned = activity.assign.resources.length > 0;
                break;
        }
        return assigned;
    }
    public ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    public getColorClassForActivity(a: Activity) {
        return this.aManager.getColorClassForActivity(a);
    }
    public getTagColor(t: any) {
        this.aManager.getTagColor(t);
    }
    public selectActivity(activity: Activity, index: number) {
        this.aManager.itemClicked(activity, index, this.project);
    }

    public keyUp(event: KeyboardEvent) {
        this.aManager.keyUp(event.which);
    }
    public keyDown(event: KeyboardEvent) {
        event.preventDefault();
        event.stopPropagation();

        return this.aManager.keyDown(event.which);
    }

    public updateProject() {}
    public updateStartDate(date: Date, profile: ActivityProfile) {}
    public updateFinishDate(date: Date, profile: ActivityProfile) {}
    public updatePCDDate(date: Date, profile: ActivityProfile) {}
    public sortIds() {
        this.activitySorter.sortById(this.project);
        this.dashboard.updateProject(this.project, false);
        this.sortByBranch = true;
    }
    public sortBranches() {
        this.activitySorter.sortByBranches(this.project);
        this.dashboard.updateProject(this.project, false);
        this.sortByBranch = false;
    }
    public setAssignInteraction(state: any) {}
}
