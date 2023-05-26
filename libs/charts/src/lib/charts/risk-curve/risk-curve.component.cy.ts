import { TestBed } from '@angular/core/testing';
import { DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { RiskCurveComponent } from './risk-curve.component';
import { RiskCurveModule } from './risk-curve.module';

import { Project } from '@critical-pass/project/types';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { configureDashboard } from 'libs/charts/cypress/support/utils';

let data: Project | undefined;
let serializer = new ProjectSerializerService();
let dashboard = configureDashboard();

describe(RiskCurveComponent.name, () => {
    beforeEach(() => {
        cy.fixture('project.json').then(function (json) {
            data = serializer.fromJson(json);
            dashboard.updateProject(data, true);
        });

        TestBed.overrideComponent(RiskCurveComponent, {
            add: {
                imports: [RiskCurveModule],
                providers: [
                    { provide: DASHBOARD_TOKEN, useValue: dashboard },
                    { provide: EVENT_SERVICE_TOKEN, useClass: EventService },
                ],
            },
        });
    });

    it('renders risk curve', () => {
        cy.mount(RiskCurveComponent, {
            componentProperties: {
                id: 0,
                width: 1200,
                height: 700,
            },
        });

        cy.matchImageSnapshot('riskCurveRender');
    });

    it('renders no risk curve message', () => {
        const project = serializer.fromJson();
        dashboard.updateProject(project, true);
        cy.mount(RiskCurveComponent, {
            componentProperties: {
                id: 0,
                width: 1200,
                height: 700,
            },
        });

        cy.matchImageSnapshot('emptyProjRiskCurveRender');
    });
});
