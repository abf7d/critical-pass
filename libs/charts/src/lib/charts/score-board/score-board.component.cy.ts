import { TestBed } from '@angular/core/testing';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { ScoreBoardComponent } from './score-board.component';
import { ScoreBoardModule } from './score-board.module';

describe(ScoreBoardComponent.name, () => {
    beforeEach(() => {
        TestBed.overrideComponent(ScoreBoardComponent, {
            add: {
                imports: [ScoreBoardModule],
                providers: [
                    { provide: DASHBOARD_TOKEN, useClass: DashboardService },
                    { provide: EVENT_SERVICE_TOKEN, useClass: EventService },
                ],
            },
        });
    });

    it('renders', () => {
        cy.mount(ScoreBoardComponent, {
            componentProperties: {
                id: 0,
            },
        });
    });
});
