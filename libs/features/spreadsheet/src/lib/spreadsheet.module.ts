import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpreadsheetRoutingModule } from './spreadsheet.routes';
import { DataGridComponent } from './data-grid/data-grid.component';
import { FileBarComponent } from './file-bar/file-bar.component';
import { AgGridModule } from 'ag-grid-angular';
import { SheetHeaderComponent } from './sheet-header/sheet-header.component';
import { ColumnDefComponent } from './column-def/column-def.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DataGridComponent, FileBarComponent, SheetHeaderComponent, ColumnDefComponent],
  imports: [
    CommonModule,
    SpreadsheetRoutingModule,
    FormsModule,
    AgGridModule,
  ]
})
export class SpreadsheetModule { }
