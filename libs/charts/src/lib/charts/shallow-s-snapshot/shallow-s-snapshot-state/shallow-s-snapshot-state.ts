export interface ShallowSSnapshotState {
    svg: any;
    mainG: any;
    innerWidth: number | null;
    innerHeight: number | null;
    focusLine: any;
    margin: { top: number; bottom: number; left: number; right: number };
    scales: { x: any; y: any } | null;
}

export class ShallowSSnapshotStateFactory {
    create(): ShallowSSnapshotState {
        return {
            svg: null,
            mainG: null,
            innerWidth: null,
            innerHeight: null,
            margin: { top: 40, right: 60, bottom: 50, left: 50 },
            scales: null,
            focusLine: null,
        };
    }
}
