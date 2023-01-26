import { Injectable } from '@angular/core';
import { Project } from '@critical-pass/project/models';
import { StatsCalculatorService } from '@critical-pass/project/processor';
import { RiskOption } from '../../../models/risk-option';
import * as CONST from '../../../constants/constants';
@Injectable({
    providedIn: 'root',
})
export class RiskCurveDecompressorService {
    constructor(private calc: StatsCalculatorService) {}

    public getRiskOptions(project: Project): RiskOption[] {
        let week = 0;
        const riskData = [];
        while (week < CONST.RISK_WEEKS) {
            const float = week * CONST.FLOAT_INCREMENTS - project.profile.risk.decompressAmount;
            const point = this.calc.getRiskStats(float, project);
            if (!isNaN(point.activity)) {
                riskData.push(point);
            }
            week++;
        }
        return riskData;
    }
}
