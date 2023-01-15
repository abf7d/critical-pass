import { Injectable } from '@angular/core';
import { Integration } from '../../../models/project/integration/integration';
import { Project } from '../../../models/project/project';
import { Activity } from '../../../models/project/activity/activity';
import { ArrowState } from '../arrow-state/arrow-state';
import { ActivitySerializerService } from '../../../services/serializers/project/activity/activity-serializer.service';
import { IntegrationSerializerService } from '../../../services/serializers/project/integration/integration-serializer/integration-serializer.service';
import { MilestoneFactoryService } from '../../../services/utils/milestone-factory/milestone-factory.service';
import { ActivityBuilder } from '../../../services/utils/activity-builder/activity-builder';
import { DependencyCrawlerService } from '../../../services/utils/dependency-crawler/dependency-crawler.service';

@Injectable({
    providedIn: 'root',
})
export class ElFactoryService {
    public st: ArrowState;
    private actBuilder: ActivityBuilder = new ActivityBuilder();
    private msFactory: MilestoneFactoryService;
    constructor() {
        const depCrawler = new DependencyCrawlerService();
        this.msFactory = new MilestoneFactoryService(depCrawler);
    }
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
    public handleNodeCreation(ctrl, point: any, proj: Project): boolean {
        this.st.blockDelete = false;

        if (ctrl || this.st.mousedown_node || this.st.mousedown_link) {
            return false;
        }
        this.setLinkIsSelected(this.st.selected_link, proj, false);
        this.setNodeIsSelected(this.st.selected_node, proj, false);
        this.st.selected_link = null;
        this.st.selected_node = null;
        proj.profile.view.selectedIntegration = null;

        let id = Math.max(...proj.integrations.map(x => x.id), 0) + 1;
        const node = new IntegrationSerializerService().new(id, id.toString(), 0, point[0], point[1]);
        node.x = Math.round(point[0]);
        node.y = Math.round(point[1]);

        proj.integrations.push(node);
        return true;
    }
    public addFastActivity(event: any, proj: Project, mode: string, lastSelectedNode: Integration): Activity {
        const keyPressed = event.key;
        const text = event.target.value;
        const trim = text.trim();
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
            return this.actBuilder.addActivity(proj, null, name, duration, mode, lastSelectedNode);
        }
        return null;
    }
    private setLinkIsSelected(activity: Activity, proj: Project, isSelected: boolean): void {
        if (activity?.chartInfo) {
            activity.chartInfo.isSelected = isSelected;
            proj.profile.view.selectedActivity = activity;
        }
        if (!isSelected) {
            proj.profile.view.selectedActivity = null;
        }
    }
    private setNodeIsSelected(node: Integration, proj: Project, isSelected: boolean): void {
        if (node) {
            node.selected = isSelected;
        }
    }
    private updateStartEndNodes(node: Integration, proj: Project, nodeType = null) {
        let connectedLink;
        const nonMilestoneAct = this.filterOutMilestones(proj);
        if (nodeType !== 'end') {
            if (proj.profile.start === node.id) {
                connectedLink = nonMilestoneAct.forEach((l: Activity) => {
                    if (l.chartInfo.source.id === node.id) {
                        return (proj.profile.start = l.chartInfo.target.id);
                    }
                });
            }
        }
        if (nodeType !== 'start') {
            if (proj.profile.end === node.id) {
                return (connectedLink = nonMilestoneAct.forEach((l: Activity) => {
                    if (l.chartInfo.target.id === node.id) {
                        return (proj.profile.end = l.chartInfo.source.id);
                    }
                }));
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
                const { source, target } = arrow.chartInfo;
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
            this.setLinkIsSelected(this.st.selected_link, proj, false);
            this.st.selected_link = null;
            this.st.selected_node = null;
            return (proj.profile.view.selectedActivity = null);
        }
    }
}
