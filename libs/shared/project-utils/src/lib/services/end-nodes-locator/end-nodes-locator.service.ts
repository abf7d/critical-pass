import { Injectable } from '@angular/core';
import { Integration, Project } from '@critical-pass/project/models';

@Injectable({
    providedIn: 'root',
})
export class EndNodesLocatorService {
    constructor() {}

    private getInEdges(nodeId: number, proj: Project) {
        return proj.activities.filter(l => l.chartInfo.target_id === nodeId);
    }
    public setStartEndNodesFromLongestPath(proj: Project) {
        if (proj.activities.length === 0) {
            return;
        }
        if (proj.activities.length === 1) {
            proj.profile.start = proj.activities[0].chartInfo.source?.id;
            proj.profile.end = proj.activities[0].chartInfo.target?.id;
            return;
        }
        const connected = proj.activities.filter(l => {
            const isConnectedObj = proj.activities.find(
                a => l.chartInfo.source_id === a.chartInfo.target_id || l.chartInfo.target_id === a.chartInfo.source_id,
            );
            return isConnectedObj != null;
        });
        const connectedStarts = connected.filter(l => {
            const inEdges = this.getInEdges(l.chartInfo.source_id, proj);
            return inEdges.length === 0;
        });
        proj.profile.start = connectedStarts[0].chartInfo.source?.id;
        if (proj.profile.start) {
            const longestPath = this.calcLongestPath(proj, proj.profile.start, null);
            if (longestPath != null && longestPath.length > 0) {
                proj.profile.end = longestPath[longestPath.length - 1].id;
            }
        }
        return proj;
    }

    private getOutEdges(proj: Project, nodeId: number) {
        return proj.activities.filter(l => l.chartInfo.source_id === nodeId);
    }
    private calcLongestPath(proj: Project, start: number, end: number | null) {
        const startNode = proj.integrations.find(n => n.id === start);
        const endNode = proj.integrations.find(n => n.id === end);
        const path: Integration[] = [];
        if (startNode == null) {
            return path;
        }
        const longestPath = this.walkTree(proj, startNode, path, endNode);
        return longestPath;

        return [];
    }
    private walkTree(proj: Project, node: Integration | undefined, path: Integration[], endNode: Integration | undefined) {
        const curPath = path.slice(0);
        if (node === undefined) {
            return curPath;
        }
        curPath.push(node);
        const outEdges = this.getOutEdges(proj, node.id);
        if (node === endNode || outEdges.length === 0) {
            return curPath;
        }
        let maxPath = curPath;
        for (const edge of outEdges) {
            const branchPath = this.walkTree(proj, edge.chartInfo.target, curPath, endNode);
            if (branchPath.length > maxPath.length) {
                maxPath = branchPath;
            }
        }
        return maxPath;
    }
}
