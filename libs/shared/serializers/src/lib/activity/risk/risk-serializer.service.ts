import { Injectable } from '@angular/core';
import { ActivityRisk } from '@critical-pass/project/models';
import { Serializer } from '../../serializer';

@Injectable({
    providedIn: 'root',
})
export class RiskSerializerService implements Serializer<ActivityRisk> {
    fromJson(json: any): ActivityRisk {
        json = json || {};
        const obj: ActivityRisk = {
            criticalWeight: json.criticalWeight ?? 4,
            redWeight: json.redWeight ?? 3,
            yellowWeight: json.yellowWeight ?? 2,
            greenWeight: json.greenWeight ?? 1,
            criticalCount: json.criticalCount ?? 0,
            redCount: json.redCount ?? 0,
            yellowCount: json.yellowCount ?? 0,
            greenCount: json.greenCount ?? 0,
            maxFloat: json.maxFloat ?? 0,
            sumFloat: json.sumFloat ?? 0,
        };
        return obj;
    }
    toJson(obj: ActivityRisk): any {}
}
