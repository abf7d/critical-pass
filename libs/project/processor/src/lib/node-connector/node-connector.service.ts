import { Inject, Injectable } from '@angular/core';
import { Integration, Project } from '@critical-pass/project/models';
// import { LoggerBase } from '../../../models/base/logger-base';

@Injectable({
    providedIn: 'root',
})
export class NodeConnectorService {
    constructor(@Inject('LoggerBase') private logger: LoggerBase) {}

    public connectArrowsToNodes(project: Project): void {
        const nodeCollection = new Map<number, Integration>();
        for (const node of project.integrations) {
            nodeCollection.set(node.id, node);
        }
        for (const arrow of project.activities) {
            if (arrow.chartInfo.source_id !== null && arrow.chartInfo.target_id !== null) {
                const sourceNode = nodeCollection.get(arrow.chartInfo.source_id);
                const targetNode = nodeCollection.get(arrow.chartInfo.target_id);

                if (!sourceNode || !targetNode) {
                    this.logger.error('Connecting arrows to nodes: target or source node null');
                }

                arrow.chartInfo.source = sourceNode ? sourceNode : undefined;
                arrow.chartInfo.target = targetNode ? targetNode : undefined;
            }

            if (arrow.chartInfo.milestoneNodeId) {
                const milestone = nodeCollection.get(arrow.chartInfo.milestoneNodeId);
                if (milestone) {
                    milestone.milestoneActivity = arrow;
                }
            }
        }
    }
}
