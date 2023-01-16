import { Injectable } from '@angular/core';
import { Activity, Integration, Project } from '@critical-pass/project/models';
import { IntegrationSerializerService } from '@critical-pass/shared/serializers';

@Injectable({
    providedIn: 'root',
})
export class NetworkOperationsService {
    constructor() {}

    getNodeById(id: number, project: Project): Integration | undefined {
        return project.integrations.find(n => n.id === id);
    }

    getInEdges(nodeId: number, project: Project): Activity[] {
        return project.activities.filter(l => l.chartInfo.target_id === nodeId);
    }

    getOutEdges(nodeId: number, project: Project): Activity[] {
        return project.activities.filter(l => l.chartInfo.source_id === nodeId);
    }
    joinNodes(source: Integration, target: Integration, project: Project) {
        const sourceInEdges = this.getInEdges(source.id, project);
        const sourceOutEdges = this.getOutEdges(source.id, project);

        for (const edge of sourceInEdges) {
            edge.chartInfo.target_id = target.id;
            edge.chartInfo.target = target;
        }
        for (const edge of sourceOutEdges) {
            edge.chartInfo.source_id = target.id;
            edge.chartInfo.source = target;
        }
        project.integrations.splice(project.integrations.indexOf(source), 1);
    }

    public splitUpNode(node: Integration, proj: Project): { sources: Map<number, Integration>; targets: Map<number, Integration> } | null {
        // mainNode = _.find(@nodes, (n) -> return n.id == nodeId)
        if (node == null) {
            return null;
        }
        const inEdges = this.getInEdges(node.id, proj);
        const outEdges = this.getOutEdges(node.id, proj);

        let maxId = Math.max(...proj.integrations.map(i => i.id));
        const yPos = node.y;
        const xPos = node.x;
        const inEdgeNum = inEdges.length;
        const sources = new Map<number, Integration>();
        const targets = new Map<number, Integration>();
        let index = 0;
        inEdges.forEach(a => {
            maxId++;
            const y = yPos! - 6 * (inEdgeNum - index);
            const splitNode = new IntegrationSerializerService().new(maxId, maxId.toString(), 0, xPos!, y);
            a.chartInfo.target_id = maxId;
            a.chartInfo.target = splitNode;
            proj.integrations.push(splitNode);
            targets.set(maxId, splitNode);
            index++;
        });

        const outEdgeNum = outEdges.length;
        index = 0;
        outEdges.forEach(a => {
            maxId++;
            const y = yPos! + 6 * (outEdgeNum - index);
            const splitNode = new IntegrationSerializerService().new(maxId, maxId.toString(), 0, xPos!, y);
            a.chartInfo.source_id = maxId;
            a.chartInfo.source = splitNode;
            proj.integrations.push(splitNode);
            sources.set(maxId, splitNode);
        });
        proj.integrations.splice(proj.integrations.indexOf(node), 1);
        return { sources, targets };
    }
}
