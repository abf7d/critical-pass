import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { DateUtilsService, NodeConnectorService, ProjectCompilerService, RiskCompilerService, StatsCalculatorService } from '@critical-pass/project/processor';
import { ProjectSerializerService } from '@critical-pass/shared/serializers';
import { ActivityValidatorService } from 'libs/project/processor/src/lib/activity-validator/activity-validator.service';
import { CompletionCalcService } from 'libs/project/processor/src/lib/completion-calc/completion-calc.service';
import { CriticalPathUtilsService } from 'libs/project/processor/src/lib/critical-path-utils/critical-path-utils.service';
import { DanglingArrowService } from 'libs/project/processor/src/lib/dangling-arrow/dangling-arrow.service';
import { GraphFactoryService } from 'libs/project/processor/src/lib/path-factories/graph-factory/graph-factory.service';
import { ProjectValidatorService } from 'libs/project/processor/src/lib/project-validator/project-validator.service';
import { VertexGraphBuilderService } from 'libs/project/processor/src/lib/vertex-graph-builder/vertex-graph-builder.service';


export function configureDashboard(): DashboardService {
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
