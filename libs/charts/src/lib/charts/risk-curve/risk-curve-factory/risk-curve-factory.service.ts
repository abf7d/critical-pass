import { Inject, Injectable, NgZone } from '@angular/core';
import { ProjectManagerBase } from '../../../models';
import { RiskCurveDecompressorService } from '../risk-curve-decompressor/risk-curve-decompressor.service';
import { RiskCurveUiService } from '../risk-curve-ui/risk-curve-ui.service';

@Injectable({
  providedIn: 'root'
})
export class RiskCurveFactoryService {

  constructor(@Inject('ProjectManagerBase') private pManager: ProjectManagerBase, private ngZone: NgZone, private decompressor: RiskCurveDecompressorService) { }

  get ui () {
    return new RiskCurveUiService(this.pManager, this.ngZone, this.decompressor);
  }
}
