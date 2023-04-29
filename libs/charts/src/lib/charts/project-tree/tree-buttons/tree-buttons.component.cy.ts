import { TestBed } from '@angular/core/testing';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { ProjectTreeModule } from '../project-tree.module';
import { TreeButtonsComponent } from './tree-buttons.component';

describe(TreeButtonsComponent.name, () => {
    beforeEach(() => {
        TestBed.overrideComponent(TreeButtonsComponent, {
            add: {
                imports: [ProjectTreeModule],
                providers: [
                    { provide: DASHBOARD_TOKEN, useClass: DashboardService },
                    { provide: EVENT_SERVICE_TOKEN, useClass: EventService },
                ],
            },
        });
    });

    it('renders', () => {
        cy.mount(TreeButtonsComponent, {
            componentProperties: {
                fileActions: false,
            },
        });
    });
});
