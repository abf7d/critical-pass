import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as Keys from '../../../../constants/keys';
import { HistoryMapperService } from './history-mapper/history-mapper.service';
import { TreeNode } from '../../../../models/assign/tree-node';
import { FileManagerBaseService } from '../../../../models/base/file-manager-base.service';
import { HistoryWorkbook } from '../../../../models/history/history-workbook';

@Injectable({
    providedIn: 'root',
})
export class HistoryFileManagerService implements FileManagerBaseService<TreeNode[]> {
    constructor(private mapper: HistoryMapperService) {}

    
    public export(history: TreeNode[]): void {
        let arrowProfiles = [];
        let arrowChartInfos = [];
        let nodes = [];
        let projProfiles = [];

        let phases = [];
        let roles = [];
        let resources = [];
        let activityResources = [];
        let activityPhases = [];
        let resourceRoles = [];
        for (const node of history) {
            const tables = this.mapper.getHistoryEntryWorkbook(node);
            arrowProfiles = [...arrowProfiles, ...tables.profiles];
            arrowChartInfos = [...arrowChartInfos, ...tables.chartInfos];
            nodes = [...nodes, ...tables.nodes];
            projProfiles = [...projProfiles, tables.projProfile];

            phases = [...phases, ...tables.phases];
            roles = [...roles, ...tables.roles];
            resources = [...resources, ...tables.resources];
            activityResources = [...activityResources, ...tables.activityResources];
            activityPhases = [...activityPhases, ...tables.activityPhases];
            resourceRoles = [...resourceRoles, ...tables.resourceRoles];
        }

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arrowProfiles);
        const nds: XLSX.WorkSheet = XLSX.utils.json_to_sheet(nodes);
        const arrows: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arrowChartInfos);
        const proj: XLSX.WorkSheet = XLSX.utils.json_to_sheet(projProfiles);

        let phasesWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(phases);
        let rolesWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(roles);
        let resourcesWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(resources);
        let activityResourcesWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(activityResources);
        let activityPhasesWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(activityPhases);
        let resourceRolesWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(resourceRoles);

        // generate workbook and add the worksheet
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, Keys.activitiesWsName);

        XLSX.utils.book_append_sheet(wb, arrows, Keys.arrowWsName);
        XLSX.utils.book_append_sheet(wb, nds, Keys.integrationWsName);
        XLSX.utils.book_append_sheet(wb, proj, Keys.profileWsName);

        XLSX.utils.book_append_sheet(wb, phasesWs, Keys.phasesWsName);
        XLSX.utils.book_append_sheet(wb, rolesWs, Keys.rolesWsName);
        XLSX.utils.book_append_sheet(wb, resourcesWs, Keys.resourcesWsName);
        XLSX.utils.book_append_sheet(wb, activityResourcesWs, Keys.activityResourcesWsName);
        XLSX.utils.book_append_sheet(wb, activityPhasesWs, Keys.activityPhasesWsName);
        XLSX.utils.book_append_sheet(wb, resourceRolesWs, Keys.resourceRolesWsName);
       
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

                const activityData = this.getWorksheetData(wb, Keys.activitiesWsName);
                const arrowData = this.getWorksheetData(wb, Keys.arrowWsName);
                const integrationData = this.getWorksheetData(wb, Keys.integrationWsName);
                const profileData = this.getWorksheetData(wb, Keys.profileWsName);

                const phaseData = this.getWorksheetData(wb, Keys.phasesWsName);
                const rolesData = this.getWorksheetData(wb, Keys.rolesWsName);
                const resourcesData = this.getWorksheetData(wb, Keys.resourcesWsName);
                const activityResourceData = this.getWorksheetData(wb, Keys.activityResourcesWsName);
                const activityPhaseData = this.getWorksheetData(wb, Keys.activityPhasesWsName);
                const resourceRoleData = this.getWorksheetData(wb, Keys.resourceRolesWsName);
               
                const tagPoolData = this.getWorksheetData(wb, Keys.tagPoolWsName);
                const activityTagData = this.getWorksheetData(wb, Keys.activityTagsWsName);
  
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
                    activityTagData
                };

                const nodes = profileData.map(profileEntry => this.mapper.getNode(profileEntry, workbook));
                resolve(nodes);
            };
        });
    }
    public getWorksheetData(wb, sheetName) {
        const ws = wb.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(ws);
    }
}


