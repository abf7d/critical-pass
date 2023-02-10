import { Injectable } from '@angular/core';
import { Phase } from '@critical-pass/project/types';
import { ColorFactoryService, PhaseSerializerService, PhaseSummarySerializerService } from '@critical-pass/shared/serializers';
// import { Phase } from '@critical-pass/critical-charts';
// import { PhaseSerializerService, PhaseSummarySerializerService } from '@critical-pass/critical-charts';
// import { ColorFactoryService } from '../color-factory/color-factory.service';
// import * as Keys from '../../../../../../core/constants/keys'
import * as CONST from '../../constants';
@Injectable({
    providedIn: 'root',
})
export class PhaseFactoryService {
    constructor(
        private colorFactory: ColorFactoryService,
        private phaseSerializer: PhaseSerializerService,
        private phaseSummarySerializer: PhaseSummarySerializerService,
    ) {}

    addPhase(name: string, phaseList: Phase[]) {
        const phase = this.phaseSerializer.fromJson();
        phase.name = name;
        const colorIndex = phaseList.length;
        const newColor = this.colorFactory.getColor(CONST.PHASE_COLOR_SCHEME, colorIndex);
        phase.view.color = newColor;
        phaseList.push(phase);
    }
    getSummary(phase: Phase) {
        const summary = this.phaseSummarySerializer.fromJson();
        summary.color = phase.view.color;
        summary.id = phase.id;
        summary.name = phase.name;
        summary.shortName = phase.shortName;
        return summary;
    }
}
