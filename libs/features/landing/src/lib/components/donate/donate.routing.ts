import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeftMenuLayoutComponent } from '../../shared/components/left-menu-layout/left-menu-layout.component';
import { DonateComponent } from './donate.component';

const routes: Routes = [
    {
        path: 'donate',
        component: LeftMenuLayoutComponent,
        children: [
            {
                path: '',
                component: DonateComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DonateRoutingModule {}
