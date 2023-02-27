import { View } from './view';
import { StaffingInfo } from './staffinginfo';
import { ProjectRisk } from './project-risk';
import { SubProject } from './subproject';
import { Permissions } from './permissions';
import { Project } from '../project';

export interface ProjectProfile {
    name: string;
    id: number;
    description: string;
    start: number | undefined;
    end: number | undefined;
    redLimit: number;
    yellowLimit: number;
    startDate: string;
    endDate: string;
    libraryView: boolean;
    numStDev: number;

    view: View;
    staffing: StaffingInfo;
    risk: ProjectRisk;
    subProject: SubProject;
    permissions: Permissions;
    parentProject: Project | null;
    parentProjectId?: number | null;
    loopDetected: boolean;
    lft: number;
    timestamp?: number;
}
