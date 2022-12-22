import { Injectable } from '@angular/core';
import { Chart } from '@critical-pass/project/models';
import { Serializer } from '../../serializer';

@Injectable({
    providedIn: 'root',
})
export class ChartSerializerService implements Serializer<Chart> {
    fromJson(json?: any): Chart {
        json = json || {};
        const obj: Chart = {
            source_id: json.source_id ?? null,
            target_id: json.target_id ?? null,
            source: undefined,
            target: undefined,
            tf: json.tf ?? json.TF ?? null, // delete this
            ff: json.ff ?? json.FF ?? null, // delete this
            risk: json.risk ?? 0,
            isDummy: json.isDummy ?? false,
            isSelected: json.isSelected ?? false,
            milestoneNodeId: json.milestoneNodeId ?? null,
        };
        return obj;
    }
    toJson(obj: Chart): any {}
}
