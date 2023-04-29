import { TestBed } from '@angular/core/testing';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { ArrowChartComponent } from './arrow-chart.component';
import { ArrowChartModule } from './arrow-chart.module';

describe(ArrowChartComponent.name, () => {
    before(function () {
        cy.fixture('example.json').then(function (data) {
            this['data'] = data;
        });
    });
    beforeEach(() => {
        TestBed.overrideComponent(ArrowChartComponent, {
            add: {
                imports: [ArrowChartModule],
                providers: [
                    { provide: DASHBOARD_TOKEN, useClass: DashboardService },
                    { provide: EVENT_SERVICE_TOKEN, useClass: EventService },
                ],
            },
        });
    });

    it('renders', () => {
        cy.mount(ArrowChartComponent, {
            componentProperties: {
                id: 0,
                width: 0,
                height: 0,
                rebuild: false,
                showFastCreator: true,
            },
        });
    });
});
