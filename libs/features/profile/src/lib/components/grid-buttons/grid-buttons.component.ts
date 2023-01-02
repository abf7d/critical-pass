import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ButtonEventsService } from './button-events/button-events.service';
import { ToastrService } from 'ngx-toastr';
import { Project } from '@critical-pass/project/models';
import { ActivitySorterService } from '@critical-pass/project/processor';
import { ProjectFileManagerService } from '@critical-pass/shared/file-management';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { ActivityBuilder, DependencyCrawlerService, IdGeneratorService, PcdAutogenService } from '@critical-pass/shared/project-utils';
import * as CONST from '../../constants/constants';
@Component({
    selector: 'cp-grid-buttons',
    templateUrl: './grid-buttons.component.html',
    styleUrls: ['./grid-buttons.component.scss'],
})
export class GridButtonsComponent implements OnInit {
    private subscription!: Subscription;
    public isProcessing: boolean = false;
    public fileToUpload: File | null = null;
    public project!: Project;
    public id!: number;
    public showDummies: boolean = false;
    @ViewChild('fileUpload', { static: true }) fileUpload!: ElementRef;

    constructor(
        private fileManager: ProjectFileManagerService,
        private buttonEvents: ButtonEventsService,
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        @Inject(EVENT_SERVICE_TOKEN) private eventService: EventService,
        private route: ActivatedRoute,
        private sorter: ActivitySorterService,
        private activityBuilder: ActivityBuilder,
        private pcdGenerator: PcdAutogenService,
        private idGenerator: IdGeneratorService,
        private toastr: ToastrService,
        private depCrawler: DependencyCrawlerService,
    ) {}

    public ngOnInit(): void {
        this.id = this.route.snapshot.params['id'] as number;
        this.subscription = this.dashboard.activeProject$.pipe(filter(x => !!x)).subscribe(p => {
            this.project = p;
        });
    }

    public ngOnDestroy() {
        this.subscription && this.subscription.unsubscribe();
    }
    public addActivity() {
        // there should be an addActivity method on buttonEvents / controller, that should use project utils /manager/activity builder
        // right now there is an addactivity on project manager that calls project compiler that calls activity builder
        // the buttonEvents should bring in activityBuilder itself or one level removed projectUtils
        if (this.project) {
            this.activityBuilder.addActivity(this.project);
            this.dashboard.updateProject(this.project, false);
        }
    }
    public buildArrowChart() {
        this.isProcessing = true;
        this.buttonEvents.compileArrowGraph(this.project).subscribe(
            p => {
                if (p) {
                    this.dashboard.updateProject(p, false);
                    this.isProcessing = false;
                    this.toastr.success('Build Arrow Chart', 'Success!');
                } else {
                    this.isProcessing = false;
                    this.toastr.error('Build Arrow Chart', 'Project Missing.');
                }
            },
            error => {
                console.error(error);
                this.isProcessing = false;
                this.toastr.error('Build Arrow Chart', 'Error occured.');
            },
        );
    }
    public processMsProjectFile(event: any) {
        const files = event.files as FileList;
        if (files.length > 0) {
            this.isProcessing = true;
            const firstFile = files.item(0);
            if (firstFile !== null) {
                this.buttonEvents.compileMsProject(firstFile).subscribe(
                    p => {
                        this.dashboard.updateProject(p, false);
                        this.isProcessing = false;
                        this.toastr.success('Processing MS Project', 'Success!');
                    },
                    error => {
                        console.error(error);
                        this.isProcessing = false;
                        this.toastr.error('Processing MS Project', 'Error occured.');
                    },
                );
            } else {
                console.error('First file selected is null');
                this.isProcessing = false;
                this.toastr.error('First file selected is null', 'Error occured.');
            }
        }
    }
    public setDependencyDataFromGraph() {
        if (this.project !== null) {
            this.depCrawler.setDependencyDataFromGraph(this.project);
            this.toastr.success('Dependency Update', 'Success!');
        }
    }
    public autogeneratePcds() {
        if (this.project !== null) {
            this.pcdGenerator.autogeneratePcds(this.project);
            this.toastr.success('Generating Planned Completion Dates', 'Success!');
        }
    }
    public resetIds() {
        if (this.project !== null) {
            this.idGenerator.resetIds(this.project);
            this.depCrawler.setDependencyDataFromGraph(this.project);
            this.sorter.reorderIds(this.project);
            this.dashboard.updateProject(this.project, false);
        }
    }
    public processCritPathFile(event: any) {
        const files = event.files as FileList;
        const firstFile = files.item(0);

        if (firstFile !== null && files.length > 0) {
            this.fileManager
                .import(firstFile)
                .then(project => {
                    this.dashboard.updateProject(project, true);
                    this.toastr.success('Processing File', 'Success!');
                })
                .catch(error => this.toastr.success('Processing File', 'Error occured'));
        } else {
            this.toastr.error('No file selected', 'Error occured');
        }
    }
    public downloadCritPathFile() {
        this.fileManager.export(this.project);
    }
    public toggleDummies() {
        if (this.project !== null) {
            this.showDummies = !this.showDummies;
            this.eventService.get(CONST.VIEW_DUMMIES_IN_GRID_KEY).next(this.showDummies);
        }
    }
}
