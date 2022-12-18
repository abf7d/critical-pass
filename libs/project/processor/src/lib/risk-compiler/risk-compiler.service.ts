import { Inject, Injectable } from '@angular/core';
import { LoggerBase } from '../../../models/base/logger-base';
import { RiskOption } from '../../../models/charts/risk-curve';
import { Activity } from '../../../models/project/activity/activity';
import { Integration } from '../../../models/project/integration/integration';
import { Project } from '../../../models/project/project';
import { Edge } from '../../../models/risk/edge';
import { FloatInfo } from '../../../models/risk/float-info';
import { Route } from '../../../models/risk/route';
import { Vertex } from '../../../models/risk/vertex';
import { VertexGraphBuilderService } from '../vertex-graph-builder/vertex-graph-builder.service';
import { StatsCalculatorService } from '../stats-calculator/stats-calculator.service';
import { FloatSerializerService } from '../../serializers/risk/float-serializer/float-serializer.service';
import { CriticalPathUtilsService } from '../critical-path-utils/critical-path-utils.service';
import { DateUtilsService } from '../date-utils/date-utils.service';
import { ProjectValidatorService } from '../project-validator/project-validator.service';
import * as Keys from '../../../constants/keys';

@Injectable({
    providedIn: 'root',
})
export class RiskCompilerService {
    private floatFactory: FloatSerializerService;
    constructor(
        @Inject('LoggerBase') private logger: LoggerBase,
        private validator: ProjectValidatorService,
        private statsCalc: StatsCalculatorService,
        private criticalPathUtils: CriticalPathUtilsService,
        private graphBuilder: VertexGraphBuilderService,
    ) {
        this.floatFactory = new FloatSerializerService();
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
            this.logger.error('loop detected while calculating risk');
        }
    }

    public setProjectRiskStats(project: Project, riskStats: RiskOption) {
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
            if(a.chartInfo.tf === 0) {
                a.chartInfo.risk =  Keys.RiskCode.Critical;
                a.chartInfo.source.risk =  Keys.RiskCode.Critical;
                a.chartInfo.target.risk =  Keys.RiskCode.Critical;
            } 
        })
    }
    private overwriteWithCriticalPath(forwardPath: Route, project: Project) {
        let pathEnd = forwardPath.end;
        const pathStart = forwardPath.start;
        if (forwardPath.pathFound) {
            while (pathEnd !== pathStart) {
                const endNode = project.integrations.find((n: Integration) => n.id === pathEnd.id);
                const edge = this.findEdge(pathEnd, pathEnd.previous);
                const activity = project.activities.find((l: Activity) => l.profile.id === edge.id);
                if (activity.chartInfo.tf === 0) {
                    activity.chartInfo.risk = Keys.RiskCode.Critical;
                    endNode.risk = Keys.RiskCode.Critical;
                }
                pathEnd = pathEnd.previous;
            }

            const node = project.integrations.find(n => n.id === pathEnd.id);
            const activity = project.activities.find(a => a.chartInfo.source_id === node.id);
            if (activity != null && activity.chartInfo.tf === 0) {
                node.risk = Keys.RiskCode.Critical;
            }
        }
    }
    private findEdge(vertex: Vertex, opposing: Vertex) {
        return vertex.edges.find(e => e.destination.id === opposing.id || e.origin.id === opposing.id);
    }

    private setRiskAndFloat(project: Project, forwardPath: Route) {
        const floatStats = this.calculateFloats(forwardPath);
        const { floats } = floatStats;
        const processedActivities = floatStats.activities;
        let redLimit = project.profile.redLimit;
        let yellowLimit = project.profile.yellowLimit;
        const integrationDict = {};
        project.integrations.forEach(i => (integrationDict[i.id] = i));
        const activityDict = {};
        project.activities.forEach(a => (activityDict[a.profile.id] = a));
        if (isNaN(redLimit) || isNaN(yellowLimit)) {
            redLimit = 0;
            yellowLimit = 0;
        }
        for (const float of floats) {
            let risk;
            let x;
            const totalfloat = float.TF + +project.profile.risk.decompressAmount;
            if (totalfloat === 0) {
                risk = Keys.RiskCode.High;
            }
            if (totalfloat <= redLimit && totalfloat > 0) {
                risk = Keys.RiskCode.High;
            }
            if (totalfloat <= yellowLimit && totalfloat > redLimit) {
                risk = Keys.RiskCode.Medium;
            }
            if (totalfloat > yellowLimit) {
                risk = Keys.RiskCode.Low;
            }

            const link = activityDict[float.id];

            const source: Integration = integrationDict[link.chartInfo.source.id];
            const target: Integration = integrationDict[link.chartInfo.target.id];

            if (source !== undefined && target !== undefined) {
                source.risk = risk;
                target.risk = risk;
                link.chartInfo.risk = risk;
                link.chartInfo.tf = totalfloat;
                link.chartInfo.ff = float.FF;

                const processedActivity = processedActivities.find(l => l.id === float.id);

                source.lft = processedActivity.origin.LFT;
                source.eft = processedActivity.origin.distance;
                target.lft = processedActivity.destination.LFT;
                target.eft = processedActivity.destination.distance;
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

        const estList = edges.map(e => (e === activity || activity.destination === e.destination ? Infinity : e.float.EST));
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
