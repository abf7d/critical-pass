import { Inject, Input, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Project } from '@critical-pass/project/types';
import { DashboardService, DASHBOARD_TOKEN } from '@critical-pass/shared/data-access';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'cp-project-metadata',
    templateUrl: './project-metadata.component.html',
    styleUrls: ['./project-metadata.component.scss'],
})
export class ProjectMetadataComponent implements OnInit, OnDestroy {
    private subscription!: Subscription;
    public project!: Project;

    constructor(@Inject(DASHBOARD_TOKEN) private dashboard: DashboardService) {}

    ngOnInit() {
        this.dashboard.activeProject$.pipe(filter(x => !!x)).subscribe(project => {
            this.project = project;
        });
    }

    ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
    }

    updateProject() {
        this.dashboard.updateProject(this.project, true);
    }
}
