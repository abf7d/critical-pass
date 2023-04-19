import { Inject, Injectable } from '@angular/core';
import { Activity, Integration, Project } from '@critical-pass/project/types';
import { ActivityBuilder, MilestoneFactoryService } from '@critical-pass/shared/project-utils';
import { ActivitySerializerService, IntegrationSerializerService } from '@critical-pass/shared/serializers';
import { ArrowStateService } from '../../arrow-state/arrow-state';
@Injectable({
    providedIn: 'root',
})
export class ProjectElFactory {
    constructor(private st: ArrowStateService, private actBuilder: ActivityBuilder, private msFactory: MilestoneFactoryService) {}
    public addProjectActivity(source: Integration, target: Integration, proj: Project): Activity {
        let maxId = Math.max(...proj.activities.map(a => a.profile.id), 0);
        const id = maxId + 1;

        const newActivity = new ActivitySerializerService().new(id, id.toString(), source.id, target.id, 0, 0);
        newActivity.chartInfo.isDummy = proj.profile.view.createAsDummy;
        newActivity.chartInfo.source = source;
        newActivity.chartInfo.target = target;
        newActivity.subProject.subGraphId = -1;
        newActivity.profile.sortOrder = id;

        proj.activities.push(newActivity);
        proj.profile.view.selectedActivity = newActivity;
        return newActivity;
    }
    public handleNodeCreation(ctrl: any, point: any, proj: Project): boolean {
        this.st.blockDelete = false;

        if (ctrl || this.st.mousedown_node || this.st.mousedown_link) {
            return false;
        }
        this.clearSelectedLink(proj);
        this.clearSelectedNode(proj);
        let id = Math.max(...proj.integrations.map(x => x.id), 0) + 1;
        const node = new IntegrationSerializerService().new(id, id.toString(), 0, point[0], point[1]);
        node.x = Math.round(point[0]);
        node.y = Math.round(point[1]);

        proj.integrations.push(node);
        return true;
    }
    public addFastActivity(event: any, proj: Project, mode: string, lastSelectedNode: Integration): Activity | null {
        const keyPressed = event.key;
        const text = event.target.value;
        const trim = text.trim();
        // TODO: move to parent function
        if (keyPressed === 'Enter' && trim !== '') {
            const parts = trim.split(',');
            const name = parts[0].trim();
            let duration = 0;
            if (parts.length > 1) {
                const durationText = parts[1].trim();
                if (!isNaN(+durationText)) {
                    duration = +durationText;
                }
            }
            proj.profile.view.autoZoom = true;
            return this.actBuilder.addActivity(proj, name, duration, mode, lastSelectedNode);
        }
        return null;
    }
    private clearSelectedLink(project: Project) {
        const activity = this.st.selected_link;
        if (activity) {
            activity.chartInfo.isSelected = false;
            this.st.selected_link = null;
        }
        project.profile.view.selectedActivity = null;
    }
    private clearSelectedNode(project: Project) {
        const node = this.st.selected_node;
        if (node) {
            node.selected = false;
            this.st.selected_node = null;
        }
        project.profile.view.selectedIntegration = null;
    }
    private updateStartEndNodes(node: Integration, proj: Project, nodeType: string | null = null) {
        let connectedLink;
        const nonMilestoneAct = this.filterOutMilestones(proj);
        if (nodeType !== 'end') {
            if (proj.profile.start === node.id) {
                let sourceStartCount = 0;
                let targetId = null;
                connectedLink = nonMilestoneAct.forEach((l: Activity) => {
                    if (l.chartInfo.source!.id === node.id) {
                        sourceStartCount++;
                        targetId = l.chartInfo.target!.id;
                    }
                });
                if (sourceStartCount === 1 && targetId !== null) {
                    proj.profile.start = targetId;
                }
            }
        }
        if (nodeType !== 'start') {
            if (proj.profile.end === node.id) {
                let sourceEndCount = 0;
                let sourceId = null;
                connectedLink = nonMilestoneAct.forEach((l: Activity) => {
                    if (l.chartInfo.target!.id === node.id) {
                        sourceEndCount++;
                        sourceId = l.chartInfo.source!.id;
                    }
                });
                if (sourceEndCount === 1 && sourceId !== null) {
                    proj.profile.end = sourceId;
                }
            }
        }
    }
    private filterOutMilestones(proj: Project): Activity[] {
        return proj.activities.filter(x => x.chartInfo.milestoneNodeId === null);
    }
    public deleteSelectedNodeOrLink(proj: Project): void {
        const nonMilestoneAct = this.filterOutMilestones(proj);
        if (!this.st.blockDelete) {
            let index;
            // Delete selected node
            if (this.st.selected_node != null) {
                this.updateStartEndNodes(this.st.selected_node, proj);
                this.msFactory.removeMilestoneByNode(this.st.selected_node, proj);
            } else if (this.st.selected_link) {
                const selectedLink = this.st.selected_link;
                const arrow = proj.activities.find(a => a.profile.id === selectedLink.profile.id);
                if (arrow === undefined) {
                    return;
                }
                const { source, target } = arrow.chartInfo;
                if (source === undefined || target === undefined) {
                    return;
                }
                this.updateStartEndNodes(source, proj, 'start');
                this.updateStartEndNodes(target, proj, 'end');
                index = proj.activities.indexOf(arrow);
                proj.activities.splice(index, 1);
                const connToSource = nonMilestoneAct.find(a => a.chartInfo.source_id === source.id || a.chartInfo.target_id === source.id);
                const connToTarget = nonMilestoneAct.find(a => a.chartInfo.source_id === target.id || a.chartInfo.target_id === target.id);
                if (connToSource == null) {
                    const indexS = proj.integrations.indexOf(source);
                    proj.integrations.splice(indexS, 1);
                }

                if (connToTarget == null) {
                    const indexT = proj.integrations.indexOf(target);
                    proj.integrations.splice(indexT, 1);
                }
            }
            this.clearSelectedLink(proj);

            this.st.selected_link = null;
            this.st.selected_node = null;
            proj.profile.view.selectedActivity = null;
        }
    }
}
