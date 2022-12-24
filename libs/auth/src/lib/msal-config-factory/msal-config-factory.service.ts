import * as Msal from '@azure/msal-browser';
import { Injectable } from '@angular/core';
import { environment } from '@critical-pass/shared/environments';
@Injectable({
    providedIn: 'root',
})
export class MsalConfigFactoryService {
    constructor() {}
    get(): Msal.Configuration {
        return {
            auth: {
                clientId: environment.clientID,
                authority: environment.authority,
                knownAuthorities: environment.knownAuthorities,

                redirectUri: environment.redirectUri,
                navigateToLoginRequestUrl: false,
            },
            cache: {
                cacheLocation: environment.cacheLocation,
                storeAuthStateInCookie: false, // Set this to "true" to save cache in cookies to address trusted zones limitations in IE (see: https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Known-issues-on-IE-and-Edge-Browser)
            },
            system: {
                loggerOptions: {
                    loggerCallback: (level: Msal.LogLevel, message: string, containsPii: boolean): void => {
                        if (containsPii) {
                            return;
                        }
                        switch (level) {
                            case Msal.LogLevel.Error:
                                console.error(message);
                                return;
                            case Msal.LogLevel.Info:
                                console.info(message);
                                return;
                            case Msal.LogLevel.Verbose:
                                console.debug(message);
                                return;
                            case Msal.LogLevel.Warning:
                                console.warn(message);
                                return;
                        }
                    },
                    piiLoggingEnabled: true,
                },
                windowHashTimeout: 60000,
                iframeHashTimeout: 6000,
                loadFrameTimeout: 0,
                asyncPopups: false,
            },
        };
    }
}
