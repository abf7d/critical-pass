export interface Risk {
    criticalityRisk: number;
    fibonacciRisk: number;
    activityRisk: number;
    criticalWeight: number;
    redWeight: number;
    yellowWeight: number;
    greenWeight: number;
    criticalCount: number;
    redCount: number;
    yellowCount: number;
    greenCount: number;
    maxFloat: number;
    sumFloat: number;
    decompressAmount: number;

    // constructor() {
    //     this.criticalityRisk = -1;
    //     this.fibonacciRisk = -1;
    //     this.activityRisk = -1;

    //     this.criticalWeight = 4;
    //     this.redWeight = 3;
    //     this.yellowWeight = 2;
    //     this.greenWeight = 1;

    //     this.criticalCount = 0;
    //     this.redCount = 0;
    //     this.yellowCount = 0;
    //     this.greenCount = 0;
    //     this.maxFloat = 0;
    //     this.sumFloat = 0;
    //     this.decompressAmount = 0;

    // }
    // loadGraphJson(json) {
    //   if (json == null) {
    //     return;
    //   }
    //     if (json.criticalityRisk != null) { this.criticalityRisk = json.criticalityRisk; }
    //     if (json.fibonacciRisk != null) { this.fibonacciRisk = json.fibonacciRisk; }
    //     if (json.activityRisk != null) { this.activityRisk = json.activityRisk; }

    //     if (json.criticalWeight != null) { this.criticalWeight = json.criticalWeight; }
    //     if (json.redWeight != null) { this.redWeight = json.redWeight; }
    //     if (json.yellowWeight != null) { this.yellowWeight = json.yellowWeight; }
    //     if (json.greenWeight != null) { this.greenWeight = json.greenWeight; }

    //     if (json.criticalCount != null) { this.criticalCount = json.criticalCount; }
    //     if (json.redCount != null) { this.redCount = json.redCount; }
    //     if (json.yellowCount != null) { this.yellowCount = json.yellowCount; }
    //     if (json.greenCount != null) { this.greenCount = json.greenCount; }
    //     if (json.maxFloat != null) { this.maxFloat = json.maxFloat; }
    //     if (json.sumFloat != null) { this.sumFloat = json.sumFloat; }
    //     if (json.decompressAmount != null) { this.decompressAmount = json.decompressAmount; }
    // }
}
