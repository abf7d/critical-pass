import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoggerBase } from '@critical-pass/critical-charts';
import { ProjectManagerBase } from '@critical-pass/critical-charts';
import { Project } from '@critical-pass/critical-charts';
import { ActivitySorterService } from '@critical-pass/critical-charts';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ProjectFileManagerService } from '@critical-pass/critical-charts';
import { ButtonEventsService } from './button-events/button-events.service';
import { ChartKeys } from '@critical-pass/critical-charts';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'cp-grid-buttons',
    templateUrl: './grid-buttons.component.html',
    styleUrls: ['./grid-buttons.component.scss'],
})
export class GridButtonsComponent implements OnInit {
    private subscription: Subscription;
    public isProcessing: boolean;
    public fileToUpload: File = null;
    public project: Project;
    public id: number;
    public showDummies: boolean;
    @ViewChild('fileUpload', { static: true }) fileUpload: ElementRef;

    constructor(
        @Inject('ProjectManagerBase') private pManager: ProjectManagerBase,
        private fileManager: ProjectFileManagerService,
        private buttonEvents: ButtonEventsService,
        @Inject('LoggerBase') private logger: LoggerBase,
        private route: ActivatedRoute,
        private sorter: ActivitySorterService,
        private toastr: ToastrService,
    ) {}

    public ngOnInit(): void {
        this.id = this.route.snapshot.params.id;
        this.showDummies = false;
        this.subscription = this.pManager
            .getProject(this.id)
            .pipe(filter(x => !!x))
            .subscribe(p => {
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
        this.pManager.addActivity(this.id, this.project);
    }
    public buildArrowChart() {
        this.isProcessing = true;
        this.buttonEvents.compileArrowGraph(this.project).subscribe(
            p => {
                this.pManager.updateProject(this.id, p, false);
                this.isProcessing = false;
                this.toastr.success('Build Arrow Chart', 'Success!');
            },
            error => {
                this.logger.error(error);
                this.isProcessing = false;
                this.toastr.error('Build Arrow Chart', 'Error occured.');
            },
        );
    }
    public processMsProjectFile(files: FileList) {
        if (files.length > 0) {
            this.isProcessing = true;
            this.buttonEvents.compileMsProject(files.item(0)).subscribe(
                p => {
                    this.pManager.updateProject(this.id, p, false);
                    this.isProcessing = false;
                    this.toastr.success('Processing MS Project', 'Success!');
                },
                error => {
                    this.logger.error(error);
                    this.isProcessing = false;
                    this.toastr.error('Processing MS Project', 'Error occured.');
                },
            );
        }
    }
    public setDependencyDataFromGraph() {
        this.pManager.updateDependencyData(this.project);
        this.toastr.success('Dependency Update', 'Success!');
    }
    public autogeneratePcds() {
        this.pManager.autogeneratePcds(this.project);
        this.toastr.success('Generating Planned Completion Dates', 'Success!');
    }
    public resetIds() {
        this.pManager.resetIds(this.project);
        this.pManager.updateDependencyData(this.project);
        this.sorter.reorderIds(this.project);
        this.pManager.updateProject(this.id, this.project, false);
    }
    public processCritPathFile(files: FileList) {
        if (files.length > 0) {
            this.fileManager
                .import(files.item(0))
                .then(project => {
                    this.pManager.updateProject(this.id, project, true);
                    this.toastr.success('Processing File', 'Success!');
                })
                .catch(error => this.toastr.success('Processing File', 'Error occured'));
        }
    }
    public downloadCritPathFile() {
        this.fileManager.export(this.project);
    }
    public toggleDummies() {
        this.showDummies = !this.showDummies;
        this.pManager.getChannel(ChartKeys.viewDummiesInGridKey).next(this.showDummies);
    }
}
