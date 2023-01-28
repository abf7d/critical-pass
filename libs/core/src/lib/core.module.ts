import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsNaNPipe, IsNotNaNPipe } from './pipes/is-nan-pipe';
import { IsDatePipe } from './pipes/is-date-pipe';
@NgModule({
    declarations: [IsNaNPipe, IsDatePipe, IsNotNaNPipe],
    imports: [CommonModule],
    exports: [IsNaNPipe, IsDatePipe, IsNotNaNPipe]
})
export class CoreModule {}
