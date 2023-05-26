import { TestBed } from '@angular/core/testing';
import { DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { ArrowSnapshotComponent } from './arrow-snapshot.component';
import { ArrowSnapshotModule } from './arrow-snapshot.module';
import { Project } from '@critical-pass/project/types';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { configureDashboard } from 'libs/charts/cypress/support/utils';

let data: Project | undefined;
let serializer = new ProjectSerializerService();
let dashboard = configureDashboard();

describe(ArrowSnapshotComponent.name, () => {
    beforeEach(() => {
        cy.fixture('project.json').then(function (json) {
            data = serializer.fromJson(json);
            dashboard.updateProject(data, true);
        });
        TestBed.overrideComponent(ArrowSnapshotComponent, {
            add: {
                imports: [ArrowSnapshotModule],
                providers: [
                    { provide: DASHBOARD_TOKEN, useValue: dashboard },
                    { provide: EVENT_SERVICE_TOKEN, useClass: EventService },
                ],
            },
        });
    });

    it('dashboard data renders', () => {
        cy.wait(2000);
        cy.mount(ArrowSnapshotComponent, {
            componentProperties: {
                id: 0,
                width: 1200,
                height: 700,
                parentId: '2',
                slot: '',
                refresh: 0,
            },
        });
        cy.matchImageSnapshot('arrowSnapshotRender');
    });

    it('project parameter renders', () => {
        cy.wait(2000);
        cy.mount(ArrowSnapshotComponent, {
            componentProperties: {
                id: 0,
                width: 1200,
                height: 700,
                parentId: '2',
                slot: '',
                refresh: 0,
                project: data,
            },
        });
        cy.matchImageSnapshot('arrowSnapshotRender');
    });
});
