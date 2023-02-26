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
    eft?: number;
}
