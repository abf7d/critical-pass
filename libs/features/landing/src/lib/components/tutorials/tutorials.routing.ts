import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeftMenuLayoutComponent } from '../../shared/components/left-menu-layout/left-menu-layout.component';
import { TutorialsComponent } from './tutorials.component';

const routes: Routes = [
    {
        path: 'tutorials',
        component: LeftMenuLayoutComponent,
        children: [
            {
                path: '',
                component: TutorialsComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TutorialsRoutingModule {}
