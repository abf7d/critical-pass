import { Injectable } from '@angular/core';
import { Edge, Route, Vertex } from '@critical-pass/project/models';

@Injectable({
    providedIn: 'root',
})
export class GraphFactoryService {
    constructor() {}

    public createVertex(id: number, isBeginning: boolean, isEnd: boolean): Vertex {
        return {
            id: id,
            isBeginning: isBeginning,
            isEnd: isEnd,
            edges: [],
            curEdge: null,
            selected: false,
            visited: false,
            previous: null,
            next: null,
            distance: null,
            LFT: null,
        } as Vertex;
    }

    public createEdge(id: number, source: Vertex, target: Vertex, weight: number, minEST: number) {
        return {
            id: id,
            origin: source,
            destination: target,
            weight: weight,
            float: null,
            minEST: minEST,
        } as Edge;
    }

    public createRoute(start: number, end: number): Route {
        return {
            startId: start,
            endId: end,
            vertices: [],
            edges: [],
            found: false,
            unvisited: [],
            start: null,
            end: null,
            pathFound: false,
            isRunning: false,
        } as Route;
    }
}
