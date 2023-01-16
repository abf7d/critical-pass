export interface StackedResourcesState {
    svg: any,
    mainG: any,
    innerWidth: number | null,
    innerHeight: number | null,
    focusLine: any,
    margin: Margin,
    scales: {x: any, y: any} | null;
    barWidth: number | null;
    showAxes: boolean | null;
    el: any;
}

export class StackedResourcesStateFactory {
    create(): StackedResourcesState {
        return {
            svg: null,
            mainG: null,
            innerWidth: null,
            innerHeight: null,
            margin: { top: 60, right: 90, bottom: 100, left: 90 },
            scales: null,
            focusLine: null,
            barWidth: null,
            showAxes: null,
            el: null
        }
    }
}

export interface Margin {
    top:number;
    bottom:number; 
    left:number; 
    right:number;
}