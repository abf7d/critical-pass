import { Component, Inject } from '@angular/core';
import { Project } from '@critical-pass/project/types';
import { DashboardService, DASHBOARD_TOKEN } from '@critical-pass/shared/data-access';
import { filter, Subscription } from 'rxjs';

@Component({
    selector: 'cp-resource-arrow',
    templateUrl: './resource-arrow.component.html',
    styleUrls: ['./resource-arrow.component.scss'],
})
export class ResourceArrowComponent {
    public isLassoOn: boolean = false;
    public project: Project | null = null;
    public sub!: Subscription;
    constructor(
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
    ) { }

    ngOnInit(): void {
        this.sub = this.dashboard.activeProject$.pipe(filter(x => !!x)).subscribe(project => {
            this.project = project;
        });
    }

    public toggleLasso(isOn: boolean) {
        if (this.project) {
            this.project.profile.view.lassoOn = isOn;
            this.project.profile.view.lassoedLinks = [];
            this.project.profile.view.lassoedNodes = [];
            this.dashboard.updateProject(this.project, true);
        }
    }

}
