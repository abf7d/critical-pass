import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '@critical-pass/project/types';
import { DashboardService, DASHBOARD_TOKEN } from '@critical-pass/shared/data-access';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { RoleFactoryService } from '../../services/role-factory/role-factory.service';
import { ResourceForm } from '../profile-card/profile-card.component';
@Component({
    selector: 'cp-resource-cards',
    templateUrl: './resource-cards.component.html',
    styleUrls: ['./resource-cards.component.scss'],
})
export class ResourceCardsComponent implements OnInit, OnDestroy {
    public project!: Project;
    private subscription!: Subscription;
    private id: number;
    public roles!: any[];
    constructor(@Inject(DASHBOARD_TOKEN) private dashboard: DashboardService, route: ActivatedRoute, private rsF: RoleFactoryService) {
        this.id = +route.snapshot.params['id'];
    }
    public ngOnInit() {
        this.subscription = this.dashboard.activeProject$.pipe(filter(x => !!x)).subscribe(project => {
            this.project = project;
            this.roles = project.roles.map(r => {
                return { name: r.name };
            });
        });
    }
    public updateResource(entry: ResourceForm) {
        const resource = this.project.resources[entry.resourceIndex];
        resource.profile.name = entry.name;

        if (entry.roleIndex !== null) {
            const role = this.project.roles[entry.roleIndex];
            const roleSummary = this.rsF.getSummary(role);
            resource.assign.roles = [roleSummary];
        }
    }
    public deleteResource(index: number) {
        this.project.resources.splice(index, 1);
        this.dashboard.updateProject(this.project, false);
    }
    public ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
