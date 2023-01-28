import { Phase, PhaseSummary } from '../phase/phase';
import { RoleSummary } from '../role/role';

export interface Resource {
    skills: any[];
    profile: ResourceProfile;
    schedule: any[];
    id: number;
    view: ResourceView;
    assign: ResourceAssign;
}
export interface ResourceAssign {
    isSelected: boolean;
    roles: RoleSummary[];
    phases: PhaseSummary[];
}
export interface ResourceView {
    color: ColorView;
    isSelected: boolean;
    isEditting: boolean;
}
export interface ResourceSummary {
    name: string;
    initials: string;
    color: ColorView;
    role: string;
    id: string;
}

export interface ColorView {
    color: string;
    backgroundcolor: string;
}
export interface ResourceProfile {
    name: string;
    firstname: string;
    lastname: string;
    initials: string;
    skillMultiplier: number; // Maybe we should have a multiplier for each skill
    dataOrigin: string;
    organization: string;
    role: string;
    profeciencyRank: number;
    salaryPerYear: number; // In dollars
    hourlyWage: number; // In dollars
    chargeInbetweenTasks: boolean;
    paymentFrame: string;
    teamName: string;
}
