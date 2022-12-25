// import { AuthStoreService } from './../../core/services/auth-store';
import { HomeRoutingModule } from './home.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { AccountDataService } from '../../core/services/account-data-sevice';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
// import { AuthService } from '../../core/services/auth/auth.service';
// import { MsalConfigFactoryService } from '../../core/services/auth/msal-config-factory/msal-config-factory.service';

@NgModule({
    declarations: [HomeComponent],
    imports: [CommonModule /*, HomeRoutingModule*/, RouterModule],
    // providers: [AuthService, AccountDataService, AuthStoreService, MsalConfigFactoryService],
})
export class HomeModule {}
