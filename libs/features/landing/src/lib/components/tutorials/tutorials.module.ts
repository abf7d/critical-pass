import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { TutorialsRoutingModule } from './tutorials.routing';
import { TutorialsComponent } from './tutorials.component';
import { SharedModule } from '@critical-pass/shared/components';


@NgModule({
    declarations: [TutorialsComponent],
    imports: [CommonModule, SharedModule, /*TutorialsRoutingModule*/],
})
export class TutorialsModule {}
