import { NgModule } from '@angular/core';
import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';
import { RouterModule } from '@angular/router';
import { SelectedActivityComponent } from './components/selected-activity/selected-activity.component';
import { ShallowSBarComponent } from './sidebars/shallow-s-bar/shallow-s-bar.component';
import { RiskBarComponent } from './sidebars/risk-bar/risk-bar.component';
import { StackedResourcesBarComponent } from './sidebars/stacked-resources-bar/stacked-resources-bar.component';
import { ActivityListBarComponent } from './sidebars/activity-list-bar/activity-list-bar.component';
import { ParentProjectComponent } from './components/parent-project/parent-project.component';
import { ProfileRoutingModule } from './profile.routes';
import { GridButtonsComponent } from './components/grid-buttons/grid-buttons.component';
import { ProjectMetadataComponent } from './components/project-metadata/project-metadata.component';
import { ArrowBarModule } from './sidebars/arrow-bar/arrow-bar.module';
import { ActionButtonsModule, SharedModule } from '@critical-pass/shared/components';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '@critical-pass/core';

@NgModule({
    declarations: [
        ProfileLayoutComponent,
        ShallowSBarComponent,
        RiskBarComponent,
        StackedResourcesBarComponent,
        ActivityListBarComponent,
        ParentProjectComponent,
        GridButtonsComponent,
        ProjectMetadataComponent,
    ],
    imports: [
        RouterModule,
        CommonModule,
        ProfileRoutingModule,
        ArrowBarModule,
        SharedModule,
        FormsModule,
        CoreModule,
        ActionButtonsModule,

        // Material
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatTooltipModule,

        // Charts
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
    exports: [SelectedActivityComponent],
})
export class ProfileModule {}
