import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project, TreeNode } from '@critical-pass/project/types';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CHART_KEYS } from '@critical-pass/charts';
@Component({
    selector: 'cp-history-layout',
    templateUrl: './history-layout.component.html',
    styleUrls: ['./history-layout.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HistoryLayoutComponent implements OnInit {
    public id: number;
    public historyArray$: Subject<TreeNode[]>;
    public project$: Observable<Project>;
    public selectedTreeNode$: Subject<number>;
    private refresh = 0;
    private subscription!: Subscription;

    constructor(
        route: ActivatedRoute,
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        @Inject(EVENT_SERVICE_TOKEN) private eventService: EventService,
    ) {
        this.id = +route.snapshot.params['id'];
        this.project$ = this.dashboard.activeProject$;
        this.historyArray$ = this.eventService.get<TreeNode[]>(CHART_KEYS.HISTORY_ARRAY_KEY);
        this.selectedTreeNode$ = this.eventService.get(CHART_KEYS.SELECTED_TREE_NODE_KEY);
    }

    public ngOnInit(): void {
        this.subscription = this.project$.pipe(filter(x => !!x)).subscribe(_ => this.refresh++);
    }
    public canDeactivate(): boolean {
        return this.refresh < 2;
    }
    public load(node: TreeNode): void {
        this.dashboard.updateProject(node.data!, false);
        this.selectedTreeNode$.next(node.id);
    }
    public ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
