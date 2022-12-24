import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
// import { environment } from '../environments/environment';

// import { CP_CONFIG } from '@critical-pass/shared/data-access';

@NgModule({
    declarations: [AppComponent, NxWelcomeComponent],
    imports: [BrowserModule, HttpClientModule],
    // providers: [{ provide: CP_CONFIG, useValue: environment }],
    bootstrap: [AppComponent],
})
export class AppModule {}
