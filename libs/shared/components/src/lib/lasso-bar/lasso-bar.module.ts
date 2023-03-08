import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LassoBarComponent } from './lasso-bar.component';
import { ArrowBarModule } from '../arrow-bar/arrow-bar.module';

@NgModule({
    declarations: [LassoBarComponent],
    imports: [CommonModule, ArrowBarModule],
    exports: [LassoBarComponent],
})
export class LassoBarModule {}
