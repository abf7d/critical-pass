import { Injectable } from '@angular/core';
import { Resource, ResourceAssign, ResourceView, ResourceProfile, ResourceSummary, ColorView } from '@critical-pass/project/types';
import { RoleSummarySerializerService } from '../../role/role-serializer.service';
import { PhaseSummarySerializerService } from '../../phase/phase-serializer/phase-serializer.service';
import { Serializer } from '../../serializer';
import { ColorViewSerializerService } from '../../color/color-serilizer.service';

@Injectable({
    providedIn: 'root',
})
export class ResourceSerializerService implements Serializer<Resource> {
    public fromJson(json?: any): Resource {
        json = json ?? {};
        const obj: Resource = {
            id: json?.id ?? json?.uniqueId ?? 0, //delete this,
            skills: json?.skills ?? [],
            profile: new ResourceProfileSerializerService().fromJson(json?.profile),
            view: new ResourceViewSerializerService().fromJson(json?.view),
            schedule: json?.schedule ?? [],
            assign: new ResourceAssignSerializerService().fromJson(json?.assign),
        };
        return obj;
    }
    toJson(obj: any) {}
}
@Injectable({
    providedIn: 'root',
})
export class ResourceAssignSerializerService implements Serializer<ResourceAssign> {
    public fromJson(json?: ResourceAssign): ResourceAssign {
        const obj: ResourceAssign = {
            roles: json?.roles ? json.roles.map(r => new RoleSummarySerializerService().fromJson(r)) : [],
            phases: json?.phases ? json.phases.map(p => new PhaseSummarySerializerService().fromJson(p)) : [],
            isSelected: false,
        };
        return obj;
    }
    toJson(obj: any) {}
}
@Injectable({
    providedIn: 'root',
})
export class ResourceViewSerializerService implements Serializer<ResourceView> {
    public fromJson(json: any): ResourceView {
        json = json ?? {};
        const obj: ResourceView = {
            color: new ColorViewSerializerService().fromJson(json?.color),
            isSelected: json.isSelected ?? false,
            isEditting: json.isEditting ?? false,
        };
        return obj;
    }
    toJson(obj: any) {}
}
@Injectable({
    providedIn: 'root',
})
export class ResourceProfileSerializerService implements Serializer<ResourceProfile> {
    public fromJson(json?: any): ResourceProfile {
        json = json ?? {};
        const obj: ResourceProfile = {
            name: json?.name ?? '',
            firstname: json?.firstname ?? '',
            lastname: json?.lastname ?? '',
            initials: json?.initials ?? '',
            skillMultiplier: json?.skillMultiplier ?? 1,
            dataOrigin: json?.dataOrigin ?? '',
            role: json?.role ?? '',
            profeciencyRank: json?.profeciencyRank ?? 1,
            salaryPerYear: json?.salaryPerYear ?? 0,
            hourlyWage: json?.hourlyWage ?? 0,
            paymentFrame: json?.paymentFrame ?? 'yearly',
            chargeInbetweenTasks: json?.chargeInbetweenTasks ?? true,
            teamName: json?.teamName ?? '',
            organization: json?.organization,
        };
        return obj;
    }
    toJson(obj: ResourceProfile): any {}
}

@Injectable({
    providedIn: 'root',
})
export class ResourceSummarySerializerService implements Serializer<ResourceSummary> {
    public fromJson(json?: any): ResourceSummary {
        json = json ?? {};
        const obj: ResourceSummary = {
            name: json?.name ?? '',
            initials: json?.initials ?? '',
            color: new ColorViewSerializerService().fromJson(json.color),
            role: json?.role ?? '',
            id: json?.id ?? 1,
        };
        return obj;
    }
    toJson(obj: ResourceSummary): any {}
}
