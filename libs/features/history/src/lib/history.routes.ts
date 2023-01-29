import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArrowBarComponent, LeftMenuLayoutComponent } from '@critical-pass/shared/components';
import { HistoryLayoutComponent } from './history-layout/history-layout.component';
import { ProjectResolver } from '@critical-pass/shared/data-access';
import { CanDeactivateGuard } from '@critical-pass/core';

const routes: Routes = [
    {
        path: '',
        component: LeftMenuLayoutComponent,
        children: [
            {
                path: ':id',
                component: HistoryLayoutComponent,
                resolve: { items: ProjectResolver },
                canDeactivate: [CanDeactivateGuard],
            },
            { path: 'arrow/:id', component: ArrowBarComponent, outlet: 'sidebar' },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HistoryRoutingModule {}
