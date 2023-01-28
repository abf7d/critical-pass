import { Chart } from './chart';
import { Processed } from './processed';
import { ActivitySubProject } from './subproject';
import { ActivityRisk } from './activity-risk';
import { Errors } from './errors';
import { ActivityProfile } from './activity-profile';
import { AssignResources } from './assign-resources';
import { TagGroup } from '../tag/tag-group';

export interface Activity {
    processInfo: Processed;
    chartInfo: Chart;
    subProject: ActivitySubProject;
    risk: ActivityRisk;
    errors: Errors;
    assign: AssignResources;
    profile: ActivityProfile;
    tags?: TagGroup[];
}
