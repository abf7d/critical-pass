import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CHART_KEYS } from '@critical-pass/charts';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
// import { ProjectManagerBase} from '@critical-pass/critical-charts';
// import { ChartKeys } from '@critical-pass/critical-charts';
import { Subscription } from 'rxjs';

@Component({
    selector: 'cp-risk-bar',
    templateUrl: './risk-bar.component.html',
    styleUrls: ['./risk-bar.component.scss'],
})
export class RiskBarComponent implements OnInit, OnDestroy {
    public decompressAmount!: number;
    public sub!: Subscription;
    constructor(@Inject(DASHBOARD_TOKEN) private dashboard: DashboardService, @Inject(EVENT_SERVICE_TOKEN) private eventService: EventService) {}

    public ngOnInit(): void {
        this.decompressAmount = 0;
        this.eventService.get(CHART_KEYS.RISK_CURVE_TYPE).next(CHART_KEYS.ACTIVITY_RISK_KEY);
        this.sub = this.eventService.get<number>(CHART_KEYS.DECOMPRESS_AMOUNT).subscribe(amount => {
            this.decompressAmount = amount;
        });
    }

    public secondDervative() {
        this.eventService.get(CHART_KEYS.TRIGGER_SECOND_DERIVATIVE).next(true);
    }

    public changeRisk(event: any) {
        this.decompressAmount = +event.value;
        this.eventService.get(CHART_KEYS.DECOMPRESS_AMOUNT).next(+event.value);
    }

    public changeRiskType(type: string) {
        this.eventService.get(CHART_KEYS.RISK_CURVE_TYPE).next(type);
    }

    public ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}
