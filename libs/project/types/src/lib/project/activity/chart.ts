import { Integration } from '../integration/integration';

export interface Chart {
    source_id: number;
    target_id: number;
    source?: Integration;
    target?: Integration;
    tf: number;
    ff: number;
    risk: number;
    isDummy: boolean;
    milestoneNodeId?: number;
    isSelected: boolean;
}
