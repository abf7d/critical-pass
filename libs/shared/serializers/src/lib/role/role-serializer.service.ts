import { Injectable } from '@angular/core';
import { Role, RoleView, RoleSummary } from '../../../../models/project/role/role';
import { Serializer } from '../../serializer';

@Injectable({
    providedIn: 'root',
})
export class RoleSerializerService implements Serializer<Role> {
    fromJson(json?: any): Role {
        json = json ?? {};
        const obj: Role = {
            name: json?.name,
            id: json?.id ?? json?.uniqueId, //delete this,
            view: new RoleViewSerializerService().fromJson(json?.view),
        };
        return obj;
    }
    toJson(obj: Role): any {}
}
@Injectable({
    providedIn: 'root',
})
export class RoleViewSerializerService implements Serializer<RoleView> {
    fromJson(json: any): RoleView {
        json = json ?? {};
        const obj: RoleView = {
            color: json.color ?? '',
            isSelected: false,
            isEditting: false,
        };
        return obj;
    }
    toJson(obj: RoleView): any {}
}
@Injectable({
    providedIn: 'root',
})
export class RoleSummarySerializerService implements Serializer<RoleSummary> {
    fromJson(json?: any): RoleSummary {
        json = json ?? {};
        const obj: RoleSummary = {
            color: json?.color ?? '',
            name: json?.name ?? '',
            id: json?.id ?? null,
        };
        return obj;
    }
    toJson(obj: RoleSummary): any {}
}
