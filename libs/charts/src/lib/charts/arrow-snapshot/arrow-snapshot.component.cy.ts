import { TestBed } from '@angular/core/testing';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { ArrowSnapshotComponent } from './arrow-snapshot.component';
import { ArrowSnapshotModule } from './arrow-snapshot.module';

describe(ArrowSnapshotComponent.name, () => {
    beforeEach(() => {
        TestBed.overrideComponent(ArrowSnapshotComponent, {
            add: {
                imports: [ArrowSnapshotModule],
                providers: [
                    { provide: DASHBOARD_TOKEN, useClass: DashboardService },
                    { provide: EVENT_SERVICE_TOKEN, useClass: EventService },
                ],
            },
        });
    });

    it('renders', () => {
        cy.mount(ArrowSnapshotComponent, {
            componentProperties: {
                id: 0,
                width: 0,
                height: 0,
                parentId: '',
                slot: '',
                refresh: 0,
            },
        });
    });
});
