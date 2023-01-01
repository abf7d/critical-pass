import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExplorerRoutingModule } from './explorer.routes';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor } from '@critical-pass/auth';
import { DashboardService, DASHBOARD_TOKEN, EventService, EVENT_SERVICE_TOKEN } from '@critical-pass/shared/data-access';

@NgModule({
    imports: [CommonModule, ExplorerRoutingModule],
    providers: [
        // ...moduleProviders,
        // { provide: KEYS.APP_CONFIG, useValue: config},
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthHttpInterceptor,
            multi: true,
        },
        { provide: DASHBOARD_TOKEN, useClass: DashboardService },
        { provide: EVENT_SERVICE_TOKEN, useClass: EventService}
        // { provide: 'LoggerBase', useClass: LoggerService },
        // { provide: 'HistoryFileManagerService', useClass: HistoryFileManagerService},
        // { provide: ProjectCompilerApiBase, useClass: ProjectCompilerApiService}
    ],
})
export class ExplorerLibModule {}


