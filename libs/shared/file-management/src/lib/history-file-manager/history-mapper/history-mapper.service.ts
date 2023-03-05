import { Injectable } from '@angular/core';
import {
    Activity,
    ActivityProfile,
    Chart,
    Integration,
    Phase,
    PhaseSummary,
    Project,
    ProjectProfile,
    Resource,
    ResourceProfile,
    ResourceSummary,
    Role,
    RoleSummary,
    SubProject,
    TagButton,
    TagEntry,
    TagGroup,
    TagGroupOption,
    TreeNode,
} from '@critical-pass/project/types';
import {
    ActivityProfileSerializerService,
    ActivitySerializerService,
    AssignResourcesSerializerService,
    ChartSerializerService,
    IntegrationSerializerService,
    PhaseSerializerService,
    ProjectProfileSerializerService,
    ProjectSerializerService,
    ProjectSubprojectSerializerService,
    ResourceProfileSerializerService,
    ResourceSerializerService,
    ResourceSummarySerializerService,
    RoleSerializerService,
    RoleSummarySerializerService,
} from '@critical-pass/shared/serializers';
import { ProjectTreeNodeSerializerService } from '@critical-pass/charts';
import * as CONST from '../../constants';
import { HistoryWorkbook } from '../../types/history-workbook';
import { ExportWorkbook } from '../../types/export-workbook';
@Injectable({
    providedIn: 'root',
})
export class HistoryMapperService {
    constructor(
        private projectSerializer: ProjectSerializerService,
        private projProfSerializer: ProjectProfileSerializerService,
        private treeNodeSerializer: ProjectTreeNodeSerializerService,
        private resProfSerializer: ResourceProfileSerializerService,
        private resSerializer: ResourceSerializerService,
        private resSumSerializer: ResourceSummarySerializerService,
        private roleSerializer: RoleSerializerService,
        private phaseSerializer: PhaseSerializerService,
        private roleSumSerializer: RoleSummarySerializerService,
        private asResSerializer: AssignResourcesSerializerService,
        private actSerializer: ActivitySerializerService,
        private actProfSerializer: ActivityProfileSerializerService,
        private chartSerializer: ChartSerializerService,
        private intSerializer: IntegrationSerializerService,
        private projectSubProjectSerializer: ProjectSubprojectSerializerService,
    ) {}

    public setProp<T>(target: T, source: any, key: keyof T) {
        return (target[key] = source[key]);
    }

    public getNode(profileEntry: unknown, workbook: HistoryWorkbook): TreeNode {
        const projProfile = this.projProfSerializer.fromJson();

        const treeNode = this.treeNodeSerializer.fromJson();
        if (profileEntry) {
            const projkeys = Object.keys(profileEntry);
            for (const attr of projkeys) {
                if (projProfile.hasOwnProperty(attr)) {
                    // projProfile[attr] = profileEntry[attr];
                    this.setProp<ProjectProfile>(projProfile, profileEntry, attr as keyof ProjectProfile);
                }
                if (treeNode.hasOwnProperty(attr)) {
                    // treeNode[attr] = profileEntry[attr];
                    this.setProp<TreeNode>(treeNode, profileEntry, attr as keyof TreeNode);
                }
                treeNode.parentNodeId = (profileEntry as any)[CONST.PARENT_NODE_ID_COL] ?? null;
                treeNode.id = (profileEntry as any)[CONST.NODE_ID_COL] ?? null;
            }
        }

        const {
            activityData,
            arrowData,
            integrationData,
            activityResourceData,
            activityPhaseData,
            rolesData,
            resourcesData,
            phaseData,
            resourceRoleData,
            subProjectData,
        } = workbook;

        const projActivities = this.mapActivities(profileEntry, activityData, arrowData);
        const resources = this.mapResources(profileEntry, resourcesData);
        const phases = this.mapPhases(profileEntry, phaseData);
        const integrations = this.mapIntegrations(profileEntry, integrationData);
        const roles = this.mapRoles(profileEntry, rolesData);
        const subProject = this.mapSubProject(profileEntry, subProjectData);

        this.mapActivityResources(profileEntry, activityResourceData, projActivities);
        this.mapActivityPhases(profileEntry, activityPhaseData, projActivities);
        this.mapResourceRoles(profileEntry, resourceRoleData, resources);

        const project: Project = this.projectSerializer.fromJson();
        project.activities = projActivities;
        project.integrations = integrations;
        project.profile = projProfile;
        project.resources = resources;
        project.phases = phases;
        project.roles = roles;
        treeNode.data = project;
        if (subProject !== null) {
            project.profile.subProject = subProject;
        }
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

    private mapSubProject(profileEntry: any, subProjectData: any[]): SubProject | null {
        const subProjs = subProjectData
            .filter(a => a.nodeId === profileEntry.nodeId)
            .map(subProjectEntry => {
                const subProject = this.projectSubProjectSerializer.fromJson();
                const keys = Object.keys(subProjectEntry);
                for (const attr of keys) {
                    if (subProject.hasOwnProperty(attr)) {
                        this.setProp(subProject, subProjectEntry, attr as keyof SubProject);
                    }
                }

                return subProject;
            });
        if (subProjs.length === 1) {
            return subProjs[0];
        }
        return null;
    }

    private mapResources(profileEntry: any, resourceData: any[]) {
        const resources = resourceData
            .filter(a => a.nodeId === profileEntry.nodeId)
            .map(resourceEntry => {
                const resProfile = this.resProfSerializer.fromJson();
                const keys = Object.keys(resourceEntry);
                for (const attr of keys) {
                    if (resProfile.hasOwnProperty(attr)) {
                        // resProfile[attr] = resourceEntry[attr];
                        this.setProp(resProfile, resourceEntry, attr as keyof ResourceProfile);
                    }
                }
                const newResource = this.resSerializer.fromJson();
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
                const roleProfile = this.roleSerializer.fromJson();
                const keys = Object.keys(roleEntry);
                for (const attr of keys) {
                    if (roleProfile.hasOwnProperty(attr)) {
                        // roleProfile[attr] = roleEntry[attr];
                        this.setProp(roleProfile, roleProfile, attr as keyof Role);
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
                const newPhase = this.phaseSerializer.fromJson();
                const keys = Object.keys(phaseEntry);
                for (const attr of keys) {
                    if (newPhase.hasOwnProperty(attr)) {
                        // newPhase[attr] = phaseEntry[attr];
                        this.setProp(newPhase, phaseEntry, attr as keyof Phase);
                    }
                }
                newPhase.view.color.color = phaseEntry.colorV;
                newPhase.view.color.backgroundcolor = phaseEntry.backgroundcolor;
                return newPhase;
            });
        return phases;
    }
    private mapResourceRoles(profileEntry: any, resourceRoleData: any[], resources: Resource[]) {
        const roleSumSerializer = this.roleSumSerializer;
        resourceRoleData
            .filter(a => a.nodeId === profileEntry.nodeId)
            .forEach(roleSummaryEntry => {
                const resource = resources.find(r => r.id === roleSummaryEntry.resourceId);
                const roleSum = roleSumSerializer.fromJson();
                const keys = Object.keys(roleSummaryEntry);
                for (const attr of keys) {
                    if (roleSum.hasOwnProperty(attr)) {
                        // roleSum[attr] = roleSummaryEntry[attr];
                        this.setProp(roleSum, roleSummaryEntry, attr as keyof RoleSummary);
                    }
                }
                roleSum.color = roleSummaryEntry.colorV;
                resource?.assign.roles.push(roleSum);
            });
    }
    private mapActivityResources(profileEntry: any, activityResourceData: any[], activities: Activity[]): void {
        const resSumSerializer = this.resSumSerializer;
        activityResourceData
            .filter(a => a.nodeId === profileEntry.nodeId)
            .forEach(resourceSummaryEntry => {
                const activity = activities.find(a => a.profile.id === resourceSummaryEntry.activityId);
                const resSummary = resSumSerializer.fromJson();
                const keys = Object.keys(resourceSummaryEntry);
                for (const attr of keys) {
                    if (resSummary.hasOwnProperty(attr)) {
                        // resSummary[attr] = resourceSummaryEntry[attr];
                        this.setProp(resSummary, resourceSummaryEntry, attr as keyof ResourceSummary);
                    }
                }
                resSummary.color.color = resourceSummaryEntry.colorV;
                resSummary.color.backgroundcolor = resourceSummaryEntry.backgroundcolor;
                activity?.assign.resources.push(resSummary);
            });
    }
    private mapActivityPhases(profileEntry: any, activityPhaseData: any[], activities: Activity[]): void {}
    private mapActivities(profileEntry: any, activityData: any[], arrowData: any[]): Activity[] {
        const assignResSer = this.asResSerializer;
        const projActivities = activityData
            .filter(a => a.nodeId === profileEntry.nodeId)
            .map(activity => {
                const newActivity = this.actSerializer.fromJson();
                const profile = this.actProfSerializer.fromJson();
                const keys = Object.keys(activity);
                for (const attr of keys) {
                    if (profile.hasOwnProperty(attr)) {
                        // profile[attr] = activity[attr];
                        this.setProp<ActivityProfile>(profile, activity, attr as keyof ActivityProfile);
                    }
                }
                newActivity.profile = profile;
                const arrow = arrowData.filter(a => a.nodeId === profileEntry.nodeId).find(a => (a as any).id === (activity as any).id);
                if (arrow) {
                    const chartInfo = this.chartSerializer.fromJson();
                    const chartkeys = Object.keys(arrow);
                    for (const attr of chartkeys) {
                        if (chartInfo.hasOwnProperty(attr)) {
                            // chartInfo[attr] = arrow[attr];
                            this.setProp(chartInfo, arrow, attr as keyof Chart);
                        }
                    }

                    newActivity.chartInfo = chartInfo;
                }
                activity.assign = assignResSer.fromJson();
                this.setActivityDates(newActivity);
                return newActivity;
            });
        // filter out activities that have the same source and target as a sanity check
        return projActivities.filter(
            a => (a.chartInfo.source_id !== undefined && a.chartInfo.source_id !== a.chartInfo.target_id) || a.chartInfo.source_id === undefined,
        );
    }

    private setActivityDates(activity: Activity): void {}

    private mapIntegrations(profileEntry: any, integrationData: any) {
        const integrations = integrationData
            .filter((a: any) => a.nodeId === profileEntry.nodeId)
            .map((int: any) => {
                const newIntegration = this.intSerializer.fromJson();
                const keys = Object.keys(int);
                for (const attr of keys) {
                    if (newIntegration.hasOwnProperty(attr)) {
                        // newIntegration[attr] = int[attr];
                        this.setProp(newIntegration, int, attr as keyof Integration);
                    }
                }
                return newIntegration;
            });
        return integrations;
    }

    public getHistoryEntryWorkbook(node: TreeNode): ExportWorkbook {
        const project = node.data!;
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

        const subProject = { ...project.profile.subProject, graphId: project.profile.id, nodeId: treeNode.nodeId };

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
        let activityPhases: PhaseSummary[] = [];

        let tagPool: TagButton[] = [];
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
        let activityResources: ResourceSummary[] = [];
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
        let resourceRoles: RoleSummary[] = [];
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
        let activityTags: TagEntry[] = [];
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
        return {
            profiles,
            nodes,
            chartInfos,
            projProfile,
            phases,
            resources,
            roles,
            activityPhases,
            activityResources,
            resourceRoles,
            tagPool,
            activityTags,
            subProject,
        };
    }
}
