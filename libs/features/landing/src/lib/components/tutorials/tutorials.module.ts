import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorialsRoutingModule } from './tutorials.routing';
import { TutorialsComponent } from './tutorials.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [TutorialsComponent],
    imports: [CommonModule, SharedModule, TutorialsRoutingModule],
})
export class TutorialsModule {}
