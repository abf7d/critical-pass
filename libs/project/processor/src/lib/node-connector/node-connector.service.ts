import { Inject, Injectable } from '@angular/core';
import { Project } from '../../../models/project/project';
import { LoggerBase } from '../../../models/base/logger-base';

@Injectable({
    providedIn: 'root',
})
export class NodeConnectorService {
    constructor(@Inject('LoggerBase') private logger: LoggerBase) {}

    public connectArrowsToNodes(project: Project): void {
        const nodeCollection = {};
        for( const node of project.integrations) {
            nodeCollection[node.id] = node;
        }
        for (const arrow of project.activities) {
            if (arrow.chartInfo.source_id !== null && arrow.chartInfo.target_id !== null) {
                const sourceNode = nodeCollection[arrow.chartInfo.source_id]; 
                const targetNode = nodeCollection[arrow.chartInfo.target_id];

                if (!sourceNode || !targetNode) {
                    this.logger.error('Connecting arrows to nodes: target or source node null')
                }

                arrow.chartInfo.source = sourceNode ? sourceNode : null;
                arrow.chartInfo.target = targetNode ? targetNode : null;
            }

            if (arrow.chartInfo.milestoneNodeId) {
                const milestone = nodeCollection[arrow.chartInfo.milestoneNodeId]; 
                if (milestone) {
                    milestone.milestoneActivity = arrow;
                }
            }
        }
    }
}