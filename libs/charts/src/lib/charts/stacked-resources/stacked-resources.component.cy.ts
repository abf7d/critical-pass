import { TestBed } from '@angular/core/testing';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { StackedResourcesComponent } from './stacked-resources.component';
import { StackedResourcesModule } from './stacked-resources.module';

describe(StackedResourcesComponent.name, () => {
    beforeEach(() => {
        TestBed.overrideComponent(StackedResourcesComponent, {
            add: {
                imports: [StackedResourcesModule],
                providers: [
                    { provide: DASHBOARD_TOKEN, useClass: DashboardService },
                    { provide: EVENT_SERVICE_TOKEN, useClass: EventService },
                ],
            },
        });
    });

    it('renders', () => {
        cy.mount(StackedResourcesComponent, {
            componentProperties: {
                height: 0,
                width: 0,
                barWidth: 0,
                showAxes: false,
                id: 0,
            },
        });
    });
});
