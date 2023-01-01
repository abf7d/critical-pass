import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { ProjectManagerBase} from '@critical-pass/critical-charts';
// import { ProjectStoreBase } from '@critical-pass/critical-charts'; 
// import { Project } from '@critical-pass/critical-charts';
// import { ProjectSerializerService } from '@critical-pass/critical-charts';
import { Subscription } from 'rxjs';
// import * as Keys from '../../../../../core/constants/keys';
// import { ProjectSanatizerService } from '../../../services/utils/project-sanitizer/project-sanatizer.service';

import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { Project } from '@critical-pass/project/models';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { ProjectSanatizerService } from '@critical-pass/shared/project-utils';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'cp-action-buttons',
    templateUrl: './action-buttons.component.html',
    styleUrls: ['./action-buttons.component.scss'],
})
export class ActionButtonsComponent implements OnInit, OnDestroy {
    @Input() id!: number;
    public showPeek!: boolean;
    public project!: Project;
    public peekProj!: Project;
    public subscription!: Subscription;
    public alertMessage: string;
    public actionText: string;
    public disableButtons!: boolean;
    public showHelp: boolean;
    public timestamp!: Date;

    // import dashboardService and eventService
    constructor(
        private router: Router,
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        @Inject(EVENT_SERVICE_TOKEN) private eventService: EventService,
        // @Inject('ProjectManagerBase') public pManager: ProjectManagerBase,
        // @Inject('ProjectStoreBase') private store: ProjectStoreBase,
        private serializer: ProjectSerializerService,
        private sanitizer: ProjectSanatizerService,
        public toastr: ToastrService
    ) {
        this.showHelp = false;
        this.actionText = '';
        this.alertMessage = '';
    }

    public ngOnInit(): void {
        this.subscription = this.pManager.getProject(this.id).subscribe(project => {
            this.project = project;
            this.timestamp = project.profile.timestamp ? new Date(project.profile.timestamp) : null;
            this.disableButtons = !project.profile.permissions.writable || !!project.profile.parentProject;
        });
        this.showPeek = false;
    }

    public peekStorage(): void {
        this.peekProj = this.pManager.unstash();
    }

    public stash() {
        this.showPeek = false;
        try {
            this.pManager.stash(this.project);
        } catch (ex) {
            this.toastr.error('Stash Chart', 'Error occured.');
            console.error(ex);
            return;
        }
        this.toastr.success('Stash Chart', 'Success!');
    }

    public unstash() {
        this.showPeek = false;
        try {
            const project = this.pManager.unstash();
            this.pManager.updateProject(this.id, project, false);
        } catch (ex) {
            this.toastr.error('Unstash Chart', 'Error occured.');
            console.error(ex);
            return;
        }
        this.toastr.success('Unstash Chart', 'Success!');
    }

    public save() {
        const copy = this.serializer.fromJson(this.project);
        this.sanitizer.sanatizeForSave(copy);

        if (!copy.profile.id) {
            copy.profile.id = Keys.newProjectId;
        }

        this.setSaveState('Saving', '', true);
        this.store.post(copy).subscribe(
            result => {
                this.pManager.getChannel(Keys.clearChangeTracker).next(true);

                if (result !== null) {
                    this.project.profile.timestamp = result.profile.timestamp;
                    this.sanitizer.updateIds(this.project, result);
                    this.pManager.updateProject(this.id, this.project, false);
                }
                this.setSaveState('', '', false, true);
                this.toastr.success('Save Project', 'Success!');
            },
            error => {
                this.setSaveState('', '', false, true);
                this.toastr.error('Save Project', 'Error');
                console.error(error);
            },
        );
    }

    public saveAsNew() {
        const copy = this.serializer.fromJson(this.project);
        this.sanitizer.sanatizeForSave(copy);
        copy.profile.id = Keys.newProjectId;

        this.setSaveState('Saving', '', true);
        this.store.post(copy).subscribe(
            result => {
                this.pManager.getChannel(Keys.clearChangeTracker).next(true);
                this.router.navigateByUrl(Keys.libraryRoute);
                if (result !== null) {
                    this.sanitizer.updateIds(this.project, result);
                    this.pManager.updateProject(this.id, this.project, false);
                }
                this.setSaveState('', '', false, true);
                this.toastr.success('Save Copy', 'Success!');
             },
            error => {
                this.setSaveState('', '', false, true);
                this.toastr.error('Save Copy', 'Error')
                console.error(error);
            },
        );
    }
    public delete() {
        this.disableButtons = true;
        this.actionText = 'Deleting Project';
        this.pManager.getChannel(Keys.clearChangeTracker).next(true);

        this.store.delete(this.id).subscribe(
            _ => {
                this.toastr.success('Delete Project', 'Success!');
                this.router.navigateByUrl(Keys.libraryRoute);
            },
            error => {
                this.toastr.error('Delete Project', 'Error')
                console.error(error);
            },
        );
    }

    public setSaveState(actionTxt: string, alertMsg: string, disabled: boolean, clearMsg: boolean = false) {
        this.actionText = actionTxt;
        this.alertMessage = alertMsg;
        this.disableButtons = disabled;
        if (clearMsg) {
            setTimeout(() => (this.alertMessage = ''), 2000);
        }
    }
    public ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
