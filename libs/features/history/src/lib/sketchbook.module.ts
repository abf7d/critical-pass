import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SketchbookRoutingModule } from './sketchbook-routing.module';
import { SketchbookLayoutComponent } from './sketchbook-layout/sketchbook-layout.component';
import { SketchbookActionButtonsComponent } from './sketchbook-action-buttons/sketchbook-action-buttons.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ArrowChartModule, ArrowSnapshotModule, ProjectTreeModule } from '@critical-pass/critical-charts';

@NgModule({
    declarations: [SketchbookLayoutComponent, SketchbookActionButtonsComponent],
    imports: [CommonModule, SketchbookRoutingModule, MatTooltipModule, ArrowChartModule, ArrowSnapshotModule, ProjectTreeModule],
    exports: [SketchbookActionButtonsComponent],
})
export class SketchbookModule {}
