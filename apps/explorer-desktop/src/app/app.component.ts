import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { DesktopCoreModule } from '@critical-pass/app-libs/desktop-core';
import { NxWelcomeComponent } from './nx-welcome.component';
import { NgModule } from '@angular/core';
import { WebCoreModule } from '@critical-pass/app-libs/web-core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
@Component({
    standalone: true,
    imports: [RouterModule, DesktopCoreModule, ToastrModule, HttpClientModule],
    selector: 'critical-pass-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'explorer-desktop';
}
