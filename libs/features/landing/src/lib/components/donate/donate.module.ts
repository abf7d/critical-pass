import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DonateRoutingModule } from './donate.routing';
import { DonateComponent } from './donate.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxPayPalModule } from 'ngx-paypal';

@NgModule({
    declarations: [DonateComponent],
    imports: [CommonModule, SharedModule, DonateRoutingModule, NgxPayPalModule],
})
export class DonateModule {}
