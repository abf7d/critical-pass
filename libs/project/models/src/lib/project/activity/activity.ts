import { Chart } from './chart';
import { Processed } from './processed';
import { ActivitySubProject } from './subproject';
import { Risk } from './risk';
import { Errors } from './errors';
import { FeaturesProfile } from './profile';
import { AssignResources } from './assign-resources';
import { TagGroup } from '../tag/tag-group';

export interface Activity {
    processInfo: Processed;
    chartInfo: Chart;
    subProject: ActivitySubProject;
    risk: Risk;
    errors: Errors;
    assign: AssignResources;
    profile: FeaturesProfile;
    tags?: TagGroup[];
}
