export interface TimeCostState {
    svg: any,
    mainG: any,
    innerWidth: number,
    innerHeight: number,
    margin: {top:number, bottom:number, left:number, right:number},
}

export class TimeCostStateFactory {
    create(): TimeCostState {
        return {
            svg: null,
            mainG: null,
            innerWidth: null,
            innerHeight: null,
            margin: { top: 40, right: 40, bottom: 100, left: 60 } ,
        }   
    }
}