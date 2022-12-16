import { Project } from '../project';

export interface SubProject {
    clearSelectedArrow: boolean;
    // arrowParent: null;
    // parentGraph: null;
    // arrowParentName: string;
    activityParentName: string;
    activityParentId: any;
    parentProject: Project;
    riskDepthCalc: string; // 'top-level';

    // constructor() {
    //   this.clearSelectedArrow = false;
    //   this.activityParentId = null;
    //   // this.parentProject = null;
    //   this.riskDepthCalc = 'top-level';
    //   this.activityParentName = '';
    // }
    // loadGraphJson(json) {
    //   if (json == null) {
    //     return;
    //   }
    //   if (json.clearSelectedArrow != null) { this.clearSelectedArrow = json.clearSelectedArrow; }
    //   if (json.arrowParent != null) { this.activityParentId = json.arrowParent; }
    //   // if (json.parentGraph != null) { this.parentProject = json.parentGraph; }
    //   if (json.riskDepthCalc != null) { this.riskDepthCalc = json.riskDepthCalc; }  // 'top-level';
    //   if (json.arrowParentName != null) { this.activityParentName = json.arrowParentName; }
    // }
    // loadCopyJson(json) {
    //   if (json == null) {
    //     return;
    //   }
    //   if (json.clearSelectedArrow != null) { this.clearSelectedArrow = json.clearSelectedArrow; }
    //   if (json.arrowParent != null) { this.activityParentId = json.activityParentId; }
    //   // if (json.parentGraph != null) { this.parentProject = json.parentGraph; }
    //   if (json.riskDepthCalc != null) { this.riskDepthCalc = json.riskDepthCalc; }  // 'top-level';
    //   if (json.arrowParentName != null) { this.activityParentName = json.activityParentName; }
    // }
}
