import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '@critical-pass/project/models';
import { DashboardService, DASHBOARD_TOKEN } from '@critical-pass/shared/data-access';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'cp-score-board',
    templateUrl: './score-board.component.html',
    styleUrls: ['./score-board.component.scss'],
})
export class ScoreBoardComponent implements OnInit, OnDestroy {
    public project!: Project;
    public sub!: Subscription;
    @Input() id!: number;

    constructor(@Inject(DASHBOARD_TOKEN) private dashboard: DashboardService) {}

    ngOnInit(): void {
        this.sub = this.dashboard.activeProject$.pipe(filter(x => !!x)).subscribe(project => {
            this.project = project;
        });
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}
