import { ColorView } from '../resource/resource';

export interface Phase {
    name: string;
    order: number;
    shortName: string;
    view: PhaseView;
    id: '';
}

export interface PhaseView {
    color: ColorView;
    isSelected: boolean;
}

export interface PhaseSummary {
    name: string;
    shortName: string;
    color: ColorView;
    id: string;
}
