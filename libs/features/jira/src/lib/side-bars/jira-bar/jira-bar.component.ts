import { Component, Inject } from '@angular/core';
import { Project } from '@critical-pass/project/types';
import { DashboardService, DASHBOARD_TOKEN, ZametekApiService } from '@critical-pass/shared/data-access';
import { FileCompilerService, ProjectSanatizerService } from '@critical-pass/shared/project-utils';
import { ToastrService } from 'ngx-toastr';
import { filter, Observable, Subscription, tap } from 'rxjs';

@Component({
    selector: 'critical-pass-jira-bar',
    templateUrl: './jira-bar.component.html',
    styleUrls: ['./jira-bar.component.scss'],
})
export class JiraBarComponent {
    public isProcessing: boolean = false;
    public project!: Project;
    private subscription!: Subscription;
    constructor(private toastr: ToastrService, @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService, private fCompiler: FileCompilerService, private projectSanitizer: ProjectSanatizerService, private zametekApi: ZametekApiService,) {}
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
}
