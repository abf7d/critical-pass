import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CHART_KEYS, CompletionNodeCalcService } from '@critical-pass/charts';
import { TreeNode } from '@critical-pass/project/types';
import { EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'cp-compare-main',
    templateUrl: './compare-main.component.html',
    styleUrls: ['./compare-main.component.scss'],
})
export class CompareMainComponent implements OnInit, OnDestroy {
    private sub!: Subscription;
    public completedNodes: TreeNode[] = [];
    constructor(@Inject(EVENT_SERVICE_TOKEN) private eventService: EventService, private completed: CompletionNodeCalcService) {}

    ngOnInit(): void {
        this.completedNodes = [];
        this.sub = this.eventService
            .get<TreeNode[]>(CHART_KEYS.HISTORY_ARRAY_KEY)
            .pipe(filter(x => !!x))
            .subscribe(historyArray => {
                this.completedNodes = this.completed.getCompletedNodes(historyArray);
            });
    }
    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}
