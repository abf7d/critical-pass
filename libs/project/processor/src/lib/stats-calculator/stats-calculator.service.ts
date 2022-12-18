import { Injectable } from '@angular/core';
import { RiskOption } from '../../../models/charts/risk-curve';
import { Project } from '../../../models/project/project';
import * as Keys from '../../../constants/keys';

@Injectable({
    providedIn: 'root',
})
export class StatsCalculatorService {
    constructor() {}

    public getRiskStats(extraFloat: number, project: Project): RiskOption {
        let criticalCount = 0;
        let redCount = 0;
        let yellowCount = 0;
        let greenCount = 0;

        let sumFloat = 0;
        let maxFloat = 0;
        let totalNonDummies = 0;

        let numValid = 0;
        let productFloat = 1;

        const stats = this.getStatProps(project, extraFloat);
        const activityAdjustment = stats.mean + stats.deviation;

        // When the decompressAmount is > 0
        // The first values for criticality and fibonacci are low because the critical
        // are being interpreted as highrisk, they should be a 3 not a 2
        const nonInfLinks = project.activities.filter(a => a.chartInfo.tf !== Infinity && !a.chartInfo.isDummy); 
        for (const l of nonInfLinks) {
            if (l.chartInfo.tf != null && l.chartInfo.tf !== Infinity && !l.chartInfo.isDummy) {
                const totalFloat = extraFloat + +l.chartInfo.tf;
                if (totalFloat === 0) {
                    criticalCount = criticalCount + 1;
                } else if (totalFloat <= +project.profile.redLimit) {
                    redCount++;
                } else if (totalFloat <= +project.profile.yellowLimit && totalFloat > +project.profile.redLimit) {
                    yellowCount++;
                } else if (totalFloat > +project.profile.yellowLimit) {
                    greenCount++;
                }
                if (totalFloat != null && totalFloat !== Infinity && !l.chartInfo.isDummy) {
                    let thisFloat = 0;
                    if (totalFloat > activityAdjustment) {
                        thisFloat = activityAdjustment;
                    } else {
                        thisFloat = totalFloat;
                    }

                    sumFloat = sumFloat + thisFloat; 
                    if (thisFloat > maxFloat) {
                        maxFloat = thisFloat;
                    }

                    productFloat = productFloat * (thisFloat + 1);
                    numValid++;
                }

                if (!l.chartInfo.isDummy) {
                    totalNonDummies++;
                }
            }
        }

        const nonDummies = project.activities.filter(a => !a.chartInfo.isDummy && a.chartInfo.tf !== Infinity);

        const numLinks = nonDummies.length;
        const riskSum =
            criticalCount * project.profile.risk.criticalWeight +
            redCount * project.profile.risk.redWeight +
            yellowCount * project.profile.risk.yellowWeight +
            greenCount * project.profile.risk.greenWeight;
        const maxRisk = numLinks * project.profile.risk.criticalWeight;

        let criticality = 1;
        if (maxRisk !== 0) {
            criticality = +(riskSum / maxRisk).toFixed(2);
        }

        const fibRiskSum = criticalCount * 4.24 + redCount * 2.62 + yellowCount * 1.62 + greenCount;
        const fibMaxRisk = numLinks * 4.24;

        let fibonacci = 1;
        if (fibMaxRisk !== 0) {
            fibonacci = +(fibRiskSum / fibMaxRisk).toFixed(2);
        }

        // Extra float is the offset for the projects risk + decompress amount.
        // This means the first value subtracted decompress amount, will be  -decompressAmount.
        // Each iteration will be total - decompressAmount. This needs to be readjusted to start
        // at 0;
        const adjustedFloat = extraFloat + project.profile.risk.decompressAmount;
        // Sum all of the float.  1 - sum / n * max float

        // page 314 of book adjust the input by replacing the float of the outlier activitews with the average of all floats plus one
        //standard deviation of all floats

        let activity = 1;
        if (maxFloat !== 0 && numLinks > 0) {
            activity = parseFloat((1 - sumFloat / (numLinks * maxFloat)).toFixed(2));
        }

        return { criticality, fibonacci, activity, extraFloat: adjustedFloat, criticalCount, redCount, yellowCount, greenCount } as RiskOption;
    }

    public getStatProps(project: Project, extraFloat: number): Stats {
        const r = { mean: 0, variance: 0, deviation: 0 };
        const validActivities = project.activities.filter(a => !a.chartInfo.isDummy && a.chartInfo.tf !== Infinity && a.chartInfo.tf !== null);

        let s = 0;
        const t = validActivities.length;
        for (const activity of validActivities) {
            s += +activity.chartInfo.tf + extraFloat;
        }
        const m = (r.mean = s / t);
        s = 0;

        for (const activity of validActivities) {
            s += Math.pow(+activity.chartInfo.tf - m + extraFloat, 2);
        }
        r.deviation = Math.sqrt((r.variance = s / t));
        return r;
    }
}

export class Stats {
    mean: number;
    variance: number; 
    deviation: number;
}