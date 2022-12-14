import { Injectable } from '@angular/core';
import * as Keys from '../../../../../constants/keys';
import { ExportWorkbook, HistoryWorkbook } from '../../../../../models/history/history-workbook';
import { Activity, Project, ProjectTreeNodeSerializerService, Resource, TreeNode } from '../../../../../models';
import {
    ResourceProfileSerializerService,
    ResourceSerializerService,
    ResourceSummarySerializerService,
} from '../../../../serializers/project/resource/resource-serializer/resource-serializer.service';
import { RoleSerializerService, RoleSummarySerializerService } from '../../../../serializers/project/role/role-serializer.service';
import { PhaseSerializerService } from '../../../../serializers/project/phase/phase-serializer/phase-serializer.service';
import { AssignResourcesSerializerService } from '../../../../serializers/project/activity/assign-resources/assign-resources-serializer.service';
import { ActivitySerializerService } from '../../../../serializers/project/activity/activity-serializer.service';
import { ChartSerializerService } from '../../../../serializers/project/activity/chart/chart-serializer.service';
import { IntegrationSerializerService } from '../../../../serializers/project/integration/integration-serializer/integration-serializer.service';
import { ActivityProfileSerializerService } from '../../../../serializers/project/activity/profile/profile-serializer.service';
import { ProjectProfileSerializerService, ProjectSerializerService } from '../../../../serializers/project/project-serializer.service';
@Injectable({
    providedIn: 'root',
})
export class HistoryMapperService {
    constructor() {}

    public getNode(profileEntry: unknown, workbook: HistoryWorkbook): TreeNode {
        const projProfile = new ProjectProfileSerializerService().fromJson();

        const treeNode = new ProjectTreeNodeSerializerService().fromJson();
        if (profileEntry) {
            const projkeys = Object.keys(profileEntry);
            for (const attr of projkeys) {
                if (projProfile.hasOwnProperty(attr)) {
                    projProfile[attr] = profileEntry[attr];
                }
                if (treeNode.hasOwnProperty(attr)) {
                    treeNode[attr] = profileEntry[attr];
                }
                treeNode.parentNodeId = profileEntry[Keys.parentNodeColName] ?? null;
                treeNode.id = profileEntry[Keys.nodeColName] ?? null;
            }
        }

        const { activityData, arrowData, integrationData, activityResourceData, activityPhaseData, rolesData, resourcesData, phaseData, resourceRoleData } =
            workbook;

        const projActivities = this.mapActivities(profileEntry, activityData, arrowData);
        const resources = this.mapResources(profileEntry, resourcesData);
        const phases = this.mapPhases(profileEntry, phaseData);
        const integrations = this.mapIntegrations(profileEntry, integrationData);
        const roles = this.mapRoles(profileEntry, rolesData);

        this.mapActivityResources(profileEntry, activityResourceData, projActivities);
        this.mapActivityPhases(profileEntry, activityPhaseData, projActivities);
        this.mapResourceRoles(profileEntry, resourceRoleData, resources);

        const project: Project = new ProjectSerializerService().fromJson();
        project.activities = projActivities;
        project.integrations = integrations;
        project.profile = projProfile;
        project.resources = resources;
        project.phases = phases;
        project.roles = roles;
        treeNode.data = project;
        this.updateNodeMetadata(projActivities, treeNode);
        return treeNode;
    }

    private updateNodeMetadata(activities: Activity[], node: TreeNode): void {
        const nonDummy = activities.filter(x => !x.chartInfo.isDummy).length;
        const completed = activities.filter(x => !x.chartInfo.isDummy && x.assign.resources.length > 0).length;
        node.metadata = {
            assignmentCompleted: nonDummy == completed,
            time: 0,
            cost: 0,
        };
    }

    private mapResources(profileEntry: any, resourceData: any[]) {
        const resources = resourceData
            .filter(a => a.nodeId === profileEntry.nodeId)
            .map(resourceEntry => {
                const resProfile = new ResourceProfileSerializerService().fromJson();
                const keys = Object.keys(resourceEntry);
                for (const attr of keys) {
                    if (resProfile.hasOwnProperty(attr)) {
                        resProfile[attr] = resourceEntry[attr];
                    }
                }
                const newResource = new ResourceSerializerService().fromJson();
                newResource.profile = resProfile;
                newResource.id = resourceEntry.id;
                newResource.view.color.color = resourceEntry.colorV;
                newResource.view.color.backgroundcolor = resourceEntry.backgroundcolor;
                return newResource;
            });
        return resources;
    }

    private mapRoles(profileEntry: any, roleData: any[]) {
        const roles = roleData
            .filter(a => a.nodeId === profileEntry.nodeId)
            .map(roleEntry => {
                const roleProfile = new RoleSerializerService().fromJson();
                const keys = Object.keys(roleEntry);
                for (const attr of keys) {
                    if (roleProfile.hasOwnProperty(attr)) {
                        roleProfile[attr] = roleEntry[attr];
                    }
                }
                roleProfile.view.color = roleEntry.backgroundcolor;
                return roleProfile;
            });
        return roles;
    }

    private mapPhases(profileEntry: any, phaseData: any[]) {
        const phases = phaseData
            .filter(a => a.nodeId === profileEntry.nodeId)
            .map(phaseEntry => {
                const newPhase = new PhaseSerializerService().fromJson();
                const keys = Object.keys(phaseEntry);
                for (const attr of keys) {
                    if (newPhase.hasOwnProperty(attr)) {
                        newPhase[attr] = phaseEntry[attr];
                    }
                }
                newPhase.view.color.color = phaseEntry.colorV;
                newPhase.view.color.backgroundcolor = phaseEntry.backgroundcolor;
                return newPhase;
            });
        return phases;
    }
    private mapResourceRoles(profileEntry: any, resourceRoleData: any[], resources: Resource[]) {
        const roleSumSerializer = new RoleSummarySerializerService();
        resourceRoleData
            .filter(a => a.nodeId === profileEntry.nodeId)
            .forEach(roleSummaryEntry => {
                const resource = resources.find(r => r.id === roleSummaryEntry.resourceId);
                const roleSum = roleSumSerializer.fromJson();
                const keys = Object.keys(roleSummaryEntry);
                for (const attr of keys) {
                    if (roleSum.hasOwnProperty(attr)) {
                        roleSum[attr] = roleSummaryEntry[attr];
                    }
                }
                roleSum.color = roleSummaryEntry.colorV;
                resource.assign.roles.push(roleSum);
            });
    }
    private mapActivityResources(profileEntry: any, activityResourceData: any[], activities: Activity[]): void {
        const resSumSerializer = new ResourceSummarySerializerService();
        activityResourceData
            .filter(a => a.nodeId === profileEntry.nodeId)
            .forEach(resourceSummaryEntry => {
                const activity = activities.find(a => a.profile.id === resourceSummaryEntry.activityId);
                const resSummary = resSumSerializer.fromJson();
                const keys = Object.keys(resourceSummaryEntry);
                for (const attr of keys) {
                    if (resSummary.hasOwnProperty(attr)) {
                        resSummary[attr] = resourceSummaryEntry[attr];
                    }
                }
                resSummary.color.color = resourceSummaryEntry.colorV;
                resSummary.color.backgroundcolor = resourceSummaryEntry.backgroundcolor;
                activity.assign.resources.push(resSummary);
            });
    }
    private mapActivityPhases(profileEntry: any, activityPhaseData: any[], activities: Activity[]): void {}
    private mapActivities(profileEntry: any, activityData: any[], arrowData: any[]): Activity[] {
        const assignResSer = new AssignResourcesSerializerService();
        const projActivities = activityData
            .filter(a => a.nodeId === profileEntry.nodeId)
            .map(activity => {
                const newActivity = new ActivitySerializerService().fromJson();
                const profile = new ActivityProfileSerializerService().fromJson();
                const keys = Object.keys(activity);
                for (const attr of keys) {
                    if (profile.hasOwnProperty(attr)) {
                        profile[attr] = activity[attr];
                    }
                }
                newActivity.profile = profile;
                const arrow = arrowData.filter(a => a.nodeId === profileEntry.nodeId).find(a => (a as any).id === (activity as any).id);
                if (arrow) {
                    const chartInfo = new ChartSerializerService().fromJson();
                    const chartkeys = Object.keys(arrow);
                    for (const attr of chartkeys) {
                        if (chartInfo.hasOwnProperty(attr)) {
                            chartInfo[attr] = arrow[attr];
                        }
                    }

                    newActivity.chartInfo = chartInfo;
                }
                activity.assign = assignResSer.fromJson();
                this.setActivityDates(newActivity);
                return newActivity;
            });
        return projActivities;
    }

    private setActivityDates(activity: Activity): void {}

    private mapIntegrations(profileEntry: any, integrationData: any) {
        const integrations = integrationData
            .filter(a => a.nodeId === profileEntry.nodeId)
            .map(int => {
                const newIntegration = new IntegrationSerializerService().fromJson();
                const keys = Object.keys(int);
                for (const attr of keys) {
                    if (newIntegration.hasOwnProperty(attr)) {
                        newIntegration[attr] = int[attr];
                    }
                }
                return newIntegration;
            });
        return integrations;
    }

    public getHistoryEntryWorkbook(node: TreeNode): ExportWorkbook {
        const project = node.data;
        const treeNode = {
            name: node.name,
            nodeId: node.id,
            group: node.group,
            subgroup: node.subgroup,
            parentNodeId: node.parentNodeId,
        };

        const profiles = project.activities.map(x => {
            return { ...x.profile, graphId: project.profile.id, nodeId: treeNode.nodeId };
        });
        const chartInfos = project.activities.map(a => {
            return { ...a.chartInfo, id: a.profile.id, graphId: project.profile.id, nodeId: treeNode.nodeId };
        });
        const nodes = project.integrations.map(i => {
            return { ...i, nodeId: treeNode.nodeId };
        });
        const projProfile = { ...project.profile, ...treeNode };

        const phases = project.phases.map(p => {
            return {
                ...p,
                backgroundcolor: p.view.color.backgroundcolor,
                colorV: p.view.color.color,
                view: undefined,
                graphId: project.profile.id,
                nodeId: treeNode.nodeId,
            };
        });
        const resources = project.resources.map(r => {
            return {
                ...r.profile,
                colorV: r.view.color.color,
                backgroundcolor: r.view.color.backgroundcolor,
                id: r.id,
                graphId: project.profile.id,
                nodeId: treeNode.nodeId,
            };
        });
        const roles = project.roles.map(r => {
            return {
                ...r,
                backgroundcolor: r.view.color.backgroundcolor,
                colorV: r.view.color.color,
                view: undefined,
                graphId: project.profile.id,
                nodeId: treeNode.nodeId,
            };
        });
        let activityPhases = [];

        let tagPool = [];
        if (project.tags) {
            project.tags
                .map(p => {
                    return p.tags.map(t => {
                        return {
                            ...t,
                            group: p.name,
                            graphId: project.profile.id,
                            nodeId: treeNode.nodeId,
                        };
                    });
                })
                .map(x => (tagPool = [...x, ...tagPool]));
        }

        // Activities change color based on mode so there should be no loading them here
        project.activities
            .map(a =>
                a.assign.phases.map(p => {
                    return { ...p, activityId: a.profile.id, graphId: project.profile.id, nodeId: treeNode.nodeId };
                }),
            )
            .map(o => (activityPhases = [...o, ...activityPhases]));
        let activityResources = [];
        project.activities
            .map(a =>
                a.assign.resources.map(r => {
                    return {
                        ...r,
                        colorV: r.color.color,
                        backgroundcolor: r.color.backgroundcolor,
                        activityId: a.profile.id,
                        graphId: project.profile.id,
                        nodeId: treeNode.nodeId,
                    };
                }),
            )
            .map(o => (activityResources = [...o, ...activityResources]));
        let resourceRoles = [];
        project.resources
            .map(resource =>
                resource.assign.roles.map(role => {
                    return {
                        ...role,
                        resourceId: resource.id,
                        graphId: project.profile.id,
                        nodeId: treeNode.nodeId,
                    };
                }),
            )
            .map(o => (resourceRoles = [...o, ...resourceRoles]));
        let activityTags = [];
        project.activities.forEach(a => {
            a.tags?.forEach(g => {
                g.tags.forEach(t => {
                    activityTags.push({
                        ...t,
                        group: g.name,
                        activityId: a.profile.id,
                        graphId: project.profile.id,
                        nodeId: treeNode.nodeId,
                    });
                });
            });
        });
        return { profiles, nodes, chartInfos, projProfile, phases, resources, roles, activityPhases, activityResources, resourceRoles, tagPool, activityTags };
    }
}
