import { Injectable } from '@angular/core';
import { Project } from '@critical-pass/project/models';
import { DateUtilsService, RiskCompilerService } from '@critical-pass/project/processor';
// import { ParentRiskRefreshService } from '../parent-risk-refresh/parent-risk-refresh.service';

@Injectable({
    providedIn: 'root',
})
export class ParentCompilerService {
    constructor(private dateUtils: DateUtilsService, private riskCompiler: RiskCompilerService /*, private parentRiskRefresh: ParentRiskRefreshService*/) {}

    public compile(project: Project): void {
        if (project.profile.parentProject !== null) {
            this.riskCompiler.compileRiskProperties(project);
            this.dateUtils.calculateEarliestFinishDate(project);
            this.updateParentRisk(project);
            this.riskCompiler.compileRiskProperties(project.profile.parentProject);
            this.dateUtils.calculateEarliestFinishDate(project.profile.parentProject);
        } else {
            console.error('No parent project found for project: ' + project.profile.id);
        }
    }

    public updateParentRisk(project: Project) {
        this.updateActivityParentRisk(project);
    }

    private updateActivityParentRisk(proj: Project) {
        if (proj.profile.parentProject != null) {
            const actId = proj.profile.subProject.activityParentId;
            const activity = proj.profile.parentProject.activities.find(a => a.profile.id === actId);
            if (!activity) {
                return;
            }
            activity.profile.duration = this.calculatedProjectDuration(proj);
        }
        return;
    }
    private calculatedProjectDuration(project: Project) {
        if (project.profile.end != null) {
            // project needs to be updated before the lft reflects accurately
            const endId = project.profile.end;
            const endnode = project.integrations.find(n => n.id === endId);
            return endnode?.lft;
        }
        return 0;
    }
}
