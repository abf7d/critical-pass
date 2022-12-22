import { ActivitySerializerService, IntegrationSerializerService } from '@critical-pass/shared/serializers';
import { Injectable } from '@angular/core';
import { P_CONST} from '@critical-pass/project/processor';
import { Activity, Integration, Project } from '@critical-pass/project/models';

@Injectable({
    providedIn: 'root',
})
export class ActivityBuilder {
    private nodeSerializer: IntegrationSerializerService;
    constructor() {
        this.nodeSerializer = new IntegrationSerializerService();
    }
    public addActivity(
        project: Project,
        // activity: Activity | null= null,
        name: string = '',
        duration: number = 0,
        mode: string = P_CONST.MULTI_ARROW_CREATION_MODE,
        lastSelectedNode: Integration | null = null,
    ) {
        let maxLinkId = 0;
        if (project.activities.length > 0) {
            const maxIdObj = Math.max(...project.activities.map(i => i.profile.id));
            maxLinkId = maxIdObj;
        }
        const newActivityId = maxLinkId + 1;

        let maxNodeId = -1;
        if (project.integrations.length > 0) {
            maxNodeId = Math.max(...project.integrations.map(i => i.id));
        }

        if (lastSelectedNode && project.integrations.indexOf(lastSelectedNode) !== -1) {
            return this.addToExistingActivity(lastSelectedNode, newActivityId, maxNodeId + 1, project, name, duration, mode);
        }

        const sourceId = maxNodeId + 1;
        const targetId = sourceId + 1;

        const div = Math.floor(sourceId / 20);
        const rem = sourceId % 20;

        // The first activity is in the top left corner and needs to be moved out from under the quick activity creator
        const firstOffset = 100;

        const sourceX = 50 + 120 * div;
        const sourceY = 20 * (rem + 1) + firstOffset;
        const targetX = 120 + 120 * div;
        const targetY = 20 * (rem + 1) + firstOffset;

        const source = this.nodeSerializer.new(sourceId, sourceId + '', Infinity, sourceX, sourceY);
        const target = this.nodeSerializer.new(targetId, targetId + '', Infinity, targetX, targetY);

        project.integrations.push(source);
        project.integrations.push(target);

        const newActivity = new ActivitySerializerService().new(newActivityId, name, sourceId, targetId, 0, duration);
        newActivity.subProject.subGraphId = -1;
        newActivity.chartInfo.source = source;
        newActivity.chartInfo.target = target;
        newActivity.profile.sortOrder = newActivityId;
        project.activities.push(newActivity);
        return newActivity;
    }

    public addToExistingActivity(
        selectedNode: Integration,
        newActivityId: number,
        newNodeId: number,
        project: Project,
        // activity: Activity,
        name: string,
        duration: number,
        mode: string,
    ) {
        const targetX = (selectedNode.x ?? 0) + 120;
        const targetY = selectedNode.y ?? 0;
        const newActivity = new ActivitySerializerService().new(newActivityId, name, selectedNode.id, newNodeId, 0, duration);
        const target = this.nodeSerializer.new(newNodeId, newNodeId + '', Infinity, targetX, targetY);

        project.integrations.push(target);

        newActivity.subProject.subGraphId = -1;
        newActivity.chartInfo.source = selectedNode;
        newActivity.chartInfo.target = target;
        newActivity.profile.sortOrder = newActivityId;
        project.activities.push(newActivity);

        const children = project.activities.filter(x => x.chartInfo.source === selectedNode);
        const dangling = children.filter(x => project.activities.find(y => y.chartInfo.source === x.chartInfo.target) === undefined);
        const internal = children.filter(x => !dangling.includes(x));
        const originX = selectedNode.x ?? 0;
        const originY = selectedNode.y ?? 0;
        let currentAct = 0;
        dangling.forEach((x, i) => {
            currentAct = this.calculatePos(x, project.activities, originX, originY, currentAct);
            currentAct++;
        });
        return newActivity;
    }

    private calculatePos(x: Activity, internal: Activity[], originX: number, originY: number, index: number): number {
        if (x.chartInfo.target) {
            x.chartInfo.target.x = originX + 120;
            const neg = index % 2 === 0 ? -1 : 1;
            const targetY = neg * 30 * Math.ceil(index / 2);
            x.chartInfo.target.y = originY + targetY;
            const samePos = internal.find(
                y =>
                    !!y.chartInfo.target &&
                    y.profile.id !== x.profile.id &&
                    y.chartInfo.target.y === x.chartInfo.target?.y &&
                    y.chartInfo.target.x === x.chartInfo.target?.x,
            );
            if (samePos) {
                index = this.calculatePos(x, internal, originX, originY, index + 1);
            }
        }
        return index;
    }
}
