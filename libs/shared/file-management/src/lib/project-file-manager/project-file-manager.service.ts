import { Injectable } from '@angular/core';
import { Project } from '../../../../models/project/project';
import { FileManagerBaseService } from '../../../../models/base';
import * as XLSX from 'xlsx';
import * as Keys from '../../../../constants/keys';
import { ProjectMapperService } from './project-mapper/project-mapper.service';

@Injectable({
    providedIn: 'root',
})
export class ProjectFileManagerService implements FileManagerBaseService<Project> {
    constructor(private mapper: ProjectMapperService) {}
    public export(project: Project) {
        const profiles = project.activities.map(x => {
            return { ...x.profile, graphId: project.profile.id };
        });
        const charttInfos = project.activities.map(a => {
            return { ...a.chartInfo, id: a.profile.id, graphId: project.profile.id };
        });
        const nodes = project.integrations;
        const name = project.profile.name || 'critical-pass-project';

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(profiles);
        const nds: XLSX.WorkSheet = XLSX.utils.json_to_sheet(nodes);
        const arrows: XLSX.WorkSheet = XLSX.utils.json_to_sheet(charttInfos);
        const proj: XLSX.WorkSheet = XLSX.utils.json_to_sheet([project.profile]);

        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, Keys.activitiesWsName);
        XLSX.utils.book_append_sheet(wb, arrows, Keys.arrowWsName);
        XLSX.utils.book_append_sheet(wb, nds, Keys.integrationWsName);
        XLSX.utils.book_append_sheet(wb, proj, Keys.profileWsName);
        XLSX.writeFile(wb, name + '.xlsx');
    }
    public import(file: File): Promise<Project> {
        return new Promise<Project>((resolve, reject) => {
            const reader: FileReader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = (e: any) => {
                const binarystr: string = e.target.result;
                const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary', cellDates: true });

                const activityData = this.getWorksheetData(wb, Keys.activitiesWsName);
                const arrowData = this.getWorksheetData(wb, Keys.arrowWsName); // to get 2d array pass 2nd parameter as object {header: 1}
                const integrationData = this.getWorksheetData(wb, Keys.integrationWsName);
                const profileData = this.getWorksheetData(wb, Keys.profileWsName);

                const projActivities = this.mapper.createActivities(activityData, arrowData);
                const integrations = this.mapper.createIntegrations(integrationData);
                const project = this.mapper.getCritPathProject(profileData);

                project.activities = projActivities;
                project.integrations = integrations;

                resolve(project);
            };
        });
    }

    public getWorksheetData(wb, sheetName) {
      const ws = wb.Sheets[sheetName];
      return XLSX.utils.sheet_to_json(ws);
  }
}
