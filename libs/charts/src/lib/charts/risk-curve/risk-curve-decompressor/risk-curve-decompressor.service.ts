import { Injectable } from '@angular/core';
import { Project } from '@critical-pass/project/models';
import { StatsCalculatorService } from '@critical-pass/project/processor';
import { RiskOption } from '../../../models/risk-option';
// import { RiskOption } from '../../../models/charts/risk-curve';
// import { Project } from '../../../models/project/project';
// import * as Keys from '../../../constants/keys';
// import { StatsCalculatorService } from '../../../services/utils/stats-calculator/stats-calculator.service';
@Injectable({
  providedIn: 'root'
})
export class RiskCurveDecompressorService {

  constructor(private calc: StatsCalculatorService) { }

  public getRiskOptions(project: Project): RiskOption[] {
    let week = 0;
    const riskData = [];
    while (week < Keys.weeks) {
        const float = week * Keys.floatIncrements - project.profile.risk.decompressAmount;
        const point = this.calc.getRiskStats(float, project);
        if (!isNaN(point.activity)) {
            riskData.push(point);
        }
        week++;
    }
    return riskData;
}

}


