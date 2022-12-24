import { ColorView } from '../resource/resource';

export interface Role {
    view: RoleView;
    name: string;
    id: number;
}
export interface RoleView {
    color: ColorView;
    isSelected: boolean;
    isEditting: boolean;
}

export interface RoleSummary {
    name: string;
    color: ColorView;
    id: number;
}
