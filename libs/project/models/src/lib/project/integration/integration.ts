import { Activity } from '../activity/activity';

export interface Integration {
    id: number;
    x?: number;
    y?: number;
    label: string;
    name: string;
    isDummy: boolean;
    isMilestone: boolean;
    milestoneActivityId: number;
    milestoneActivity: Activity;
    milestoneNumber: number;
    milestoneName: string;
    type: string;
    risk: number;
    selected: boolean;
    isBeginning: boolean;
    isEnd: boolean;
    eft: number;
    lft: number;
    maxPCD: string;
    completed: boolean;
}
