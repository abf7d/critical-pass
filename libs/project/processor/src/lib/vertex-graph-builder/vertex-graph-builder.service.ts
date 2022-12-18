import { Inject, Injectable } from '@angular/core';
import { LoggerBase } from '../../../models/base/logger-base';
import { Project } from '../../../models/project/project';
import { Route } from '../../../models/risk/route';
import { GraphSerializerService } from '../../serializers/risk/graph-builder/graph-serializer.service';

@Injectable({
    providedIn: 'root',
})
export class VertexGraphBuilderService {
    constructor(@Inject('LoggerBase') private logger: LoggerBase, private graphModels: GraphSerializerService) {}

    public validateStartEndNodes(project: Project) {
        const ends = project.integrations.filter(x => project.activities.find(a => a.chartInfo.source === x) === undefined);
        const starts = project.integrations.filter(x => project.activities.find(a => a.chartInfo.target === x) === undefined);
        return ends.length === 1 && starts.length === 1;
    }

    public initializeRoute(project: Project): Route {
        return this.graphModels.createRoute(project.profile.start, project.profile.end);
    }

    public createRoute(project: Project): Route {
        const route = this.initializeRoute(project);
        if (route.startId === null || route.endId === null) {
            this.logger.info('Invalid Start and End nodes');
            return null;
        }
        this.createVertices(project, route);
        this.createEdges(project, route);
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
                    let weight = arrow.profile.duration;
                    if (!weight === undefined) {
                        weight = Infinity;
                    }
                    const edge = this.graphModels.createEdge(arrow.profile.id, source, target, weight, arrow.profile.minEST);
                    source.edges.push(edge);
                    target.edges.push(edge);
                    route.edges.push(edge);
                }
            }
        });
    }
}
