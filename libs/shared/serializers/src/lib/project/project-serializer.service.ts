import { Injectable } from '@angular/core';
import { Project } from '../../../models/project/project';
import { ActivitySerializerService } from './activity/activity-serializer.service';
import { IntegrationSerializerService } from './integration/integration-serializer/integration-serializer.service';
import { PhaseSerializerService } from './phase/phase-serializer/phase-serializer.service';
import { ResourceSerializerService } from './resource/resource-serializer/resource-serializer.service';
import { RoleSerializerService } from './role/role-serializer.service';
import { Serializer } from '../serializer';
import { Profile } from '../../../models/project/profile/profile';
import { ProjectViewSerializerService } from './profile/project-view-serializer/project-view-serializer.service';
import { ProjectRiskSerializerService } from './profile/project-risk-serializer/project-risk-serializer.service';
import { StaffingSerializerService } from './profile/staffing-serializer/staffing-serializer.service';
import { ProjectSubprojectSerializerService } from './profile/project-subproject-serializer/project-subproject-serializer.service';
import { PermissionsSerializerService } from './profile/permissions-serializer/permissions-serializer.service';

@Injectable({
    providedIn: 'root',
})
export class ProjectSerializerService implements Serializer<Project> {
    fromJson(json?: any): Project {
        const actSerializer = new ActivitySerializerService();
        const intSerializer = new IntegrationSerializerService();
        const phaseSerializer = new PhaseSerializerService();
        const resSerializer = new ResourceSerializerService();
        const roleSerializer = new RoleSerializerService();
        const obj: Project = {
            profile: new ProjectProfileSerializerService().fromJson(json?.profile),
            activities: json?.activities ? json.activities.map(a => actSerializer.fromJson(a)) : [],
            integrations: json?.integrations ? json.integrations.map(i => intSerializer.fromJson(i)) : [],
            phases: json?.phases ? json.phases.map(p => phaseSerializer.fromJson(p)) : [],
            resources: json?.resources ? json.resources.map(r => resSerializer.fromJson(r)) : [],
            roles: json?.roles ? json.roles.map(r => roleSerializer.fromJson(r)) : [],
        };
        return obj;
    }
    toJson(obj: Project): any {}
}

@Injectable({
    providedIn: 'root',
})
export class ProjectProfileSerializerService implements Serializer<Profile> {
    fromJson(json?: any): Profile {
        json = json ?? {};
        const obj: Profile = {
            name: json?.name ?? '',
            id: json?.id ?? null,
            description: json?.description ?? '',
            start: json?.start ?? null,
            end: json?.end ?? null,
            startDate: json?.startDate ?? '',
            endDate: json?.endDate ?? '',
            libraryView: json?.libraryView ?? false,
            numStDev: json?.numStDev || 1,
            redLimit: json?.redLimit || 9,
            yellowLimit: json?.yellowLimit || 25,
            lft: json?.lft ?? json?.LFT ?? null,
            loopDetected: json?.loopDetected ?? false,
            timestamp: json?.timestamp,
            view: new ProjectViewSerializerService().fromJson(json.view),
            staffing: new StaffingSerializerService().fromJson(json.staffing),
            risk: new ProjectRiskSerializerService().fromJson(json.risk),
            subProject: new ProjectSubprojectSerializerService().fromJson(json.subProject),
            permissions: new PermissionsSerializerService().fromJson(json.permissions),
            parentProject: json.parentProject ? new ProjectSerializerService().fromJson(json.parentProject) : null,
        };
        return obj;
    }
    toJson(obj: Profile): any {}
}
