import { Injectable } from '@angular/core';
import { Integration, Project } from '@critical-pass/project/models';

@Injectable({
    providedIn: 'root',
})
export class RiskEventsService {
    constructor() {}

    public isGraphConnected(project: Project): boolean {
        const visited: number[] = [];
        if (project.integrations.length === 0) {
            return false;
        }
        this.markVisited(project, project.integrations[0], visited);
        let isConnected = true;
        for (const integration of project.integrations) {
            if (visited.find(id => id === integration.id) === undefined) {
                isConnected = false;
            }
        }
        return isConnected;
    }

    private markVisited(project: Project, node: Integration, visited: number[]): void {
        if (visited.find(id => id === node.id) !== undefined) {
            return;
        }
        visited.push(node.id);
        const connectedNodes = this.getOutNodes(project, node.id);
        for (const outNode of connectedNodes) {
            this.markVisited(project, outNode, visited);
        }
    }
    private getOutNodes(project: Project, nodeId: number): Integration[] {
        const outEdges = project.activities.filter(l => l.chartInfo.source_id === nodeId);
        const inEdges = project.activities.filter(l => l.chartInfo.target_id === nodeId);
        const outNodes = outEdges.map(a => a.chartInfo.target).filter(a => a !== undefined) as Integration[];
        const inNodes = inEdges.map(a => a.chartInfo.source).filter(a => a !== undefined) as Integration[];;
        return [...outNodes, ...inNodes];
    }
}
