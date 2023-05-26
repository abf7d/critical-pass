import { TestBed } from '@angular/core/testing';
import { ShallowSComponent } from './shallow-s.component';
import { ShallowSModule } from './shallow-s.module';
import { DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';

import { Project } from '@critical-pass/project/types';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { configureDashboard } from 'libs/charts/cypress/support/utils';

let data: Project | undefined;
let serializer = new ProjectSerializerService();
let dashboard = configureDashboard();

describe(ShallowSComponent.name, () => {
    beforeEach(() => {
        cy.fixture('project.json').then(function (json) {
            data = serializer.fromJson(json);
            dashboard.updateProject(data, true);
        });

        TestBed.overrideComponent(ShallowSComponent, {
            add: {
                imports: [ShallowSModule],
                providers: [
                    { provide: DASHBOARD_TOKEN, useValue: dashboard },
                    { provide: EVENT_SERVICE_TOKEN, useClass: EventService },
                ],
            },
        });
    });

    it('renders', () => {
        cy.mount(ShallowSComponent, {
            componentProperties: {
                id: 0,
                width: 1200,
                height: 700,
            },
        });

        cy.matchImageSnapshot('renderShallowS');
    });
});
