import { Inject, Injectable } from '@angular/core';
// import { LoggerBase } from '../../../models/base/logger-base';
import { VertexGraphBuilderService } from '../vertex-graph-builder/vertex-graph-builder.service';
import { StatsCalculatorService } from '../stats-calculator/stats-calculator.service';
// import { FloatSerializerService } from '../../serializers/risk/float-serializer/float-serializer.service';
import { CriticalPathUtilsService } from '../critical-path-utils/critical-path-utils.service';
import { DateUtilsService } from '../date-utils/date-utils.service';
import { ProjectValidatorService } from '../project-validator/project-validator.service';
import * as CONST from '../constants';
import { Activity, Edge, FloatInfo, Integration, Project, RiskStats, Route, Vertex } from '@critical-pass/project/models';
import { FloatFactoryService } from '../path-factories/float-factory/float-factory.service';

@Injectable({
    providedIn: 'root',
})
export class RiskCompilerService {
    private floatFactory: FloatFactoryService;
    constructor(
        // @Inject('LoggerBase') private logger: LoggerBase,
        private validator: ProjectValidatorService,
        private statsCalc: StatsCalculatorService,
        private criticalPathUtils: CriticalPathUtilsService,
        private graphBuilder: VertexGraphBuilderService,
    ) {
        this.floatFactory = new FloatFactoryService();
    }
    public compileRiskProperties(project: Project): void {
        const valid = this.validator.validateProject(project);
        if (!valid) {
            return;
        }
        const route = this.graphBuilder.createRoute(project);
        if (!route) {
            return;
        }
        const success = this.criticalPathUtils.calculateCriticalPath(route);
        if (success) {
            this.resetProjectRisk(project);
            this.setActivityRiskProperties(project, route);
            const riskStats = this.statsCalc.getRiskStats(0, project);
            this.setProjectRiskStats(project, riskStats);
        } else {
            project.profile.loopDetected = true;
            throw 'loop detected while calculating risk';
            // this.logger.error('loop detected while calculating risk');
        }
    }

    public setProjectRiskStats(project: Project, riskStats: RiskStats) {
        const { activity, fibonacci, criticalCount, greenCount, redCount, yellowCount, criticality } = riskStats;
        project.profile.risk.activityRisk = activity;
        project.profile.risk.fibonacciRisk = fibonacci;
        project.profile.risk.criticalityRisk = criticality;
        project.profile.risk.criticalCount = criticalCount;
        project.profile.risk.greenCount = greenCount;
        project.profile.risk.redCount = redCount;
        project.profile.risk.yellowCount = yellowCount;
    }
    public setActivityRiskProperties(project: Project, forwardPath: Route): void {
        if (!forwardPath.start || !forwardPath.end) {
            return;
        }
        this.setRiskAndFloat(project, forwardPath);
        this.overwriteWithCriticalPath(forwardPath, project);
        this.setMultipleCriticalPaths(project);
    }

    private setMultipleCriticalPaths(project: Project) {
        project.activities.forEach(a => {
            if (a.chartInfo.tf === 0) {
                a.chartInfo.risk = CONST.RISK_CODE.Critical;
                if (a.chartInfo.source) a.chartInfo.source.risk = CONST.RISK_CODE.Critical;
                if (a.chartInfo.target) a.chartInfo.target.risk = CONST.RISK_CODE.Critical;
            }
        });
    }
    private overwriteWithCriticalPath(forwardPath: Route, project: Project) {
        let pathEnd = forwardPath.end;
        const pathStart = forwardPath.start;
        if (forwardPath.pathFound) {
            while (pathEnd !== null && pathEnd !== pathStart) {
                const endNode = project.integrations.find((n: Integration) => n.id === pathEnd?.id);
                const edge = this.findEdge(pathEnd, pathEnd.previous);
                const activity = project.activities.find((l: Activity) => l.profile.id === edge?.id);
                if (activity && endNode && activity.chartInfo.tf === 0) {
                    activity.chartInfo.risk = CONST.RISK_CODE.Critical;
                    endNode.risk = CONST.RISK_CODE.Critical;
                }
                pathEnd = pathEnd.previous;
            }
            if (pathEnd !== null) {
                const node = project.integrations.find(n => n.id === pathEnd?.id);
                const activity = project.activities.find(a => a.chartInfo.source_id === node?.id);
                if (node != undefined && activity != null && activity.chartInfo.tf === 0) {
                    node.risk = CONST.RISK_CODE.Critical;
                }
            }
        }
    }
    private findEdge(vertex: Vertex, opposing: Vertex | null) {
        return vertex.edges.find(e => e.destination.id === opposing?.id || e.origin.id === opposing?.id);
    }

    private setRiskAndFloat(project: Project, forwardPath: Route) {
        const floatStats = this.calculateFloats(forwardPath);
        const { floats } = floatStats;
        const processedActivities = floatStats.activities;
        let redLimit = project.profile.redLimit;
        let yellowLimit = project.profile.yellowLimit;
        const integrationDict = new Map<number | undefined, Integration>();
        project.integrations.forEach(i => integrationDict.set(i.id, i));
        const activityDict = new Map<number | undefined, Activity>();
        project.activities.forEach(a => activityDict.set(a.profile.id, a));
        if (isNaN(redLimit) || isNaN(yellowLimit)) {
            redLimit = 0;
            yellowLimit = 0;
        }
        for (const float of floats) {
            let risk: number;
            let x;
            const totalfloat = float.TF + +project.profile.risk.decompressAmount;
            if (totalfloat === 0) {
                risk = CONST.RISK_CODE.High;
            } else if (totalfloat <= redLimit && totalfloat > 0) {
                risk = CONST.RISK_CODE.High;
            } else if (totalfloat <= yellowLimit && totalfloat > redLimit) {
                risk = CONST.RISK_CODE.Medium;
            } else if (totalfloat > yellowLimit) {
                risk = CONST.RISK_CODE.Low;
            } else {
                risk = CONST.RISK_CODE.New;
            }

            const link = activityDict.get(float.id);

            const source = integrationDict.get(link?.chartInfo.source?.id);
            const target = integrationDict.get(link?.chartInfo.target?.id);

            if (source !== undefined && target !== undefined) {
                source.risk = risk;
                target.risk = risk;
                if (link !== undefined) {
                    link.chartInfo.risk = risk;
                    link.chartInfo.tf = totalfloat;
                    link.chartInfo.ff = float.FF;
                }

                const processedActivity = processedActivities.find(l => l.id === float.id);

                if (processedActivity) {
                    source.lft = processedActivity.origin.LFT ?? Infinity;
                    source.eft = processedActivity.origin.distance ?? Infinity;
                    target.lft = processedActivity.destination.LFT ?? Infinity;
                    target.eft = processedActivity.destination.distance ?? Infinity;
                }
            }
        }
    }

    private resetProjectRisk(project: Project) {
        project.integrations.forEach((i: Integration) => {
            i.risk = 0;
        });
        project.activities.forEach(a => {
            a.chartInfo.risk = 0;
        });
    }

    private calculateFloats(forwardPath: Route) {
        let float;
        let flattenedPath: Edge[] = forwardPath.edges.sort((a, b) => a.id);

        const floats: FloatInfo[] = [];
        for (const edge of flattenedPath) {
            float = this.floatFactory.createFloatInfo(edge);
            edge.float = float;
            floats.push(float);
        }

        for (const float of floats) {
            this.calculateFFandIF(float);
        }

        return { floats, activities: flattenedPath };
    }

    private calculateFFandIF(float: FloatInfo) {
        const activity = float.forwardActivity;
        const { edges } = activity.destination;

        const estList = edges.map(e => (e === activity || activity.destination === e.destination || !e.float ? Infinity : e.float.EST));
        let minEST = Math.min(...estList);

        const outArrows = edges.filter(e => activity.destination !== e.destination);
        const isEnd = outArrows.length === 0;

        if (minEST === Infinity) {
            minEST = 0;
        }

        if (isEnd) {
            float.FF = 0;
        } else {
            float.FF = minEST - float.EFT;
        }
        float.IF = float.TF - float.FF;
    }
}
