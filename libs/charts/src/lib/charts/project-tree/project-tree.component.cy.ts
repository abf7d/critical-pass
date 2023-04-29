import { TestBed } from '@angular/core/testing';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { ProjectTreeComponent } from './project-tree.component';
import { ProjectTreeModule } from './project-tree.module';
import { TreeOperationsService } from './tree-operations/tree-operations.service';

describe(ProjectTreeComponent.name, () => {
    beforeEach(() => {
        TestBed.overrideComponent(ProjectTreeComponent, {
            add: {
                imports: [ProjectTreeModule],
                providers: [
                    TreeOperationsService,
                    { provide: DASHBOARD_TOKEN, useClass: DashboardService },
                    { provide: EVENT_SERVICE_TOKEN, useClass: EventService },
                ],
            },
        });
    });

    it('renders', () => {
        cy.mount(ProjectTreeComponent, {
            componentProperties: {
                id: 0,
                width: 0,
                height: 0,
            },
        });
    });
});
