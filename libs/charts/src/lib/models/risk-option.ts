export interface RiskPoint {
    extraFloat: number;
    risk: number;
}
export interface RiskMap {
    name: string;
    values: RiskPoint[]; 
}
export interface RiskOption {
    criticality: number;
    fibonacci: number;
    activity: number;
    extraFloat: number;
    criticalCount: number;
    redCount: number; 
    yellowCount: number; 
    greenCount: number;
  }