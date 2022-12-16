import { ResourceSummary } from '../resource/resource';
import { Phase, PhaseSummary } from '../phase/phase';

export interface AssignResources {
    isSelected: boolean;
    isStartBranch: boolean;
    noDependencies: boolean;
    noGoto: boolean;
    resources: ResourceSummary[];
    phases: PhaseSummary[];
}
