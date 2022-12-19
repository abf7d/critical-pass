import { Injectable } from '@angular/core';
import { Edge } from '../../../../models/risk/edge';
import { FloatInfo } from '../../../../models/risk/float-info';
// import { FloatInfo } from '../../../../models/risk/route';

@Injectable({
  providedIn: 'root'
})
export class FloatFactoryService {

  constructor() { }

  createFloatInfo (forwardActivity: Edge): FloatInfo {

        let est = forwardActivity.origin.distance;
        if(!!forwardActivity.minEST&& est < forwardActivity.minEST) {
          est = forwardActivity.minEST;
        }
        return  {
          id: forwardActivity.id,
          duration: forwardActivity.weight,
          EFTE_Tail: forwardActivity.origin.distance,
          LFTE_Tail: forwardActivity.origin.LFT,
          EFTE_Head: forwardActivity.destination.distance,
          LFTE_Head: forwardActivity.destination.LFT,
          minEST: forwardActivity.minEST,
          EST: est,
          EFT: est + forwardActivity.weight,
          LFT: forwardActivity.destination.LFT,
          LST: forwardActivity.origin.LFT - forwardActivity.weight,
          TF: forwardActivity.destination.LFT - (est + forwardActivity.weight),
          forwardActivity,
          FF: 0,
          IF: null
        } as FloatInfo;
  }
}
