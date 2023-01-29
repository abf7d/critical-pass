import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetaGraphLayoutComponent } from './meta-graph-layout/meta-graph-layout.component';
import { MetaGraphRoutingModule } from './meta-graph-routing.module';
import { SketchbookModule } from '../sketchbook/sketchbook.module';
import { MetaBarComponent } from './meta-bar/meta-bar.component';
import { MetaButtonsComponent } from './meta-buttons/meta-buttons.component';
import { MetaTagsComponent } from './meta-tags/meta-tags.component';
import { TagGroupComponent } from './tag-group/tag-group.component';
import { ArrowChartModule, ArrowSnapshotModule } from '@critical-pass/critical-charts';
import { ArrowBarModule } from '../profile/sidebars/arrow-bar/arrow-bar.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [MetaGraphLayoutComponent, MetaBarComponent, MetaButtonsComponent, MetaTagsComponent, TagGroupComponent],
    imports: [CommonModule, MetaGraphRoutingModule, SketchbookModule, ArrowChartModule, ArrowSnapshotModule, ArrowBarModule, FormsModule],
})
export class MetaGraphModule {}
