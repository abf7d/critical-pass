import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { ProjectManagerBase} from '@critical-pass/critical-charts';
// import { Project } from '@critical-pass/critical-charts';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
// import { ChartKeys } from '@critical-pass/critical-charts';
import { CHART_KEYS } from '@critical-pass/charts';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { Project } from '@critical-pass/project/models';

@Component({
    selector: 'cp-shallow-s-bar',
    templateUrl: './shallow-s-bar.component.html',
    styleUrls: ['./shallow-s-bar.component.scss'],
})
export class ShallowSBarComponent implements OnInit {
    private subscription!: Subscription;
    private id!: number;
    private data!: Observable<Project>;
    public project!: Project;
    public extrapolate!: boolean;
    public chartType!: string;
    public startType!: string;
    public regType$: Subject<string>;

    constructor(
        private route: ActivatedRoute,
        @Inject(DASHBOARD_TOKEN) private dashboard: DashboardService,
        @Inject(EVENT_SERVICE_TOKEN) private eventService: EventService,
    ) {
        this.regType$ = this.eventService.get(CHART_KEYS.SHALLOW_S_REGRESSION_TYPE_KEY);
    }

    public ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        this.extrapolate = false;
        this.chartType = 'line';
        this.startType = 'completion';
        if (!this.id) {
            return;
        }
        this.data = this.dashboard.activeProject$;
        this.subscription = this.data.subscribe(project => {
            this.project = project;
        });
    }
    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    public setExtrapolate(checked: boolean) {
        this.project.profile.view.showOverrun = checked;
        this.dashboard.updateProject(this.project, false);
    }
    public setChartType(type: string) {
        if (type === 'step') {
            this.project.profile.view.showStepChart = true;
        }
        if (type === 'line') {
            this.project.profile.view.showStepChart = false;
        }
        this.dashboard.updateProject(this.project, false);
    }

    public setRegressionType(type: string) {
        this.regType$.next(type);
    }

    public setStartType(type: string) {
        if (type === 'start') {
            this.project.profile.view.useStartDates = true;
        }
        if (type === 'completion') {
            this.project.profile.view.useStartDates = false;
        }
        this.dashboard.updateProject(this.project, false);
    }
}
