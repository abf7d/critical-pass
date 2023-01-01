import { Inject, Input, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ProjectManagerBase } from '@critical-pass/critical-charts';
import { Project } from '@critical-pass/critical-charts';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'cp-project-metadata',
    templateUrl: './project-metadata.component.html',
    styleUrls: ['./project-metadata.component.scss'],
})
export class ProjectMetadataComponent implements OnInit, OnDestroy {
    @Input() id: number;
    private subscription: Subscription;
    public project: Project;

    constructor(@Inject('ProjectManagerBase') private pManager: ProjectManagerBase) {}

    ngOnInit() {
        if (this.id == null) {
            return;
        }
        this.pManager
            .getProject(this.id)
            .pipe(filter(x => !!x))
            .subscribe(project => {
                this.project = project;
            });
    }

    ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
    }

    updateProject() {
        this.pManager.updateProject(this.id, this.project, true);
    }
}
