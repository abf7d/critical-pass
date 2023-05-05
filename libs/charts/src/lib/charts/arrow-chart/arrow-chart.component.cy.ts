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

let data: Project | undefined;
let serializer = new ProjectSerializerService();
let dashboard = configureDashboard();
before(function () {
    cy.fixture('project.json').then(function (json) {
        data = serializer.fromJson(json);
        dashboard.updateProject(data, true);
        // cy.task('log', { message: 'This will be output to the terminal ' + JSON.stringify(cy.get("svg .unprocessed"))});
    });
});
describe(ArrowChartComponent.name, () => {
    beforeEach(() => {
        TestBed.overrideComponent(ArrowChartComponent, {
            add: {
                imports: [ArrowChartModule],
                providers: [
                    { provide: DASHBOARD_TOKEN, useValue: dashboard },
                    { provide: EVENT_SERVICE_TOKEN, useClass: EventService },
                ],
            },
        });
    });

    it('renders', () => {
        cy.mount(ArrowChartComponent, {
            componentProperties: {
                id: 0,
                width: 1200,
                height: 700,
                rebuild: false,
                showFastCreator: false,
            },
        });
        // cy.get("body").realClick({ x: 70, y: 65, clickCount:2 });

        // Create two nodes
        cy.get("body").realClick({ x: 100, y: 100, clickCount:2 });
        cy.get("body").realClick({ x: 50, y: 100, clickCount:2 });
        
        // Create an arrow between new nodes
        cy.get(".unprocessed circle").eq(1).realMouseDown();
        cy.get("body").realMouseMove(100, 100);
        cy.get(".unprocessed circle").eq(0).realMouseUp();

        // Split a node ctrl + x
        cy.get("circle").eq(3).realMouseDown();
        cy.get("svg").trigger('keydown', { keyCode: 17});
        cy.get("svg").trigger('keydown', { keyCode: 88});
        cy.get("svg").trigger('keyup', { keyCode: 17});
        cy.get("svg").trigger('keyup', { keyCode: 88});
        // cy.realType("{del}");

        // cy.get("svg").trigger('keydown', { keyCode: 17});
        // cy.get(".unprocessed circle").eq(0).realMouseDown();
        // // cy.get("svg").realMouseMove(0, 200);
        // cy.get(".unprocessed circle").eq(0).realMouseUp();
        // cy.realType("{del}");



        // cy.get("svg").trigger('keyup', { keyCode: 17});
        // cy.get('body').trigger('keydown', { keyCode: 46});
        // cy.wait(500);
        // cy.get('body').trigger('keyup', { keyCode: 46});
        // cy.wait(1000)
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

// function movePiece (number, x, y) {
//     cy.get(`.piece-${number}`)
//     .trigger('mousedown', { which: 1 })
//     .trigger('mousemove', { clientX: x, clientY: y })
//     .trigger('mouseup', { force: true })
//   }

