import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebRoutingModule } from './web.routes';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor } from '@critical-pass/auth';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';
import { CanDeactivateGuard } from '@critical-pass/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
    imports: [CommonModule, WebRoutingModule, MatDatepickerModule, MatNativeDateModule],
    providers: [
        // ...moduleProviders,
        // { provide: KEYS.APP_CONFIG, useValue: config},
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthHttpInterceptor,
            multi: true,
        },
        { provide: DASHBOARD_TOKEN, useClass: DashboardService },
        { provide: EVENT_SERVICE_TOKEN, useClass: EventService },
        CanDeactivateGuard,
        // { provide: 'LoggerBase', useClass: LoggerService },
        // { provide: 'HistoryFileManagerService', useClass: HistoryFileManagerService},
        // { provide: ProjectCompilerApiBase, useClass: ProjectCompilerApiService}
    ],
})
export class WebCoreModule {}
