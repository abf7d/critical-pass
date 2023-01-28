import { Inject, Injectable } from '@angular/core';
import { Project, Route } from '@critical-pass/project/types';
import { GraphFactoryService } from '../path-factories/graph-factory/graph-factory.service';
// import { LoggerBase } from '../../../models/base/logger-base';
// import { GraphSerializerService } from '../../serializers/risk/graph-builder/graph-serializer.service';

@Injectable({
    providedIn: 'root',
})
export class VertexGraphBuilderService {
    constructor(/*@Inject('LoggerBase') private logger: LoggerBase,*/ private graphModels: GraphFactoryService) {}

    public validateStartEndNodes(project: Project) {
        const ends = project.integrations.filter(x => project.activities.find(a => a.chartInfo.source === x) === undefined);
        const starts = project.integrations.filter(x => project.activities.find(a => a.chartInfo.target === x) === undefined);
        return ends.length === 1 && starts.length === 1;
    }

    public initializeRoute(project: Project): Route | null {
        if (project.profile.start !== undefined && project.profile.end !== undefined) {
            return this.graphModels.createRoute(project.profile.start, project.profile.end);
        }
        return null;
    }

    public createRoute(project: Project): Route | null {
        const route = this.initializeRoute(project);
        if (route) {
            if (route.startId === null || route.endId === null) {
                // this.logger.info('Invalid Start and End nodes');
                return null;
            }
            this.createVertices(project, route);
            this.createEdges(project, route);
        }
        return route;
    }

    public createVertices(project: Project, route: Route) {
        project.integrations.forEach(n => {
            const vertex = this.graphModels.createVertex(n.id, n.id === route.startId, n.id === route.endId);
            if (n.id === route.startId) {
                route.start = vertex;
            }
            if (n.id === route.endId) {
                route.end = vertex;
            }
            route.vertices.push(vertex);
        });
    }

    public createEdges(project: Project, route: Route) {
        route.vertices.forEach(vertex => {
            const contents = project.activities.filter(e => e.chartInfo.source_id === vertex.id || e.chartInfo.target_id === vertex.id);
            for (const arrow of contents) {
                const alreadyExists = route.edges.find(e => e.id === arrow.profile.id);
                if (!alreadyExists) {
                    const source = route.vertices.find(x => x.id === arrow.chartInfo.source_id);
                    const target = route.vertices.find(x => x.id === arrow.chartInfo.target_id);
                    if (source && target) {
                        let weight = arrow.profile.duration;
                        if (!weight === undefined) {
                            weight = Infinity;
                        }
                        const edge = this.graphModels.createEdge(arrow.profile.id, source, target, weight ?? 0, arrow.profile.minEST);
                        if (source) source.edges.push(edge);
                        if (target) target.edges.push(edge);
                        route.edges.push(edge);
                    }
                }
            }
        });
    }
}
