// import { Injectable } from '@angular/core';
// import { Project } from '@critical-pass/project/models';

// @Injectable({
//     providedIn: 'root',
// })
// export class ParentRiskRefreshService {
//     constructor() {}
//     public updateParentRisk(project: Project) {
//         this.updateActivityParentRisk(project);
//     }

//     private updateActivityParentRisk(proj: Project) {
//         if (proj.profile.parentProject != null) {
//             const actId = proj.profile.subProject.activityParentId;
//             const activity = proj.profile.parentProject.activities.find(a => a.profile.id === actId);
//             if (!activity) {
//                 return;
//             }
//             activity.profile.duration = this.calculatedProjectDuration(proj);
//         }
//         return;
//     }
//     private calculatedProjectDuration(project: Project) {
//         if (project.profile.end != null) {
//             // project needs to be updated before the lft reflects accurately
//             const endId = project.profile.end;
//             const endnode = project.integrations.find(n => n.id === endId);
//             return endnode?.lft;
//         }
//         return 0;
//     }
// }
