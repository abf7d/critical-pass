import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JiraBarComponent } from './side-bars/jira-bar/jira-bar.component';
import { JiraLayoutComponent } from './jira-layout/jira-layout.component';
import { SharedModule } from '@critical-pass/shared/components';
import { JiraRoutingModule } from './jira.routes';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [JiraLayoutComponent, JiraBarComponent],
    imports: [CommonModule, SharedModule, JiraRoutingModule, HttpClientModule],
})
export class JiraModule {}
