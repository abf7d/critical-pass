import { ProjectProfile } from './profile/project-profile';
import { Activity } from './activity/activity';
import { Integration } from './integration/integration';
import { Resource } from './resource/resource';
import { Phase } from './phase/phase';
import { Role } from './role/role';
import { TagGroup } from './tag/tag-group';
import { TagGroupOption } from './tag/tag-group-option';

export interface Project {
    profile: ProjectProfile;
    activities: Activity[];
    integrations: Integration[];
    resources: Resource[];
    phases: Phase[];
    roles: Role[];
    tags?: TagGroupOption[];
}
