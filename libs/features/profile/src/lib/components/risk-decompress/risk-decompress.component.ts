import { Component, Inject, OnInit } from '@angular/core';
import { Project } from '@critical-pass/project/models';
import { DashboardService, DASHBOARD_TOKEN } from '@critical-pass/shared/data-access';
import { EndNodesLocatorService } from '@critical-pass/shared/project-utils';
import { NodeArrangerService } from 'libs/shared/project-utils/src/lib/services/node-arranger/node-arranger.service';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'cp-risk-decompress',
    templateUrl: './risk-decompress.component.html',
    styleUrls: ['./risk-decompress.component.scss'],
})
export class RiskDecompressComponent implements OnInit {
    private project!: Project;
    public start!: number;
    public end!: number;
    public enableArranging!: boolean;

    constructor(
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        private endNodesLocator: EndNodesLocatorService,
        private nodeArranger: NodeArrangerService,
    ) {}

    ngOnInit(): void {
        this.dashboard.activeProject$.pipe(filter(x => !!x)).subscribe(project => {
            this.project = project;
            if (project.profile.start !== undefined) this.start = project.profile.start;
            if (project.profile.end !== undefined) this.end = project.profile.end;
            this.enableArranging = true;
        });
    }

    public calculateRisk(): void {
        this.endNodesLocator.setStartEndNodesFromLongestPath(this.project);
        this.dashboard.updateProject(this.project, true);
    }

    public setStart(event: any): void {
        this.project.profile.start = +event.value;
        this.dashboard.updateProject(this.project, true);
    }
    public setEnd(event: any): void {
        this.project.profile.end = +event.value;
        this.dashboard.updateProject(this.project, true);
    }

    public arrangeNodes(): void {
        this.nodeArranger.arrangeNodes(this.project);
        this.dashboard.updateProject(this.project, false);
    }
}
