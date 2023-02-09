import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectResolver } from '@critical-pass/shared/data-access';
import { CanDeactivateGuard } from '@critical-pass/core';
// import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';
// import { ShallowSBarComponent } from './sidebars/shallow-s-bar/shallow-s-bar.component';
// import { RiskBarComponent } from './sidebars/risk-bar/risk-bar.component';
// import { StackedResourcesBarComponent } from './sidebars/stacked-resources-bar/stacked-resources-bar.component';
// import { ActivityListBarComponent } from './sidebars/activity-list-bar/activity-list-bar.component';
import { LeftMenuLayoutComponent } from '@critical-pass/shared/components';

// const routes: Routes = [
//     {
//         path: '',
//         component: LeftMenuLayoutComponent,
//         children: [
//             {
//                 path: ':id',
//                 component: ProfileLayoutComponent,
//                 resolve: { items: ProjectResolver },
//                 canDeactivate: [CanDeactivateGuard],
//             },
//             { path: 'arrow/:id', component: ArrowBarComponent, outlet: 'sidebar' },
//             { path: 'shallows/:id', component: ShallowSBarComponent, outlet: 'sidebar' },
//             { path: 'risk/:id', component: RiskBarComponent, outlet: 'sidebar' },
//             { path: 'stacked/:id', component: StackedResourcesBarComponent, outlet: 'sidebar' },
//             { path: 'grid/:id', component: ActivityListBarComponent, outlet: 'sidebar' },
//         ],
//     },
// ];

// @NgModule({
//     imports: [RouterModule.forChild(routes)],
//     exports: [RouterModule],
// })
// export class ProfileRoutingModule {}



// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';
// import { CanDeactivateGuard } from '../../../core/guards/deactivate/can-deactivate.guard';
// import { ProjectProfileResolver } from '../../../core/resolvers/project-profile.resolver';
// import { LeftMenuLayoutComponent } from '../../../shared/components/left-menu-layout/left-menu-layout.component';
import { AssignLayoutComponent } from './assign-layout/assign-layout.component';
import { AssignBarComponent } from './sidebars/assign-bar/assign-bar.component';

const routes: Routes = [
  {
      path: '',
      component: LeftMenuLayoutComponent, 
      children: [
        {
          path: ':id',
          component: AssignLayoutComponent,
          resolve: { items: ProjectResolver },
                canDeactivate: [CanDeactivateGuard],
      },
      { path: 'assignbar/:id', component: AssignBarComponent, outlet: 'sidebar' },
      { path: 'resources/:id', component: AssignBarComponent, outlet: 'sidebar' },
      { path: 'compare/:id', component: AssignBarComponent, outlet: 'sidebar' }
      ],
  },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourcesRoutingModule { }