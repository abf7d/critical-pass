import { TestBed } from '@angular/core/testing';
import { StackedResourcesComponent } from './stacked-resources.component';
import { StackedResourcesModule } from './stacked-resources.module';

import { DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { Project } from '@critical-pass/project/types';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { configureDashboard } from 'libs/charts/cypress/support/utils';

let data: Project | undefined;
let serializer = new ProjectSerializerService();
let dashboard = configureDashboard();

describe(StackedResourcesComponent.name, () => {
    beforeEach(() => {
        cy.fixture('project.json').then(function (json) {
            data = serializer.fromJson(json);
            dashboard.updateProject(data, true);
        });

        TestBed.overrideComponent(StackedResourcesComponent, {
            add: {
                imports: [StackedResourcesModule],
                providers: [
                    { provide: DASHBOARD_TOKEN, useValue: dashboard },
                    { provide: EVENT_SERVICE_TOKEN, useClass: EventService },
                ],
            },
        });
    });

    it('large renders', () => {
        cy.mount(StackedResourcesComponent, {
            componentProperties: {
                height: 700,
                width: 1214,
                barWidth: 60,
                showAxes: true,
                id: 0,
                margin: {top:20, right: 50, left: 20, bottom: 130}
            },
        });
        cy.matchImageSnapshot('renderStackedResources large');
        cy.pause();
    });

    it('small renders', () => {
        cy.mount(StackedResourcesComponent, {
            componentProperties: {
                height: 250,
                width: 390,
                barWidth: 10,
                showAxes: false,
                margin: { top: 15, right: 15, left: 15, bottom: 15 },
                id: 0,
            },
        });
        cy.matchImageSnapshot('renderStackedResources small');
    });
});


