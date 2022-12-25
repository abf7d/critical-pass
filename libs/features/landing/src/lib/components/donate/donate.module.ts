import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { DonateRoutingModule } from './donate.routing';
import { DonateComponent } from './donate.component';
import { SharedModule } from '@critical-pass/shared/components';
import { NgxPayPalModule } from 'ngx-paypal';

@NgModule({
    declarations: [DonateComponent],
    imports: [CommonModule, SharedModule, /*DonateRoutingModule,*/ NgxPayPalModule],
})
export class DonateModule {}
