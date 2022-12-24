import { Component, OnInit } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
// import * as Keys from '../../core/constants/keys';
// import { PdConfig } from '../../core/models/pd-app.config';
import { environment } from '@critical-pass/shared/environments';

@Component({
  selector: 'cp-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;
  public showSuccess!: boolean;
  public showCancel!: boolean;
  public showError!: boolean;
  public dollarAmount!: number;

  public constructor(/*@Inject(Keys.APP_CONFIG) private config: PdConfig*/) {}
  
  public ngOnInit(): void {
    this.showError = false;
    this.showCancel = false;
    this.showSuccess = false;
    this.dollarAmount = 30;
    this.initConfig();
  }

  public resetStatus() {
    this.showCancel = false;
    this.showSuccess = false;
    this.showError = false;
  }
  public setDollarAmount(event: any) {
    const dollarAmount = event.target.value;
    if (+dollarAmount <= 0) {
      this.dollarAmount = 1;
    } else {
      this.dollarAmount = event.target.value;
    }
    this.initConfig();
  }

  private initConfig(): void {
    if (+this.dollarAmount <= 0) {
      this.dollarAmount = 1;
    }
    const dollarAmount = this.dollarAmount + '.00';
    this.payPalConfig = {
      currency: 'USD',
      clientId:  environment.payPalClientId,
      createOrderOnClient: (data: any) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            // currency_code: 'EUR',
            value: dollarAmount,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: dollarAmount
              }
            }
          },
          items: [{
            name: 'Enterprise Subscription',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'USD',
              value: dollarAmount,
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data: any, actions: any) => {
        actions.order.get().then((details: any) => {
          this.showSuccess = true;
        });

      },
      onClientAuthorization: (data: any) => {
        this.showSuccess = true;
      },
      onCancel: (data: any, actions: any) => {
        this.showCancel = true;
      },
      onError: (err: string) => {
        this.showError = true;
      },
      onClick: (data: any, actions: any) => {
        this.resetStatus();
      }
    };
  }

}
