import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignBarComponent } from './sidebars/assign-bar/assign-bar.component';
import { AssignActivityGridComponent } from './components/assign-activity-grid/assign-activity-grid.component';
// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AssignLayoutComponent } from './assign-layout/assign-layout.component';
import { TagSelectionComponent } from './components/tag-selection/tag-selection.component';
import { ActivityTagsComponent } from './components/activity-tags/activity-tags.component';
import { AssignChangeChartsComponent } from './components/assign-change-charts/assign-change-charts.component';
import { AssignMainComponent } from './components/assign-main/assign-main.component';
import { CompareMainComponent } from './components/compare-main/compare-main.component';
import { ResourcesMainComponent } from './components/resources-main/resources-main.component';
import { ResourceTagsComponent } from './components/resource-tags/resource-tags.component';
import { ResourceCardsComponent } from './components/resource-cards/resource-cards.component';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ResourcesRoutingModule } from './resources.routes';
import { ArrowChartModule, ProjectTreeModule, ShallowSSnapshotModule, StackedResourcesModule, TimeCostModule } from '@critical-pass/charts';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
// import { ProjectTreeModule, TimeCostModule } from '@critical-pass/critical-charts';
@NgModule({
    declarations: [
        AssignBarComponent,
        AssignLayoutComponent,
        AssignActivityGridComponent,
        TagSelectionComponent,
        ActivityTagsComponent,
        AssignChangeChartsComponent,
        AssignMainComponent,
        CompareMainComponent,
        ResourcesMainComponent,
        ResourceTagsComponent,
        ResourceCardsComponent,
        ProfileCardComponent,
    ],
    imports: [
        CommonModule,
        ResourcesRoutingModule,
        // AssignRoutingModule,
        // PerfectScrollbarModule,
        TimeCostModule,
        ProjectTreeModule,
        FormsModule,
        MatCardModule,
        ReactiveFormsModule,
        FormsModule,
        StackedResourcesModule,
        ShallowSSnapshotModule,
        ArrowChartModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatIconModule,
        MatDatepickerModule,
    ],
    // exports: [TagSelectionComponent],
})
export class ResourcesModule {}
