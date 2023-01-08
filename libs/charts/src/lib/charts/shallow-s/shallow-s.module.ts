import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShallowSComponent } from './shallow-s.component';

@NgModule({
    declarations: [ShallowSComponent],
    imports: [CommonModule],
    exports: [ShallowSComponent],
})
export class ShallowSModule {}
