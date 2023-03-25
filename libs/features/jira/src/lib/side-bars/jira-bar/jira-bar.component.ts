import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '@critical-pass/project/types';
import { DashboardService, DASHBOARD_TOKEN, ProjectStorageApiService, ZametekApiService } from '@critical-pass/shared/data-access';
import { FileCompilerService, ProjectSanatizerService } from '@critical-pass/shared/project-utils';
import { ToastrService } from 'ngx-toastr';
import { filter, Observable, Subscription, tap } from 'rxjs';
import { CORE_CONST } from '@critical-pass/core';
import { API_CONST } from '@critical-pass/shared/data-access';

@Component({
    selector: 'critical-pass-jira-bar',
    templateUrl: './jira-bar.component.html',
    styleUrls: ['./jira-bar.component.scss'],
})
export class JiraBarComponent implements OnInit, OnDestroy {
    public isProcessing: boolean = false;
    public project!: Project;
    private subscription!: Subscription;
    constructor(
        private toastr: ToastrService,
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        private fCompiler: FileCompilerService,
        private projectSanitizer: ProjectSanatizerService,
        private zametekApi: ZametekApiService,
        private storageApi: ProjectStorageApiService,
        private router: Router,
    ) {}
    public ngOnInit(): void {
        this.subscription = this.dashboard.activeProject$.pipe(filter(x => !!x)).subscribe(p => {
            this.project = p;
        });
    }
    public buildArrowChart() {
        this.isProcessing = true;
        this.compileArrowGraph(this.project).subscribe(
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
    public compileArrowGraph(project: Project): Observable<Project | null> {
        this.projectSanitizer.sanitizeNumbers(project);
        return this.zametekApi.compileArrowGraph(project).pipe(
            tap(project => {
                project && this.fCompiler.compileProjectFromFile(project);
                return project;
            }),
        );
    }
    public ngOnDestroy() {
        this.subscription?.unsubscribe();
    }
    public navToNetwork() {
        this.project.profile.view.autoZoom = true;
        this.storageApi.set(API_CONST.SESSION_STORAGE, this.project!);
        this.router.navigateByUrl(CORE_CONST.IMPORT_NETWORK_ROUTE);
    }
}
