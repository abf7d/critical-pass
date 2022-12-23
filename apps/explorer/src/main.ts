import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from '@critical-pass/shared/environments';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';
if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
