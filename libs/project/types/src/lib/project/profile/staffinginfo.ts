export interface StaffingInfo {
    costInMM: number;
    effortInMM: number;
    durationInMonths: number;
    effeciencyFactor9to1: number; // == effortInMM / costInMM
    averageStaffing: number; // costInMM * 30 / total staffing time (first date - last date of staffing)
    directCost: number;
    indirectCost: number;
    earliestFinishDate: string;
    lft: string;
    // constructor() {
    //   this.costInMM = -1; // == sumation from resource cost in mm
    //   this.effortInMM = -1; // == Total Duration / 30
    //   this.durationInMonths = -1; //  == first date - last date / 30
    //   this.effeciencyFactor9to1 = -1; // == effortInMM / costInMM
    //   this.averageStaffing = -1; // costInMM * 30 / total staffing time (first date - last date of staffing)
    //   this.directCost = -1;
    //   this.indirectCost = -1;
    //   this.earliestFinishDate = '';
    //   this.lft = '';
    // }
    // loadGraphJson(json) {
    //   if (json == null) {
    //     return;
    //   }
    //   if (json.costInMM != null) { this.costInMM = json.costInMM; }  // == sumation from resource cost in mm
    //   if (json.effortInMM != null) { this.effortInMM = json.effortInMM; }  // == Total Duration / 30
    //   if (json.durationInMonths != null) { this.durationInMonths = json.durationInMonths; }  //  == first date - last date / 30
    //   if (json.effeciencyFactor9to1 != null) { this.effeciencyFactor9to1 = json.effeciencyFactor9to1; }  // == effortInMM / costInMM
    //   if (json.averageStaffing != null) { this.averageStaffing = json.averageStaffing; }
    //   // costInMM * 30 / total staffing time (first date - last date of staffing)
    //   if (json.directCost != null) { this.directCost = json.directCost; }
    //   if (json.indirectCost != null) { this.indirectCost = json.indirectCost; }
    //   if (json.earliestFinishDate != null) { this.earliestFinishDate = json.earliestFinishDate; }
    //   if (json.lft != null) { this.lft = json.lft; }
    // }
}
