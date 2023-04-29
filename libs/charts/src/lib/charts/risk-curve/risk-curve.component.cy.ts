import { TestBed } from '@angular/core/testing';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { RiskCurveComponent } from './risk-curve.component';
import { RiskCurveModule } from './risk-curve.module';

describe(RiskCurveComponent.name, () => {
    beforeEach(() => {
        TestBed.overrideComponent(RiskCurveComponent, {
            add: {
                imports: [RiskCurveModule],
                providers: [
                    { provide: DASHBOARD_TOKEN, useClass: DashboardService },
                    { provide: EVENT_SERVICE_TOKEN, useClass: EventService },
                ],
            },
        });
    });

    it('renders', () => {
        cy.mount(RiskCurveComponent, {
            componentProperties: {
                id: 0,
                width: 0,
                height: 0,
            },
        });
    });
});
