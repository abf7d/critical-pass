import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@critical-pass/features/landing';
import { WelcomeComponent } from '@critical-pass/features/landing';
import { AuthorizedUserGuard } from '@critical-pass/auth';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'welcome',
        component: WelcomeComponent,
    },
    {
        path: 'library',
        loadChildren: () => import('@critical-pass/features/library').then(m => m.LibraryModule),
        canLoad: [AuthorizedUserGuard],
    },
    {
        path: 'profile',
        loadChildren: () => import('@critical-pass/features/profile').then(m => m.ProfileModule),
        canLoad: [AuthorizedUserGuard],
    },
    {
        path: 'history',
        loadChildren: () => import('@critical-pass/features/history').then(m => m.HistoryModule),
        canLoad: [AuthorizedUserGuard],
    },
    {
        path: 'network',
        loadChildren: () => import('@critical-pass/features/network').then(m => m.NetworkModule),
        canLoad: [AuthorizedUserGuard],
    },
    {
        path: 'import',
        loadChildren: () => import('@critical-pass/features/spreadsheet').then(m => m.SpreadsheetModule),
        canLoad: [AuthorizedUserGuard],
    },
    {
        path: 'resources',
        loadChildren: () => import('@critical-pass/features/resources').then(m => m.ResourcesModule),
        canLoad: [AuthorizedUserGuard],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class ExplorerRoutingModule {}
