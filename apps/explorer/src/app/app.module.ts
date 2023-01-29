import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { ExplorerLibModule } from '@critical-pass/explorer-lib';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
    declarations: [AppComponent, NxWelcomeComponent],
    imports: [BrowserAnimationsModule, ToastrModule.forRoot(), RouterModule, HttpClientModule, ExplorerLibModule],
    bootstrap: [AppComponent],
})
export class AppModule {}
