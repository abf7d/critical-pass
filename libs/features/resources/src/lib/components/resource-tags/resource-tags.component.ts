import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project, Resource, Role } from '@critical-pass/project/types';
import { DashboardService, DASHBOARD_TOKEN } from '@critical-pass/shared/data-access';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AssignFrameworkService } from '../../services/assign-framework/assign-framework.service';
import { ResourceFactoryService } from '../../services/resource-factory/resource-factory.service';
import { RoleFactoryService } from '../../services/role-factory/role-factory.service';

@Component({
    selector: 'cp-resource-tags',
    templateUrl: './resource-tags.component.html',
    styleUrls: ['./resource-tags.component.scss'],
})
export class ResourceTagsComponent implements OnInit {
    public id: number;
    public project$: Observable<Project>;
    public project!: Project;
    public subscription!: Subscription;
    public isRoleView = true;
    public newRoleTxt: string = '';
    public newResourcetTxt: string = '';
    constructor(
        route: ActivatedRoute,
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        private aManager: AssignFrameworkService,
        private roleFactory: RoleFactoryService,
        private resourceFactory: ResourceFactoryService,
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
    public removeRole(role: Role) {
        const index = this.project.roles.indexOf(role);
        this.project.roles.splice(index, 1);
        this.dashboard.updateProject(this.project, false);
    }
    public addRole(event: any) {
        const name = event.value;
        this.roleFactory.addRole(name, this.project.roles);
        this.dashboard.updateProject(this.project, false);
        this.newRoleTxt = '';
    }
    public removeResource(resource: Resource) {
        const index = this.project.resources.indexOf(resource);
        this.project.resources.splice(index, 1);
        this.dashboard.updateProject(this.project, false);
    }
    public addResource(event: any) {
        const name = event.value;
        this.resourceFactory.addResource(name, this.project.resources);
        this.dashboard.updateProject(this.project, false);
        this.newResourcetTxt = '';
    }
    public setTagType(view: string) {
        this.isRoleView = view === 'role';
    }
}
