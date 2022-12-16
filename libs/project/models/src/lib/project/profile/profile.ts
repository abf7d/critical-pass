import { View } from './view';
import { StaffingInfo } from './staffinginfo';
import { Risk } from './risk';
import { SubProject } from './subproject';
import { Permissions } from './permissions';
import { Project } from '../project';

export interface FeaturesProfile {
    name: string;
    id: number;
    description: string;
    start: number;
    end: number;
    redLimit: number;
    yellowLimit: number;
    startDate: string;
    endDate: string;
    libraryView: boolean;
    numStDev: number;

    view: View;
    staffing: StaffingInfo;
    risk: Risk;
    subProject: SubProject;
    permissions: Permissions;
    parentProject: Project;
    parentProjectId?: number;
    loopDetected: boolean;
    lft: number;
    timestamp?: number;
}
