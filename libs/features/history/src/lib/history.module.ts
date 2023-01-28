import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryActionButtonsComponent } from './history-action-buttons/history-action-buttons.component';
import { HistoryLayoutComponent } from './history-layout/history-layout.component';
import { HistoryRoutingModule } from './history.routes';

import { MatTooltipModule } from '@angular/material/tooltip';
import { ArrowChartModule, ArrowSnapshotModule, ProjectTreeModule } from '@critical-pass/critical-charts';

@NgModule({
    declarations: [HistoryActionButtonsComponent, HistoryLayoutComponent],
    imports: [CommonModule, HistoryRoutingModule, MatTooltipModule, ArrowChartModule, ArrowSnapshotModule, ProjectTreeModule],
    exports: [SketchbookActionButtonsComponent],
})
export class HistoryModule {}
