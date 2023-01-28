import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '@critical-pass/project/types';
import { DashboardService, DASHBOARD_TOKEN } from '@critical-pass/shared/data-access';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'cp-graph-options',
    templateUrl: './graph-options.component.html',
    styleUrls: ['./graph-options.component.scss'],
})
export class GraphOptionsComponent implements OnInit, OnDestroy {
    private data!: Observable<any>;
    public project!: Project | null;
    private subscription!: Subscription;
    constructor(private route: ActivatedRoute, @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService) {}

    public ngOnInit() {
        this.project = null;
        this.data = this.dashboard.activeProject$;
        this.subscription = this.data.pipe(filter(x => !!x)).subscribe(project => {
            this.project = project;
        });
    }
    public updateProject() {
        if (this.project !== null) {
            this.dashboard.updateProject(this.project, true);
        }
    }
    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    public setArrowUperText(type: string) {
        if (this.project !== null) {
            this.project.profile.view.displayText = type;
            this.updateProject();
        }
    }
    public setNodeDisplayText(type: string) {
        if (this.project !== null) {
            this.project.profile.view.showEftLft = type;
            this.updateProject();
        }
    }
    public setArrowLowerText(type: string) {
        if (this.project !== null) {
            this.project.profile.view.lowerArrowText = type;
            this.updateProject();
        }
    }
    public isArrowUpperText(val: string): boolean {
        if (this.project !== null) {
            return this.project.profile.view.displayText === val;
        }
        return false;
    }
    public istNodeDisplayText(type: string): boolean {
        if (this.project !== null) {
            return this.project.profile.view.showEftLft === type;
        }
        return false;
    }
    public istNodeLowerText(type: string): boolean {
        if (this.project !== null) {
            return this.project.profile.view.lowerArrowText === type;
        }
        return false;
    }
}
