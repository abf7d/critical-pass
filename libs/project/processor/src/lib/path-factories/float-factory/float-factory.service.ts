import { Injectable } from '@angular/core';
import { Edge, FloatInfo } from '@critical-pass/project/models';

@Injectable({
    providedIn: 'root',
})
export class FloatFactoryService {
    constructor() {}

    createFloatInfo(forwardActivity: Edge): FloatInfo {
        let est = forwardActivity.origin.distance;
        if (!!forwardActivity.minEST && est !== null && est < forwardActivity.minEST) {
            est = forwardActivity.minEST;
        }
        return {
            id: forwardActivity.id,
            duration: forwardActivity.weight,
            EFTE_Tail: forwardActivity.origin.distance,
            LFTE_Tail: forwardActivity.origin.LFT,
            EFTE_Head: forwardActivity.destination.distance,
            LFTE_Head: forwardActivity.destination.LFT,
            minEST: forwardActivity.minEST,
            EST: est,
            EFT: (est ?? 0) + forwardActivity.weight,
            LFT: forwardActivity.destination.LFT,
            LST: (forwardActivity.origin.LFT ?? 0) - forwardActivity.weight,
            TF: (forwardActivity.destination.LFT ?? 0) - ((est ?? 0) + forwardActivity.weight),
            forwardActivity,
            FF: 0,
            IF: 0,
        } as FloatInfo;
    }
}
