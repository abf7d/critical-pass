import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TreeNode } from '@critical-pass/critical-charts';
import { ProjectManagerBase } from '@critical-pass/critical-charts';
import { Project } from '@critical-pass/critical-charts';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ChartKeys } from '@critical-pass/critical-charts';

@Component({
    selector: 'cp-sketchbook-layout',
    templateUrl: './sketchbook-layout.component.html',
    styleUrls: ['./sketchbook-layout.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SketchbookLayoutComponent implements OnInit {
    public id: number;
    public historyArray$: Subject<TreeNode>;
    public project$: Observable<Project>;
    public selectedTreeNode$: Subject<number>;
    private refresh = 0;
    private subscription: Subscription;

    constructor(route: ActivatedRoute, @Inject('ProjectManagerBase') private pManager: ProjectManagerBase) {
        this.id = +route.snapshot.params.id;
        this.project$ = pManager.getProject(this.id);
        this.historyArray$ = pManager.getChannel(ChartKeys.historyArray);
        this.selectedTreeNode$ = this.pManager.getChannel(ChartKeys.selectedTreeNode);
    }

    public ngOnInit(): void {
        this.subscription = this.project$.pipe(filter(x => !!x)).subscribe(_ => this.refresh++);
    }
    public canDeactivate(): boolean {
        return this.refresh < 2;
    }
    public load(node: TreeNode): void {
        node.data.profile.view.autoZoom;
        this.pManager.updateProject(this.id, node.data, false);
        this.selectedTreeNode$.next(node.id);
    }
    public ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
