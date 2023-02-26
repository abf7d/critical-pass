import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeftMenuLayoutComponent } from '@critical-pass/shared/components';
import { JiraLayoutComponent } from './jira-layout/jira-layout.component';
import { JiraBarComponent } from './side-bars/jira-bar/jira-bar.component';

const routes: Routes = [
    {
        path: '',
        component: LeftMenuLayoutComponent,
        children: [
            {
                path: '',
                component: JiraLayoutComponent,
            },
            { path: '', component: JiraBarComponent, outlet: 'sidebar' },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class JiraRoutingModule {}
