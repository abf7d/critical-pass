import { Inject, Injectable, NgZone } from '@angular/core';
import { ProjectManagerBase } from '../../../models';
import { ShallowSCalcService } from '../shallow-s-calc/shallow-s-calc.service';
import { ShallowSUiService } from '../shallow-s-ui/shallow-s-ui.service';

@Injectable({
  providedIn: 'root'
})
export class ShallowSFactoryService {

  constructor(@Inject('ProjectManagerBase') private pManager: ProjectManagerBase, private ngZone: NgZone, private calc: ShallowSCalcService ) { }

  get ui () {
    return new ShallowSUiService(this.pManager, this.ngZone, this.calc );
  }
}
