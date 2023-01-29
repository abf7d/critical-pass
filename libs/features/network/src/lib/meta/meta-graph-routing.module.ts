import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '../../../core/guards/deactivate/can-deactivate.guard';
import { ProjectProfileResolver } from '../../../core/resolvers/project-profile.resolver';
import { LeftMenuLayoutComponent } from '../../../shared/components/left-menu-layout/left-menu-layout.component';
import { ArrowBarComponent } from '../profile/sidebars/arrow-bar/arrow-bar.component';
import { MetaBarComponent } from './meta-bar/meta-bar.component';
import { MetaGraphLayoutComponent } from './meta-graph-layout/meta-graph-layout.component';

const routes: Routes = [
  {
    path: '',
    component: LeftMenuLayoutComponent,
    children: [
      {
        path: ':id',
        component: MetaGraphLayoutComponent,
        resolve: { items: ProjectProfileResolver },
        canDeactivate: [CanDeactivateGuard],
      },
      { path: 'arrow/:id', component: ArrowBarComponent, outlet: 'sidebar'},
      { path: 'meta/:id', component: MetaBarComponent, outlet: 'sidebar' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetaGraphRoutingModule {}
