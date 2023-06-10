import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
// import { appRoutes } from './app.routes';
import { DesktopProviderModule, desktopRoutes } from '@critical-pass/app-libs/desktop-core';
import { provideHttpClient } from '@angular/common/http';

// export const appConfig: ApplicationConfig = {
//     providers: [provideRouter(appRoutes, withEnabledBlockingInitialNavigation())],
// };

export const appConfig: ApplicationConfig = {
    providers: [/*provideRouter(appRoutes) ,*/ provideRouter(desktopRoutes), provideHttpClient(), importProvidersFrom(DesktopProviderModule)],
    // providers: [provideRouter(desktopRoutes, withEnabledBlockingInitialNavigation())],
};

//above is working, but when I supply my routes from desktopRoutes, it breaks. Something about HttpClient
