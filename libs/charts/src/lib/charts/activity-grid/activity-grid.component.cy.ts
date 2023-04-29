import { TestBed } from '@angular/core/testing';
import { ActivityGridComponent } from './activity-grid.component';
import { GridEventsService } from './grid-events/grid-events.service';
import { ActivityGridModule } from './activity-grid.module';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';

describe(ActivityGridComponent.name, () => {
    beforeEach(() => {
        TestBed.overrideComponent(ActivityGridComponent, {
            add: {
                imports: [ActivityGridModule],
                providers: [
                    GridEventsService,
                    { provide: DASHBOARD_TOKEN, useClass: DashboardService },
                    { provide: EVENT_SERVICE_TOKEN, useClass: EventService },
                ],
            },
        });
    });

    it('renders', () => {
        cy.mount(ActivityGridComponent, {
            componentProperties: {
                id: 0,
            },
        });
    });
});
