import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeCostComponent } from './time-cost.component';



@NgModule({
  declarations: [TimeCostComponent],
  imports: [
    CommonModule
  ],
  exports: [TimeCostComponent]
})
export class TimeCostModule { }
