import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JiraBarComponent } from './side-bars/jira-bar/jira-bar.component';
import { JiraLayoutComponent } from './jira-layout/jira-layout.component';
import { LassoBarModule, SharedModule } from '@critical-pass/shared/components';
import { JiraRoutingModule } from './jira.routes';
import { HttpClientModule } from '@angular/common/http';
import { ArrowChartModule } from '@critical-pass/charts';
import { ArrowSnapshotModule } from "../../../../charts/src/lib/charts/arrow-snapshot/arrow-snapshot.module";

@NgModule({
    declarations: [JiraLayoutComponent, JiraBarComponent],
    imports: [CommonModule, SharedModule, JiraRoutingModule, HttpClientModule, ArrowChartModule, LassoBarModule, ArrowSnapshotModule]
})
export class JiraModule {}
