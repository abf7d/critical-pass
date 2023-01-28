import { NgModule } from '@angular/core';
import { ArrowBarComponent } from './sidebars/arrow-bar/arrow-bar.component';
import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';
import { RouterModule } from '@angular/router';
import { GraphOptionsComponent } from './components/graph-options/graph-options.component';
import { SelectedActivityComponent } from './components/selected-activity/selected-activity.component';
import { RiskDecompressComponent } from './components/risk-decompress/risk-decompress.component';
import { ActionButtonsComponent } from './components/action-buttons/action-buttons.component';
import { ShallowSBarComponent } from './sidebars/shallow-s-bar/shallow-s-bar.component';
import { RiskBarComponent } from './sidebars/risk-bar/risk-bar.component';
import { StackedResourcesBarComponent } from './sidebars/stacked-resources-bar/stacked-resources-bar.component';
import { ActivityListBarComponent } from './sidebars/activity-list-bar/activity-list-bar.component';
import { ParentProjectComponent } from './components/parent-project/parent-project.component';
// import { SharedModule } from '../../../shared/shared.module';
import { ProfileRoutingModule } from './profile.routes';
import { GridButtonsComponent } from './components/grid-buttons/grid-buttons.component';
import { ProjectMetadataComponent } from './components/project-metadata/project-metadata.component';
import { IsDatePipe, IsNotNaNPipe } from '@critical-pass/core';
import { ArrowBarModule } from './sidebars/arrow-bar/arrow-bar.module';
import { SharedModule } from '@critical-pass/shared/components';
import {
    ActivityGridModule,
    ArrowChartModule,
    ArrowSnapshotModule,
    RiskCurveModule,
    RiskDonutModule,
    ScoreBoardModule,
    ShallowSModule,
    ShallowSSnapshotModule,
    StackedResourcesModule,
} from '@critical-pass/charts';
import { ToastrModule } from 'ngx-toastr';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        ProfileLayoutComponent,
        // ArrowBarComponent,
        // GraphOptionsComponent,
        // SelectedActivityComponent,
        // RiskDecompressComponent,
        ActionButtonsComponent,
        ShallowSBarComponent,
        RiskBarComponent,
        StackedResourcesBarComponent,
        ActivityListBarComponent,
        ParentProjectComponent,
        GridButtonsComponent,
        ProjectMetadataComponent,
        IsNotNaNPipe,
        IsDatePipe,
    ],
    imports: [
        RouterModule,
        CommonModule,
        ProfileRoutingModule,
        ArrowBarModule,
        SharedModule,
        FormsModule,

        // Check if this is needed
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatTooltipModule,

        ArrowChartModule,
        ArrowSnapshotModule,
        ShallowSSnapshotModule,
        ShallowSModule,
        ScoreBoardModule,
        RiskDonutModule,
        StackedResourcesModule,
        RiskCurveModule,
        ActivityGridModule,
    ],
    exports: [ActionButtonsComponent, SelectedActivityComponent],
})
export class ProfileModule {}
