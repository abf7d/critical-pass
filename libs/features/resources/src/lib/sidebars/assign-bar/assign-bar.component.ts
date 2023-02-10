import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DashboardService, DASHBOARD_TOKEN, ProjectStorageApiService, API_CONST } from '@critical-pass/shared/data-access';
import { Project } from '@critical-pass/project/types';

@Component({
    selector: 'cp-assign-bar',
    templateUrl: './assign-bar.component.html',
    styleUrls: ['./assign-bar.component.scss'],
})
export class AssignBarComponent implements OnInit, OnDestroy {
    public id: number;
    public project!: Project;
    public subscription: Subscription;

    constructor(
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
        private storageApi: ProjectStorageApiService,
    ) {
        this.id = +this.route.snapshot.params['id'];

        this.subscription = this.dashboard.activeProject$.subscribe(project => {
            this.project = project;
        });
    }

    public navigateActivities() {
        this.router.navigateByUrl(`resources/(${this.id}//sidebar:assignbar/${this.id})`);
    }
    public navigateResources() {
        this.router.navigateByUrl(`resources/(${this.id}//sidebar:resources/${this.id})`);
    }
    public navigateCompare() {
        this.router.navigateByUrl(`resources/(${this.id}//sidebar:compare/${this.id})`);
    }
    public stash() {
        try {
            this.storageApi.set(API_CONST.LOCAL_STORAGE, this.project);
        } catch (ex) {
            this.toastr.error('Stash Chart', 'Error occured.');
            console.error(ex);
            return;
        }
        this.toastr.success('Stash Chart', 'Success!');
    }

    public unstash() {
        try {
            const project = this.storageApi.get(API_CONST.LOCAL_STORAGE);
            if (project) {
                this.dashboard.updateProject(project, false);
            }
        } catch (ex) {
            this.toastr.error('Unstash Chart', 'Error occured.');
            console.error(ex);
            return;
        }
        this.toastr.success('Unstash Chart', 'Success!');
    }
    public ngOnInit(): void {}
    public ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
