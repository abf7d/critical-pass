import { TestBed } from '@angular/core/testing';
import { RiskDonutComponent } from './risk-donut.component';
import { RiskDonutModule } from './risk-donut.module';
import { DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';

import { Project } from '@critical-pass/project/types';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { configureDashboard } from 'libs/charts/cypress/support/utils';

let data: Project | undefined;
let serializer = new ProjectSerializerService();
let dashboard = configureDashboard();

describe(RiskDonutComponent.name, () => {
    beforeEach(() => {
        cy.fixture('project.json').then(function (json) {
            data = serializer.fromJson(json);
            dashboard.updateProject(data, true);
        });
        TestBed.overrideComponent(RiskDonutComponent, {
            add: {
                imports: [RiskDonutModule],
                providers: [
                    { provide: DASHBOARD_TOKEN, useValue: dashboard },
                    { provide: EVENT_SERVICE_TOKEN, useClass: EventService },
                ],
            },
        });
    });

    it('renders', () => {
        cy.mount(RiskDonutComponent, {
            componentProperties: {
                id: 0,
                width: 390,
                height: 320,
            },
        });

        cy.matchImageSnapshot('renderRiskDonut');
    });
});
