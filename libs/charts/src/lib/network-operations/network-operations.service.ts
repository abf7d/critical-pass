import { Injectable } from '@angular/core';
import { Project } from '../../../models/project/project';
import { Integration } from '../../../models/project/integration/integration';
import { Activity } from '../../../models/project/activity/activity';
import { IntegrationSerializerService } from '../../serializers/project/integration/integration-serializer/integration-serializer.service';

@Injectable({
    providedIn: 'root',
})
export class NetworkOperationsService {
    constructor() {}

    getNodeById(id: number, project: Project): Integration {
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

    public splitUpNode(node: Integration, proj: Project): { sources: any; targets: any } {
        // mainNode = _.find(@nodes, (n) -> return n.id == nodeId)
        if (node == null) {
            return;
        }
        const inEdges = this.getInEdges(node.id, proj);
        const outEdges = this.getOutEdges(node.id, proj);

        let maxId = Math.max(...proj.integrations.map(i => i.id));
        const yPos = node.y;
        const xPos = node.x;
        const inEdgeNum = inEdges.length;
        const sources = {};
        const targets = {};
        let index = 0;
        inEdges.forEach(a => {
            maxId++;
            const y = yPos - 6 * (inEdgeNum - index);
            const splitNode = new IntegrationSerializerService().new(maxId, maxId.toString(), 0, xPos, y);
            a.chartInfo.target_id = maxId;
            a.chartInfo.target = splitNode;
            proj.integrations.push(splitNode);
            targets[maxId] = splitNode;
            index++;
        });

        const outEdgeNum = outEdges.length;
        index = 0;
        outEdges.forEach(a => {
            maxId++;
            const y = yPos + 6 * (outEdgeNum - index);
            const splitNode = new IntegrationSerializerService().new(maxId, maxId.toString(), 0, xPos, y);
            a.chartInfo.source_id = maxId;
            a.chartInfo.source = splitNode;
            proj.integrations.push(splitNode);
            sources[maxId] = splitNode;
        });
        proj.integrations.splice(proj.integrations.indexOf(node), 1);
        return { sources, targets };
    }
}
