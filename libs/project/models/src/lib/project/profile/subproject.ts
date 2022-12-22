import { Project } from '../project';

export interface SubProject {
    clearSelectedArrow: boolean;
    activityParentName: string;
    activityParentId: any;
    parentProject: Project;
    riskDepthCalc: string; // 'top-level';
}
