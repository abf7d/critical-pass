import { Injectable } from '@angular/core';
import { Integration } from '../../../models/project/integration/integration';
import { Project } from '../../../models/project/project';
import { addBusinessDays, lightFormat } from 'date-fns';
import * as Keys from '../../../constants/keys';

@Injectable({
    providedIn: 'root',
})
export class DateUtilsService {
    constructor() {}

    public setMaxPCDs(project: Project) {
        for (const node of project.integrations) {
            const greatestPCD = this.getPCDofNode(node, project);
            node.maxPCD = greatestPCD;
        }
    }

    public getPCDofNode(node: Integration, project: Project) {
        const inArrows = project.activities.filter(a => a.chartInfo.target_id === node.id);
        const dates = [];
        let greatestPCD = '';
        greatestPCD = '';
        for (const arrow of inArrows) {
            if (arrow.chartInfo.isDummy) {
                const pcdOfDummy = this.getPCDofNode(arrow.chartInfo.source, project);
                dates.push(pcdOfDummy);
            } else if (arrow.profile.planned_completion_date != null && arrow.profile.planned_completion_date !== '') {
                dates.push(arrow.profile.planned_completion_date);
            }
        }
        if (dates.length > 0) {
            dates.sort((a, b) => +new Date(b.date) - +new Date(a.date));
            greatestPCD = dates[dates.length - 1];
        }
        return greatestPCD;
    }

    public calculateEarliestFinishDate(project: Project) {
        const sortedIntegrations = project.integrations.sort((a, b) => a.eft - b.eft);
        const first = sortedIntegrations[0];
        const last = project.integrations[sortedIntegrations.length - 1];
        const firstAcivity = project.activities.find(l => l.chartInfo.source_id === first.id);
        if (firstAcivity != null) {
            // calculate the start date of first activity and add it to the last.eft. (Set to null if there is no valid answer, the hide value in interface if null)
            if (firstAcivity.profile.planned_completion_date === '' || firstAcivity.profile.planned_completion_date === null) {
                project.profile.staffing.earliestFinishDate = '';
                return;
            }
            if (last.eft > 0) {
                const eft = last.eft - firstAcivity.profile.duration;
                const pcd = firstAcivity.profile.planned_completion_date;
                if (pcd) {
                    const pcdDt = new Date(pcd);
                    project.profile.staffing.earliestFinishDate = lightFormat(addBusinessDays(pcdDt, eft), Keys.mainDateFormat);
                }
                return;
            }
        }
    }
}
