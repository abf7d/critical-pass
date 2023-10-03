import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrowChartComponent } from './arrow-chart.component';
import { FormsModule } from '@angular/forms';
import { OutsideClickModule } from '../../directives/outside-click/outside-click.module';
import { ArrowListComponent } from './arrow-list/arrow-list.component';

@NgModule({
    declarations: [ArrowChartComponent, ArrowListComponent],
    imports: [CommonModule, FormsModule, OutsideClickModule, FormsModule],
    exports: [ArrowChartComponent],
})
export class ArrowChartModule {}
