import { Injectable } from '@angular/core';
import { Phase, PhaseSummary, PhaseView } from '@critical-pass/project/models';
import { ColorViewSerializerService } from '../../color/color-serilizer.service';
import { Serializer } from '../../serializer';

@Injectable({
    providedIn: 'root',
})
export class PhaseSerializerService implements Serializer<Phase> {
    fromJson(json?: any): Phase {
        json = json ?? {};
        const obj: Phase = {
            name: json?.name ?? '',
            order: json?.order ?? 999,
            shortName: json?.shortName ?? '',
            id: json?.id ?? json?.uniqueId ?? null, //delete this
            view: new PhaseViewService().fromJson(json.view),
        };
        return obj;
    }
    toJson(obj: Phase): any {}
}
@Injectable({
    providedIn: 'root',
})
export class PhaseViewService implements Serializer<PhaseView> {
    fromJson(json: any): PhaseView {
        json = json ?? {};
        const obj: PhaseView = {
            color: new ColorViewSerializerService().fromJson(json?.color),
            isSelected: false,
        };
        return obj;
    }
    toJson(obj: PhaseView): any {}
}
@Injectable({
    providedIn: 'root',
})
export class PhaseSummarySerializerService implements Serializer<PhaseSummary> {
    fromJson(json?: any): PhaseSummary {
        json = json ?? {};
        const obj: PhaseSummary = {
            color: new ColorViewSerializerService().fromJson(json?.color),
            name: json?.name ?? '',
            shortName: json?.shortName ?? '',
            id: json?.id ?? null,
        };
        return obj;
    }
    toJson(obj: PhaseSummary): any {}
}
