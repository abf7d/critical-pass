import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { TopNavComponent } from './components/top-nav/top-nav.component';
import { RouterModule } from '@angular/router';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { LeftMenuLayoutComponent } from './left-menu-layout/left-menu-layout.component';
import { TopNavComponent } from './top-nav/top-nav.component';
// import {
//     ActivityGridModule,
//     ArrowChartModule,
//     ArrowSnapshotModule,
//     ProjectTreeModule,
//     RiskCurveModule,
//     RiskDonutModule,
//     ScoreBoardModule,
//     ShallowSModule,
//     ShallowSSnapshotModule,
//     StackedResourcesModule,
//     TimeCostModule,
// } from '@critical-pass/critical-charts';

@NgModule({
    declarations: [TopNavComponent, LeftMenuLayoutComponent],
    imports: [
        // ActivityGridModule,
        FormsModule,
        CommonModule,
        RouterModule,
        // MatDatepickerModule,
        // MatNativeDateModule,
        // MatIconModule,
        // MatInputModule,
        // MatFormFieldModule,
        // MatTooltipModule,
        // ArrowChartModule,
        // ArrowSnapshotModule,
        // ProjectTreeModule,
        // RiskCurveModule,
        // RiskDonutModule,
        // ScoreBoardModule,
        // ShallowSModule,
        // ShallowSSnapshotModule,
        // StackedResourcesModule,
        // TimeCostModule,
    ],

    exports: [
        LeftMenuLayoutComponent,
        TopNavComponent,
        // ActivityGridModule,
        // FormsModule,
        // CommonModule,
        // MatDatepickerModule,
        // MatNativeDateModule,
        // MatIconModule,
        // MatInputModule,
        // MatFormFieldModule,
        // MatTooltipModule,
        // ArrowChartModule,
        // ArrowSnapshotModule,
        // ProjectTreeModule,
        // RiskCurveModule,
        // RiskDonutModule,
        // ScoreBoardModule,
        // ShallowSModule,
        // ShallowSSnapshotModule,
        // StackedResourcesModule,
        // TimeCostModule,
    ],
})
export class SharedModule {}
