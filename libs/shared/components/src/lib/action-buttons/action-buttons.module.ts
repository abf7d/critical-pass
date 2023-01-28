import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonsComponent } from './action-buttons.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ArrowSnapshotModule } from '@critical-pass/charts';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@critical-pass/core';

@NgModule({
    declarations: [ActionButtonsComponent],
    imports: [CommonModule, MatTooltipModule, ArrowSnapshotModule, RouterModule, CoreModule],
    exports: [ActionButtonsComponent],
})
export class ActionButtonsModule {}
