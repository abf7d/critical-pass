import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { WebCoreModule } from '@critical-pass/app-libs/web-core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
    declarations: [AppComponent, NxWelcomeComponent],
    imports: [BrowserAnimationsModule, ToastrModule.forRoot(), RouterModule, HttpClientModule, WebCoreModule],
    bootstrap: [AppComponent],
})
export class AppModule {}
