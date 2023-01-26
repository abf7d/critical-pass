export interface RiskCurveState {
    svg: any;
    mainG: any;
    innerWidth: number | null;
    innerHeight: number | null;
    margin: { top: number; bottom: number; left: number; right: number };
    scales: { x: any; y: any } | null;
    activityReg: any;
    fibReg: any;
    criticalReg: any;
    secondDerivativeZero: number | null;
    bisectFloat: any;
    freeze: boolean;
    frozenPoint: any;
}

export class RiskCurveStateFactory {
    create(): RiskCurveState {
        return {
            svg: null,
            mainG: null,
            innerWidth: null,
            innerHeight: null,
            margin: { top: 60, right: 90, bottom: 100, left: 90 },
            scales: null,
            activityReg: null,
            fibReg: null,
            criticalReg: null,
            secondDerivativeZero: null,
            bisectFloat: null,
            freeze: false,
            frozenPoint: null,
        };
    }
}
