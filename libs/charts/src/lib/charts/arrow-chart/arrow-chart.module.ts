import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrowChartComponent } from './arrow-chart.component';
import { FormsModule } from '@angular/forms';
import { OutsideClickModule } from '../../directives/outside-click/outside-click.module';

@NgModule({
    declarations: [ArrowChartComponent],
    imports: [CommonModule, FormsModule, OutsideClickModule],
    exports: [ArrowChartComponent],
})
export class ArrowChartModule {}
