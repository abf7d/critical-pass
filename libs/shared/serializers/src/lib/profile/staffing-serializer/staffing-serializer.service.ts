import { Injectable } from '@angular/core';
import { StaffingInfo } from '@critical-pass/project/models';
import { Serializer } from '../../serializer';

@Injectable({
    providedIn: 'root',
})
export class StaffingSerializerService implements Serializer<StaffingInfo> {
    public fromJson(json: any): StaffingInfo {
        json = json || {};
        const obj: StaffingInfo = {
            costInMM: json.costInMM ?? 0,
            effortInMM: json.effortInMM ?? 0,
            durationInMonths: json.durationInMonths ?? 0,
            effeciencyFactor9to1: json.effeciencyFactor9to1 ?? 0,
            averageStaffing: json.averageStaffing ?? 0,
            directCost: json.directCost ?? 0,
            indirectCost: json.indirectCost ?? 0,
            earliestFinishDate: json.earliestFinishDate ?? json.EarliestFinishDate ?? '', // delete this
            lft: json.lft ?? json.LFT ?? '', // delete this
        };
        return obj;
    }
    toJson(obj: StaffingInfo): any {}
}
