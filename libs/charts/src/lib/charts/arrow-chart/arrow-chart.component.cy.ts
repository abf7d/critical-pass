import { TestBed } from '@angular/core/testing';
import { Project } from '@critical-pass/project/types';
import { DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { configureDashboard } from 'libs/charts/cypress/support/utils';
import { ArrowChartComponent } from './arrow-chart.component';
import { ArrowChartModule } from './arrow-chart.module';
import { ArrowStateService } from './arrow-state/arrow-state';

let data: Project | undefined;
let serializer = new ProjectSerializerService();
let dashboard = configureDashboard();
let state = new ArrowStateService();
before(function () {
});
describe(ArrowChartComponent.name, () => {
    afterEach(() => {
        data!.integrations = [];
        data!.activities = [];
        dashboard.activeProject$.next(data!);
    });
    beforeEach(() => {
        cy.fixture('project.json').then(function (json) {
            data = serializer.fromJson(json);
            dashboard.updateProject(data, true);
        });
        TestBed.overrideComponent(ArrowChartComponent, {
            add: {
                imports: [ArrowChartModule],
                providers: [
                    { provide: DASHBOARD_TOKEN, useValue: dashboard },
                    { provide: EVENT_SERVICE_TOKEN, useClass: EventService },
                    { provide: ArrowStateService, useValue: state },
                ],
            },
        });
    });

    it('draw arrow diagram and move one node with ctrl + drag', () => {
        cy.mount(ArrowChartComponent, {
            componentProperties: {
                id: 0,
                width: 1200,
                height: 700,
                rebuild: false,
                showFastCreator: false,
            },
        });

        // verify the id in the node's text element, we are moving node 18
        cy.get('.node > g > text').eq(15).should('have.text', '18');
        // get the node group of the element we are moving and assert the location
        cy.get('.node > g').eq(15).should('have.attr', 'transform', 'translate(773,189)');
        cy.wait(1000);

        cy.window().then(win => {
            state.ctrl_down = true;
            cy.get('svg').trigger('keydown', { which: 1, keyCode: 17, force: true, view: win });
            cy.get('circle')
                .eq(15)
                .trigger('mousedown', {
                    which: 1,
                    force: true,
                    view: win,
                })
                .trigger('mousemove', {
                    clientX: 200,
                    clientY: 200,
                    screenX: 200,
                    screenY: 200,
                    pageX: 200,
                    pageY: 200,
                    force: true,
                })
                .trigger('mouseup', {
                    force: true,
                    view: win,
                });
            cy.get('svg').trigger('keyup', { keyCode: 17 });
        });

        // verify that the node moved is now at the top of the list
        cy.get('.node > g > text').eq(0).should('have.text', '18');
        // verify that the node has moved
        cy.get('.node > g').eq(0).should('not.have.attr', 'transform', 'translate(773,189)');

        cy.wait(2000);
        cy.get('svg').matchImageSnapshot('moveNode');
        cy.pause();
    });

    it('cut / separate all of a nodes connected arrows into individual nodes', () => {
        cy.mount(ArrowChartComponent, {
            componentProperties: {
                id: 1,
                width: 1200,
                height: 700,
                rebuild: true,
                showFastCreator: false,
            },
        });
        cy.wait(2000);

        // Split a node ctrl + x
        cy.get('circle').eq(2).realMouseDown();
        cy.get('circle').eq(2).realMouseUp();
        cy.get('svg').trigger('keydown', { keyCode: 17 });
        cy.get('svg').trigger('keydown', { keyCode: 88 });
        cy.get('svg').trigger('keyup', { keyCode: 17 });
        cy.get('svg').trigger('keyup', { keyCode: 88 });

        // verify that node 15 has replaced 4 and that 20 is at the bottom of the list
        cy.get('.node > g > text').eq(15).should('have.text', '21');
        cy.get('.node > g > text').eq(18).should('have.text', '20');

        cy.wait(2000);
        cy.get('svg').matchImageSnapshot('splitNode');
        cy.pause();
    });

    it('create 2 nodes, draw arrow between them', () => {
        cy.mount(ArrowChartComponent, {
            componentProperties: {
                id: 1,
                width: 1200,
                height: 700,
                rebuild: true,
                showFastCreator: false,
            },
        });
        cy.wait(2000);

        // Create two nodes
        cy.get('svg').realClick({ x: 100, y: 100, clickCount: 2 });
        cy.get('svg').realClick({ x: 50, y: 100, clickCount: 2 });

        // Create an arrow between new nodes
        cy.get('.unprocessed circle').eq(1).realMouseDown();
        cy.get('body').realMouseMove(50, 0);
        cy.get('.unprocessed circle').eq(0).realMouseUp();
        cy.wait(2000);

        // verify that the nodes were created
        cy.get('.node > g > text').eq(0).should('have.text', '20');
        cy.get('.node > g > text').eq(1).should('have.text', '21');

        // verify that the arrow was created
        cy.get('.link > g')
            .eq(28)
            .within($group => {
                cy.get('text').eq(0).should('have.text', '29');
            });
        cy.wait(2000);
        cy.get('svg').matchImageSnapshot('create2NodesAnd1Arrow');
        cy.pause();
    });

    // delete a node
    it('delete node after selecting it', () => {
        cy.mount(ArrowChartComponent, {
            componentProperties: {
                id: 1,
                width: 1200,
                height: 700,
                rebuild: true,
                showFastCreator: false,
            },
        });
        cy.wait(2000);
        cy.get('circle').eq(2).realMouseDown();
        cy.get('circle').eq(2).realMouseUp();

        // Press delete key
        cy.get('svg').trigger('keydown', { keyCode: 46 });
        cy.get('svg').trigger('keyup', { keyCode: 46 });

        cy.wait(2000);
        // Check for exact match with regex using ^ and $
        cy.get('.node > g > text').contains(/^4$/).should('not.exist');
        cy.get('svg').matchImageSnapshot('deleteNode');
        cy.pause();
    });

    // delete an arrow
    it('delete arrow after selecting it', () => {
        cy.mount(ArrowChartComponent, {
            componentProperties: {
                id: 1,
                width: 1200,
                height: 700,
                rebuild: true,
                showFastCreator: false,
            },
        });
        // state.prevProjId = 15;
        cy.wait(2000);
        cy.get('path.link.main').eq(2).realMouseDown();
        cy.get('path.link.main').eq(2).realMouseUp();

        // Press delete key
        cy.get('svg').trigger('keydown', { keyCode: 46 });
        cy.get('svg').trigger('keyup', { keyCode: 46 });
        cy.get('.link > g > text:contains("Requirements")').should('exist');
        cy.get('.link > g > text:contains("Project")').should('not.exist');

        cy.wait(2000);
        cy.get('svg').matchImageSnapshot('deleteArrow');
        cy.pause();
    });

    // join two nodes
    it('join two nodes', () => {
        cy.mount(ArrowChartComponent, {
            componentProperties: {
                id: 1,
                width: 1200,
                height: 700,
                rebuild: true,
                showFastCreator: false,
            },
        });
        cy.wait(2000);

        // Split a node ctrl + x
        cy.get('circle').eq(2).realMouseDown();
        cy.get('circle').eq(2).realMouseUp();
        cy.get('svg').trigger('keydown', { keyCode: 17 });
        cy.get('svg').trigger('keydown', { keyCode: 88 });
        cy.get('svg').trigger('keyup', { keyCode: 17 });
        cy.get('svg').trigger('keyup', { keyCode: 88 });
        cy.wait(2000);

        cy.window().then(win => {
            state.ctrl_down = true;
            cy.get('svg').trigger('keydown', { which: 1, keyCode: 17, force: true, view: win });
            cy.get('circle')
                .eq(18)
                .trigger('mousedown', {
                    which: 1,
                    force: true,
                    view: win,
                })
                .trigger('mousemove', {
                    clientX: 121,
                    clientY: 70,
                    screenX: 121,
                    screenY: 70,
                    pageX: 121,
                    pageY: 70,
                    force: true,
                })
                .trigger('mousemove', {
                    clientX: 119,
                    clientY: 74,
                    screenX: 119,
                    screenY: 74,
                    pageX: 119,
                    pageY: 74,
                    force: true,
                })
                .wait(2500)
                .realHover()
                .trigger('mouseup', {
                    force: true,
                    view: win,
                });
            cy.get('svg').trigger('keyup', { keyCode: 17 });
        });
        cy.wait(2000);

        // verify from the join that node 21 was removed and 20 exists
        cy.get('.node > g > text').contains(/^21$/).should('not.exist');
        cy.get('.node > g > text').contains(/^20$/).should('exist');
        cy.get('svg').matchImageSnapshot('join2Nodes');
        cy.pause();
    });
});
