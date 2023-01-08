export interface Stats {
    regression: Regressions;
    extents: ChartExtents;
    data: ShallowSPoint[];
    showOverRun: boolean;
    overRunPoints: OverrRunPoints | null;
    step: boolean;
}
export interface ChartExtents {
    x: [number, number];
    y: [number, number];
}

export interface OverrRunPoints {
    x: [[Point, Point], [Point, Point]]; // first number is min planned that reaches 100, second is max final that reaches 100
    y: [[Point, Point], [Point, Point]];
}
export interface Regressions {
    actual: [Point, Point];
    planned: [Point, Point];
}
export interface Point {
    x: number;
    y: number;
}
export interface ShallowSPoint {
    actual?: Date;
    planned?: Date;
    duration?: number;
    name?: string;
    percentActualFinished: number | null;
    percentPlannedFinished: number | null;
    id?: number;
    isMilestone?: boolean;
}
export interface LinearRegressions {
    slopeA: number;
    slopeP: number;
}
