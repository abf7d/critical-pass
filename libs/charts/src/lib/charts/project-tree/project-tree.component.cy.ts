import { TestBed } from '@angular/core/testing';
import { ProjectTreeComponent } from './project-tree.component';
import { ProjectTreeModule } from './project-tree.module';
import { TreeOperationsService } from './tree-operations/tree-operations.service';
import { CP_CONFIG, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import * as CONST from '../../constants/constants';

import { Project } from '@critical-pass/project/types';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { configureDashboard } from 'libs/charts/cypress/support/utils';

let data: Project | undefined;
let serializer = new ProjectSerializerService();
let dashboard = configureDashboard();
let eventService = new EventService();
let nodes: any = null;

describe(ProjectTreeComponent.name, () => {
    beforeEach(() => {
        cy.fixture('tree.json').then(function (json) {
            nodes = json;
            eventService.get(CONST.LOAD_TREE_KEY).next(json);
        });
        cy.fixture('project.json').then(function (json) {
            data = serializer.toJson(json);
            dashboard.activeProject$.next(data!);
        });
        cy.clock();
        TestBed.overrideComponent(ProjectTreeComponent, {
            add: {
                imports: [ProjectTreeModule],
                providers: [
                    { provide: DASHBOARD_TOKEN, useValue: dashboard },
                    { provide: EVENT_SERVICE_TOKEN, useValue: eventService },
                ],
            },
        });
    });

    it('renders', () => {
        cy.mount(ProjectTreeComponent, {
            componentProperties: {
                id: 0,
                width: 390,
                height: 700,
            },
        });

        cy.wait(1000);
        cy.matchImageSnapshot('projectTreeRender');
    });
});
