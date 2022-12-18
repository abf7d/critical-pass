import { Injectable } from '@angular/core';
import { Integration } from '../../../models/project/integration/integration';
import { Project } from '../../../models/project/project';
import { Activity } from '../../../models/project/activity/activity';
import { ActivitySerializerService } from '../../serializers/project/activity/activity-serializer.service';
import { DependencyCrawlerService } from '../dependency-crawler/dependency-crawler.service';

@Injectable({
    providedIn: 'root',
})
export class MilestoneFactoryService {
    constructor(private depCrawler: DependencyCrawlerService) {}

    private createMilestoneActivity(node: Integration, project: Project): Activity {
        let maxId = null;
        project.activities.forEach(a => {
            if (a.profile.id > maxId) {
                maxId = a.profile.id;
            }
        });
        let id = -1;
        if (isNaN(maxId)) {
            id = 0;
        } else {
            id = maxId + 1;

            const activity = new ActivitySerializerService().new(id, id.toString(), null, null, 0, 0);
            activity.chartInfo.isDummy = true;
            activity.chartInfo.milestoneNodeId = node.id;
            activity.subProject.subGraphId = -1;

            const milestoneNum = project.integrations.filter(m => m.isMilestone).length;
            node.milestoneNumber = milestoneNum;
            node.milestoneName = 'M' + milestoneNum;
            activity.profile.name = node.milestoneName;

            project.activities.push(activity);
            node.milestoneActivityId = activity.profile.id;
            node.milestoneActivity = activity;

            const deps = this.depCrawler.getActivityDependencies(project, activity);
            activity.profile.depends_on = deps.join();
            return activity;
        }
    }

    public createMilestone(proj: Project, selectedNode: Integration): void {
        if (selectedNode !== null) {
            if (!selectedNode.isMilestone) {
                const hasM = proj.integrations.find(a => a.isMilestone);
                if (hasM === undefined) {
                    selectedNode.milestoneNumber = 0;
                    selectedNode.milestoneName = 'M0';
                    selectedNode.isMilestone = true;
                } else {
                    const maxNum = Math.max(...proj.integrations.map(a => a.milestoneNumber)) + 1;
                    selectedNode.milestoneNumber = hasM.milestoneNumber + 1;
                    selectedNode.milestoneName = 'M' + maxNum;
                    selectedNode.isMilestone = true;
                }
                this.createMilestoneActivity(selectedNode, proj);
            } else {
                this.changeBackToNonMilestone(selectedNode, proj);
                selectedNode.isMilestone = false;
                selectedNode.milestoneNumber = 0;
                selectedNode.milestoneName = '';
            }
        }
    }

    public changeBackToNonMilestone(node: Integration, project: Project) {
        const actOwned = project.activities.findIndex(a => a.profile.id === node.milestoneActivityId);
        project.activities.splice(actOwned, 1);
        node.milestoneActivityId = null;
        node.milestoneActivity = null;
        node.isMilestone = false;
        node.milestoneNumber = 0;
        node.milestoneName = '';
    }

    public removeMilestoneByNode(node: Integration, project: Project) {
        const actOwned = project.activities.find(a => a.profile.id === node.milestoneActivityId);
        if (actOwned) {
            const actIndex = project.activities.indexOf(actOwned);
            project.activities.splice(actIndex, 1);
        }

        const owned = project.integrations.findIndex(x => x.id === node.id);
        project.integrations.splice(owned, 1);
        const toSplice = project.activities.filter(l => {
            if (l.chartInfo.source === null || l.chartInfo.target === null) {
                return false;
            }
            return l.chartInfo.source.id === node.id || l.chartInfo.target.id === node.id;
        });
        toSplice.forEach(l => project.activities.splice(project.activities.indexOf(l), 1));
    }

    public removeMilestoneByActivity(activity: Activity, project: Project) {
        if (!activity || !project || !activity.chartInfo.milestoneNodeId) {
            return;
        }
        const actOwned = project.activities.findIndex(a => a.profile.id === activity.profile.id);
        project.activities.splice(actOwned, 1);
        const owned = project.integrations.find(x => x.id === activity.chartInfo.milestoneNodeId);
        owned.milestoneName = '';
        owned.milestoneNumber = 0;
        owned.milestoneActivity = null;
        owned.milestoneActivityId = null;
        owned.isMilestone = false;
    }
}
