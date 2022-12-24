import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeRoutingModule } from './welcome.routing';
// import { AuthService } from '../../core/services/auth/auth.service';
// import { AccountDataService } from '../../core/services/account-data-sevice';
// import { AuthStoreService } from '../../core/services/auth-store';
import { RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
// import { MsalConfigFactoryService } from '../../core/services/auth/msal-config-factory/msal-config-factory.service';



@NgModule({
  declarations: [WelcomeComponent],
 
  imports: [CommonModule, /*WelcomeRoutingModule,*/ RouterModule],
    // providers: [AuthService, AccountDataService, AuthStoreService, MsalConfigFactoryService],
})
export class WelcomeModule { }
