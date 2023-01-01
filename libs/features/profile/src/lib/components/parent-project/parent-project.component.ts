import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Project } from '@critical-pass/project/models';
import { ProjectCompilerService } from '@critical-pass/project/processor';
import { DashboardService, DASHBOARD_TOKEN } from '@critical-pass/shared/data-access';
// import { Project } from '@critical-pass/critical-charts';
// import { ProjectManagerBase } from '@critical-pass/critical-charts';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'cp-parent-project',
    templateUrl: './parent-project.component.html',
    styleUrls: ['./parent-project.component.scss'],
})
export class ParentProjectComponent implements OnInit, OnDestroy {
    @Input() id!: number;
    @Input() width!: number;
    @Input() height!: number;
    public project!: Project;
    public parentProject: Project | null = null;
    public data!: Observable<any>;
    public subscription!: Subscription;

    constructor(@Inject(DASHBOARD_TOKEN) private dashboard: DashboardService, public compiler: ProjectCompilerService) {}

    ngOnInit() {
        if (this.id != null) {
            this.data = this.dashboard.activeProject$;
            this.subscription = this.data.pipe(filter(x => !!x)).subscribe((project: Project) => {
                this.project = project;
                this.parentProject = project.profile.parentProject;
            });
        }
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    public loadParent(): void {
        const mainProj = this.project.profile.parentProject;
        if (mainProj !== null) {
            mainProj.profile.view.autoZoom = true;
            this.dashboard.updateProject(mainProj, false);
            const parentProj = mainProj.profile.parentProject;
            if (parentProj !== null) this.compiler.compile(parentProj);
            this.dashboard.secondaryProject$.next(parentProj);
            // this.pManager.updateProject('parent', parentProj.profile.parentProject, true);
        }
    }
}
