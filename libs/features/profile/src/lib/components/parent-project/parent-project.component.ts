import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Project } from '@critical-pass/critical-charts';
import { ProjectManagerBase } from '@critical-pass/critical-charts';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'cp-parent-project',
    templateUrl: './parent-project.component.html',
    styleUrls: ['./parent-project.component.scss'],
})
export class ParentProjectComponent implements OnInit, OnDestroy {
    @Input() id: number;
    @Input() width: number;
    @Input() height: number;
    public project: Project;
    public parentProject: Project;
    public data: Observable<any>;
    public subscription: Subscription;

    constructor(@Inject('ProjectManagerBase') private pManager: ProjectManagerBase) {}

    ngOnInit() {
        if (this.id != null) {
            this.data = this.pManager.getProject(this.id);
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
        const parentProj = this.project.profile.parentProject;
        if (parentProj !== null) {
            parentProj.profile.view.autoZoom = true;
            this.pManager.updateProject(this.id, parentProj, false);
            this.pManager.updateProject('parent', parentProj.profile.parentProject, true);
        }
    }
}
