import { Injectable } from '@angular/core';
import { Integration } from '@critical-pass/project/models';
import { Serializer } from '../../serializer';

@Injectable({
    providedIn: 'root',
})
export class IntegrationSerializerService implements Serializer<Integration> {
    fromJson(json: any = null): Integration {
        json = json ?? {};
        const obj: Integration = {
            id: json.id ?? null,
            x: json.x ?? null,
            y: json.y ?? null,
            name: json.name ?? '',
            isDummy: json.isDummy ?? false,
            isMilestone: json.isMilestone ?? false,
            milestoneNumber: json.milestoneNumber ?? 0,
            milestoneActivity: null,
            milestoneActivityId: json.milestoneActivityId ?? null,
            milestoneName: json.milestoneName ?? '',
            type: json.type ?? '',
            risk: json.risk ?? 0,
            selected: false,
            isBeginning: json.isBeginning ?? false,
            isEnd: json.isEnd ?? false,
            eft: json.eft ?? json.EFT ?? null, // delete this
            lft: json.lft ?? json.LFT ?? null, // delete this
            maxPCD: json.maxPCD ?? null,
            completed: json.completed ?? null,
            label: json.label ?? '',
        };
        return obj;
    }
    new(id: number, name: string, risk: number, x: number, y: number): Integration {
        const int = this.fromJson();
        int.id = id;
        int.name = name;
        int.x = x;
        int.y = y;
        int.risk = risk ?? 0;
        return int;
    }
    toJson(obj: Integration): any {}
}
