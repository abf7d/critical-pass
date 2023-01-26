import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityGridComponent } from './activity-grid.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
    declarations: [ActivityGridComponent],
    imports: [
        CommonModule,
        DragDropModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatTooltipModule,
        FormsModule,
    ],
    exports: [ActivityGridComponent],
})
export class ActivityGridModule {}
