import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor } from '@critical-pass/auth';
import { DashboardService, DASHBOARD_TOKEN, DesktopProjectApiService, EventService, EVENT_SERVICE_TOKEN, PROJECT_API_TOKEN } from '@critical-pass/shared/data-access';
import { CanDeactivateGuard } from '@critical-pass/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
    imports: [CommonModule, MatDatepickerModule, MatNativeDateModule],
})
export class DesktopCoreModule {}

@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthHttpInterceptor,
            multi: true,
        },
        { provide: DASHBOARD_TOKEN, useClass: DashboardService },
        { provide: EVENT_SERVICE_TOKEN, useClass: EventService },
        { provide: PROJECT_API_TOKEN, useClass: DesktopProjectApiService },
        CanDeactivateGuard,
    ],
})
export class DesktopProviderModule {}
