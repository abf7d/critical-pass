import { Activity } from '../activity/activity';
import { Integration } from '../integration/integration';
import { TagGroup } from '../tag';

export interface View {
    displayText: string;
    showDummies: boolean;
    showEftLft: string;
    showFloat: boolean;
    createAsDummy: boolean; // When drawing arrows this sets if they are created as dummies
    drawActivityCurves: boolean;
    markCompleted: boolean; // For toggling the activities with Finish dates dim
    selectedActivity: Activity | null; // Allow changing selected activity on arrow diagram view
    selectedIntegration: Integration | null;
    lassoOn: boolean;
    lassoedLinks: number[];
    lassoedNodes: number[];
    isSubProjSelected: boolean;
    lassoStart?: number | null;
    lassoEnd?: number | null;
    selectedTagGroup?: string;
    showActions: boolean; // For toggling right hand corner between seleted arrow stats and other actions
    showOrphaned: boolean; // For showing nodes that have no in arrows or out arrows. Start or end nodes.
    showStepChart: boolean;
    lowerArrowText: string;
    showOverrun: boolean;
    useStartDates: boolean;
    autoZoom: boolean;
    toggleZoom: boolean;
    activeSubProjectId?: number; // FeaturesNetwork analysis highlight active
}
