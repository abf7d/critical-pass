import { Component, Inject } from '@angular/core';
import { Activity, Project } from '@critical-pass/project/types';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { filter, Subscription } from 'rxjs';

@Component({
    selector: 'cp-arrow-list',
    templateUrl: './arrow-list.component.html',
    styleUrls: ['./arrow-list.component.scss'],
})
export class ArrowListComponent {
    private sub?: Subscription;
    public project?: Project;
    constructor(@Inject(DASHBOARD_TOKEN) private dashboard: DashboardService, @Inject(EVENT_SERVICE_TOKEN) private eventService: EventService) {}
    public ngOnInit(): void {
        this.sub = this.dashboard.activeProject$.pipe(filter(x => !!x)).subscribe(project => {
            this.project = project; //.activities[0].profile.n;
            console.log('project', project);
        });
    }
    public selectActivity(activity: Activity) {
        this.project!.profile.view.selectedActivity = activity;
        this.dashboard.updateProject(this.project!);
    }
    public ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }
}
