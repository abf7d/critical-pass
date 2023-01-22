import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiskCurveComponent } from './risk-curve.component';



@NgModule({
  declarations: [RiskCurveComponent],
  imports: [
    CommonModule
  ],
  exports: [RiskCurveComponent]
})
export class RiskCurveModule { }
