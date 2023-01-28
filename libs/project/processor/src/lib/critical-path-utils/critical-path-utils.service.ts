import { Inject, Injectable } from '@angular/core';
import { Edge, Project, Route, Vertex } from '@critical-pass/project/types';
// import { LoggerBase } from '../../../models/base/logger-base';

@Injectable({
    providedIn: 'root',
})
export class CriticalPathUtilsService {
    constructor(/*@Inject('LoggerBase') private logger: LoggerBase*/) {}

    public hasDuplicates(project: Project) {
        const dups = project.integrations.filter(i => project.integrations.filter(x => x.id === i.id).length > 1);
        return dups.length > 0;
    }
    public calculateCriticalPath(route: Route): boolean {
        if (!route || (!route.start && !route.end)) {
            return false;
        }
        for (const vertex of route.vertices) {
            vertex.distance = -1;
            vertex.LFT = Infinity;
            vertex.previous = null;
            vertex.visited = false;
        }
        if (route !== null && route.start !== null) {
            route.start.distance = 0;
            const success = this.runForwardPath(route, route.start, []);
            if (!success) {
                return false;
            }
            if (route.end !== null) {
                route.pathFound = false;
                route.end.LFT = route.end.distance;
                this.runReversePath(route, route.end, []);
            }
        }
        return true;
    }

    // Does one iteration of Dijkstra's
    public runForwardPath(route: Route, curVertex: Vertex, prevVertSeen: number[], pathTxt = ''): boolean {
        // Algorithm:
        // From start node:
        //   - calculate tenative distances for all adjacent nodes (curNode dist + edge weight)
        //   - use the larger of either the existing distance or the new tentative distance
        //   - set the 'previous node' for back tracing over the critical path
        //   - If we made it to the destination, then we're done
        // 	- every branch is walked an the largest distances remain on each node
        // 	- sets distance which represents EFT
        // console.log('dij ' + pathTxt);

        // Test if we're done.. If we have found the END vertex, then no need to search further
        // -1 is the default for no distance
        // done to detect loops if current vertex has already been seen, we've hit a loop

        if (curVertex === route.end) {
            route.pathFound = true;
            return true;
        } else if (curVertex !== null && curVertex.distance !== null && curVertex.distance > -1) {
            if (prevVertSeen.indexOf(curVertex.id) !== -1) {
                console.error('loop detected');
                return false;
            }
            prevVertSeen.push(curVertex.id);
            let success = true;
            for (const edge of curVertex.edges) {
                if (edge !== null) {
                    let distance = curVertex.distance;
                    if (distance < edge.minEST) {
                        distance = edge.minEST;
                    }
                    const tentativeDistance = distance + edge.weight;
                    const tentativeVertex = this.getOpposingVertex(edge, curVertex);

                    // edge is an out arrow (curVertex is not destination) and new distance is greater than current node value
                    if (curVertex !== edge.destination && tentativeVertex.distance !== null && tentativeDistance > tentativeVertex.distance) {
                        tentativeVertex.distance = tentativeDistance;
                        tentativeVertex.previous = curVertex;
                        success = success && this.runForwardPath(route, tentativeVertex, prevVertSeen.slice(), pathTxt + ' > ' + curVertex.id);
                    }
                }
            }
            return success;
        }
        return false;
    }

    public getOpposingVertex(edge: Edge, current: Vertex): Vertex {
        if (edge.origin !== null && edge.origin.id === current.id) {
            return edge.destination;
        }
        return edge.origin;
    }
    // Opposite direction of doDijkstraIteration, sets LFT
    public runReversePath(route: Route, curVertex: Vertex, prevVertSeen: Array<number>, pathTxt = '') {
        if (curVertex === route.start) {
            route.pathFound = true;
            return;
        } else if (curVertex !== null && curVertex.LFT !== null && curVertex.LFT > -1) {
            // -1 is the default for no distance
            // done to detect loops if current vertex has already been seen, we've hit a loop
            if (prevVertSeen.indexOf(curVertex.id) !== -1) {
                console.error('loop detected');
                return;
            }
            prevVertSeen.push(curVertex.id);

            for (const edge of curVertex.edges) {
                if (edge !== null) {
                    const tentativeDistance = curVertex.LFT - edge.weight;
                    const tentativeVertex = this.getOpposingVertex(edge, curVertex);
                    if (curVertex !== edge.origin && tentativeVertex.LFT !== null && tentativeDistance < tentativeVertex.LFT) {
                        tentativeVertex.LFT = tentativeDistance;
                        this.runReversePath(route, tentativeVertex, prevVertSeen.slice(), pathTxt + ' > ' + curVertex.id);
                    }
                }
            }
        }
    }
}
