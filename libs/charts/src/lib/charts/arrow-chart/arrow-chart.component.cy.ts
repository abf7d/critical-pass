import { TestBed } from '@angular/core/testing';
import { DateUtilsService, NodeConnectorService, ProjectCompilerService, RiskCompilerService, StatsCalculatorService } from '@critical-pass/project/processor';
import { Project } from '@critical-pass/project/types';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { ActivityValidatorService } from 'libs/project/processor/src/lib/activity-validator/activity-validator.service';
import { CompletionCalcService } from 'libs/project/processor/src/lib/completion-calc/completion-calc.service';
import { CriticalPathUtilsService } from 'libs/project/processor/src/lib/critical-path-utils/critical-path-utils.service';
import { DanglingArrowService } from 'libs/project/processor/src/lib/dangling-arrow/dangling-arrow.service';
import { GraphFactoryService } from 'libs/project/processor/src/lib/path-factories/graph-factory/graph-factory.service';
import { ProjectValidatorService } from 'libs/project/processor/src/lib/project-validator/project-validator.service';
import { VertexGraphBuilderService } from 'libs/project/processor/src/lib/vertex-graph-builder/vertex-graph-builder.service';
import { ArrowChartComponent } from './arrow-chart.component';
import { ArrowChartModule } from './arrow-chart.module';
import { ArrowStateService } from './arrow-state/arrow-state';

let data: Project | undefined;
let serializer = new ProjectSerializerService();
let dashboard = configureDashboard();
let state = new ArrowStateService();
before(function () {
    // cy.fixture('project.json').then(function (json) {
    //     data = serializer.fromJson(json);
    //     // state.ctrl_down = true;
    //     dashboard.updateProject(data, true);
    //     // cy.task('log', { message: 'This will be output to the terminal ' + JSON.stringify(cy.get("svg .unprocessed"))});
    // });
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

            // cy.task('log', { message: 'This will be output to the terminal ' + JSON.stringify(cy.get("svg .unprocessed"))});
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
        cy.wait(2000);
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
        cy.wait(2000);
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
        // state.prevProjId = 15;
        cy.wait(2000);
        // cy.once('uncaught:exception', () => false);
        // cy.get('svg').dblclick(100, 200, {force: true});
        // cy.get('svg').dblclick(50, 200, {force: true});

        // Create two nodes
        cy.get('svg').realClick({ x: 100, y: 100, clickCount: 2 });
        cy.get('svg').realClick({ x: 50, y: 100, clickCount: 2 });

        // Create an arrow between new nodes
        cy.get('.unprocessed circle').eq(1).realMouseDown();
        cy.get('body').realMouseMove(50, 0);
        cy.get('.unprocessed circle').eq(0).realMouseUp();
        cy.wait(2000);
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
        // state.prevProjId = 15;
        cy.wait(2000);
        cy.get('circle').eq(2).realMouseDown();
        cy.get('circle').eq(2).realMouseUp();

        // Press delete key
        cy.get('svg').trigger('keydown', { keyCode: 46 });
        cy.get('svg').trigger('keyup', { keyCode: 46 });
        cy.wait(2000);
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
        cy.wait(2000);
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
                    clientX: 123,
                    clientY: 70,
                    screenX: 123,
                    screenY: 70,
                    pageX: 123,
                    pageY: 70,
                    force: true,
                })
                .wait(500)
                .trigger('mouseup', {
                    force: true,
                    view: win,
                });
            cy.get('svg').trigger('keyup', { keyCode: 17 });
        });
        cy.wait(2000);
        cy.pause();
    });
});

function configureDashboard(): DashboardService {
    const graphModels = new GraphFactoryService();
    const validator = new ProjectValidatorService();
    const criticalPathUtils = new CriticalPathUtilsService();
    const graphBuilder = new VertexGraphBuilderService(graphModels);
    const statsCalc = new StatsCalculatorService();
    const nodeConstructor = new NodeConnectorService();
    const dateUtils = new DateUtilsService();
    const projectUtils = new DanglingArrowService();
    const riskCompiler = new RiskCompilerService(validator, statsCalc, criticalPathUtils, graphBuilder);
    const completionCalc = new CompletionCalcService();
    const activityValidato = new ActivityValidatorService(statsCalc);
    const projSerializer = new ProjectSerializerService();
    const compiler = new ProjectCompilerService(nodeConstructor, dateUtils, projectUtils, riskCompiler, completionCalc, activityValidato);
    const dashboard = new DashboardService(projSerializer, compiler);
    return dashboard;
}
