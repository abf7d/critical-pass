import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '@critical-pass/critical-charts';
import { ProjectManagerBase } from '@critical-pass/critical-charts';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'cp-graph-options',
    templateUrl: './graph-options.component.html',
    styleUrls: ['./graph-options.component.scss'],
})
export class GraphOptionsComponent implements OnInit, OnDestroy {
    private data: Observable<any>;
    public project: Project;
    private id: number;
    private subscription: Subscription;
    test: string;
    constructor(private route: ActivatedRoute, @Inject('ProjectManagerBase') private pManager: ProjectManagerBase) {}

    public ngOnInit() {
        this.project = null;
        this.id = this.route.snapshot.params.id;
        this.data = this.pManager.getProject(this.id);
        this.subscription = this.data.pipe(filter(x => !!x)).subscribe(project => {
            this.project = project;
        });
    }
    public updateProject() {
        this.pManager.updateProject(this.id, this.project, true);
    }
    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    public setArrowUperText(type: string) {
        this.project.profile.view.displayText = type;
        this.updateProject();
    }
    public setNodeDisplayText(type: string) {
        this.project.profile.view.showEftLft = type;
        this.updateProject();
    }
    public setArrowLowerText(type: string) {
        this.project.profile.view.lowerArrowText = type;
        this.updateProject();
    }
    public isArrowUpperText(val: string): boolean {
        return this.project.profile.view.displayText === val;
    }
    public istNodeDisplayText(type: string): boolean {
        return this.project.profile.view.showEftLft === type;
    }
    public istNodeLowerText(type: string): boolean {
        return this.project.profile.view.lowerArrowText === type;
    }
}
