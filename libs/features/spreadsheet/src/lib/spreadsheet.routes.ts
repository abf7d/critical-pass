import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataGridComponent } from './data-grid/data-grid.component';
import { FileBarComponent } from './file-bar/file-bar.component';
import { LeftMenuLayoutComponent } from '@critical-pass/shared/components';

const routes: Routes = [ {
  path: '',
  component: LeftMenuLayoutComponent, 
  children: [
    {
      path: ':id',
      component: DataGridComponent,
  },
  { path: 'filebar/:id', component: FileBarComponent, outlet: 'sidebar' },
  ],
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpreadsheetRoutingModule { }
