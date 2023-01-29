import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkBarComponent } from './network-bar/network-bar.component';
import { NetworkButtonsComponent } from './network-buttons/network-buttons.component';
import { NetworkLayoutComponent } from './network-layout/network-layout.component';
import { MetaTagsComponent } from './meta-tags/meta-tags.component';
import { TagGroupComponent } from './tag-group/tag-group.component';
import { NetworkRoutingModule } from './network.routes';
import { ArrowChartModule, ArrowSnapshotModule } from '@critical-pass/charts';
import { ArrowBarModule } from '@critical-pass/shared/components';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [NetworkBarComponent, NetworkButtonsComponent, NetworkLayoutComponent, MetaTagsComponent, TagGroupComponent],
    imports: [CommonModule, NetworkRoutingModule, ArrowChartModule, ArrowSnapshotModule, ArrowBarModule, FormsModule],
})
export class NetworkModule {}
