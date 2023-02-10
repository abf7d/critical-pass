import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { Project } from '@critical-pass/project/types';
import { CHART_KEYS } from '@critical-pass/charts';
import { AssignFrameworkService } from '../../services/assign-framework/assign-framework.service';
import { ResourceFactoryService } from '../../services/resource-factory/resource-factory.service';
import { PhaseFactoryService } from '../../services/phase-factory/phase-factory.service';

@Component({
    selector: 'cp-activity-tags',
    templateUrl: './activity-tags.component.html',
    styleUrls: ['./activity-tags.component.scss'],
})
export class ActivityTagsComponent implements OnInit {
    public id: number;
    public project$: Observable<Project>;
    public project!: Project;
    public subscription!: Subscription;
    public isResourceView = true;
    constructor(
        route: ActivatedRoute,
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        @Inject(EVENT_SERVICE_TOKEN) private eventService: EventService,
        private aManager: AssignFrameworkService,
        private resFactory: ResourceFactoryService,
        private phaseFactory: PhaseFactoryService,
    ) {
        this.id = +route.snapshot.params['id'];
        this.project$ = this.dashboard.activeProject$;
    }
    public ngOnInit(): void {
        this.subscription = this.project$.pipe(filter(x => !!x)).subscribe(project => {
            this.project = project;
        });
        this.aManager.colorBy = 'resource';
    }
    public assignResources() {
        const type = 'resources';
        this.aManager.assignTagsToActivities(type, this.project);
        this.dashboard.updateProject(this.project, false);
        this.eventService.get(CHART_KEYS.COMMIT_KEY).next(true);
    }
    public unassignResources() {
        const type = 'resources';
        this.aManager.removeTags(this.project, type, 'activities');
        this.dashboard.updateProject(this.project, false);
    }
    public selectResource(resource: any) {
        const type = 'resource';
        this.aManager.selectTag(this.project, resource, type, this.project.resources);
    }
    public removeResource(resource: any) {
        const index = this.project.resources.indexOf(resource);
        this.project.resources.splice(index, 1);
        this.dashboard.updateProject(this.project, false);
    }
    public addResource(name: any) {
        this.resFactory.addResource(name, this.project.resources);
        this.dashboard.updateProject(this.project, false);
    }
    public assignPhases() {
        const type = 'phases';
        this.aManager.assignTagsToActivities(type, this.project);
        this.dashboard.updateProject(this.project, false);
    }
    public unassignPhases() {
        const type = 'phases';
        this.aManager.removeTags(this.project, type, 'activities');
        this.dashboard.updateProject(this.project, false);
    }
    public selectPhase(resource: any) {
        const type = 'phase';
        this.aManager.selectTag(this.project, resource, type, this.project.phases);
    }
    public removePhase(phase: any) {
        const index = this.project.phases.indexOf(phase);
        this.project.phases.splice(index, 1);
        this.dashboard.updateProject(this.project, false);
    }
    public addPhase(name: any) {
        this.phaseFactory.addPhase(name, this.project.phases);
        this.dashboard.updateProject(this.project, false);
    }
    public setTagType(view: string) {
        this.isResourceView = view === 'resource';
        this.aManager.colorBy = view;
    }
}
