import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShallowSSnapshotComponent } from './shallow-s-snapshot.component';



@NgModule({
  declarations: [ShallowSSnapshotComponent],
  imports: [
    CommonModule
  ],
  exports: [ShallowSSnapshotComponent]
})
export class ShallowSSnapshotModule { }
