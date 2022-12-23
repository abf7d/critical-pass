import { InjectionToken } from '@angular/core';

export const CP_CONFIG = new InjectionToken<string>('CpConfig');
// const injector =
//     Injector.create({providers: [{provide: BASE_URL, useValue: 'http://localhost'}]});
// const url = injector.get(BASE_URL);
