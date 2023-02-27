import { Injectable } from '@angular/core';
import { TreeNode } from '@critical-pass/project/types';
import * as XLSX from 'xlsx';
import { FileManagerBaseService } from '../file-manager-base.service';
import { HistoryMapperService } from './history-mapper/history-mapper.service';
import * as CONST from '../constants';
import { HistoryWorkbook } from '../types';

@Injectable({
    providedIn: 'root',
})
export class HistoryFileManagerService implements FileManagerBaseService<TreeNode[]> {
    constructor(private mapper: HistoryMapperService) {}

    public export(history: TreeNode[]): void {
        let arrowProfiles: any[] = [];
        let arrowChartInfos: any[] = [];
        let nodes: any[] = [];
        let projProfiles: any[] = [];
        let subProjects: any[] = [];

        let phases: any[] = [];
        let roles: any[] = [];
        let resources: any[] = [];
        let activityResources: any[] = [];
        let activityPhases: any[] = [];
        let resourceRoles: any[] = [];

        let activityTags: any[] = [];
        let tagPool: any[] = [];
        for (const node of history) {
            const tables = this.mapper.getHistoryEntryWorkbook(node);
            arrowProfiles = [...arrowProfiles, ...tables.profiles];
            arrowChartInfos = [...arrowChartInfos, ...tables.chartInfos];
            nodes = [...nodes, ...tables.nodes];
            projProfiles = [...projProfiles, tables.projProfile];
            subProjects = [...subProjects, tables.subProject];

            phases = [...phases, ...tables.phases];
            roles = [...roles, ...tables.roles];
            resources = [...resources, ...tables.resources];
            activityResources = [...activityResources, ...tables.activityResources];
            activityPhases = [...activityPhases, ...tables.activityPhases];
            resourceRoles = [...resourceRoles, ...tables.resourceRoles];
            tagPool = [...tagPool, ...tables.tagPool];
            activityTags = [...activityTags, ...tables.activityTags];
        }

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arrowProfiles);
        const nds: XLSX.WorkSheet = XLSX.utils.json_to_sheet(nodes);
        const arrows: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arrowChartInfos);
        const proj: XLSX.WorkSheet = XLSX.utils.json_to_sheet(projProfiles);
        const subProjWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(subProjects);

        let phasesWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(phases);
        let rolesWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(roles);
        let resourcesWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(resources);
        let activityResourcesWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(activityResources);
        let activityPhasesWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(activityPhases);
        let resourceRolesWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(resourceRoles);
        let tagPoolWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tagPool);
        let activityTagsWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(activityTags);

        // generate workbook and add the worksheet
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, CONST.ACTIVITIES_WS_NAME);

        XLSX.utils.book_append_sheet(wb, arrows, CONST.ARROW_WS_NAME);
        XLSX.utils.book_append_sheet(wb, nds, CONST.INTEGRATION_WS_NAME);
        XLSX.utils.book_append_sheet(wb, proj, CONST.PROFILE_WS_NAME);
        XLSX.utils.book_append_sheet(wb, subProjWs, CONST.SUB_PROJECT_WS_NAME);

        XLSX.utils.book_append_sheet(wb, phasesWs, CONST.PHASES_WS_NAME);
        XLSX.utils.book_append_sheet(wb, rolesWs, CONST.ROLES_WS_NAME);
        XLSX.utils.book_append_sheet(wb, resourcesWs, CONST.RESOURCES_WS_NAME);
        XLSX.utils.book_append_sheet(wb, activityResourcesWs, CONST.ACTIVITY_RESOURCES_WS_NAME);
        XLSX.utils.book_append_sheet(wb, activityPhasesWs, CONST.ACTIVITY_PHASES_WS_NAME);
        XLSX.utils.book_append_sheet(wb, resourceRolesWs, CONST.RESOURCE_ROLES_WS_NAME);
        XLSX.utils.book_append_sheet(wb, tagPoolWs, CONST.TAB_POOL_WS_NAME);
        XLSX.utils.book_append_sheet(wb, activityTagsWs, CONST.ACTIVITY_TAG_WS_NAME);

        const name = 'critical-pass-project';
        XLSX.writeFile(wb, name + '.xlsx');
    }

    public import(file: File): Promise<TreeNode[]> {
        return new Promise<TreeNode[]>((resolve, reject) => {
            const reader: FileReader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = (e: any) => {
                const binarystr: string = e.target.result;
                const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary', cellDates: true });

                const activityData = this.getWorksheetData(wb, CONST.ACTIVITIES_WS_NAME);
                const arrowData = this.getWorksheetData(wb, CONST.ARROW_WS_NAME);
                const integrationData = this.getWorksheetData(wb, CONST.INTEGRATION_WS_NAME);
                const profileData = this.getWorksheetData(wb, CONST.PROFILE_WS_NAME);
                const subProjectData = this.getWorksheetData(wb, CONST.SUB_PROJECT_WS_NAME);

                const phaseData = this.getWorksheetData(wb, CONST.PHASES_WS_NAME);
                const rolesData = this.getWorksheetData(wb, CONST.ROLES_WS_NAME);
                const resourcesData = this.getWorksheetData(wb, CONST.RESOURCES_WS_NAME);
                const activityResourceData = this.getWorksheetData(wb, CONST.ACTIVITY_RESOURCES_WS_NAME);
                const activityPhaseData = this.getWorksheetData(wb, CONST.ACTIVITY_PHASES_WS_NAME);
                const resourceRoleData = this.getWorksheetData(wb, CONST.RESOURCE_ROLES_WS_NAME);

                const tagPoolData = this.getWorksheetData(wb, CONST.TAB_POOL_WS_NAME);
                const activityTagData = this.getWorksheetData(wb, CONST.ACTIVITY_TAG_WS_NAME);

                const workbook: HistoryWorkbook = {
                    phaseData,
                    rolesData,
                    resourcesData,
                    activityResourceData,
                    activityPhaseData,
                    resourceRoleData,
                    activityData,
                    arrowData,
                    integrationData,
                    tagPoolData,
                    activityTagData,
                    subProjectData
                };

                const nodes = profileData.map(profileEntry => this.mapper.getNode(profileEntry, workbook));
                resolve(nodes);
            };
        });
    }
    public getWorksheetData(wb: XLSX.WorkBook, sheetName: string) {
        const ws = wb.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(ws);
    }
}
