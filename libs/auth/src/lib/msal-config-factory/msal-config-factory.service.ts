import * as Msal from '@azure/msal-browser';
import { Inject, Injectable } from '@angular/core';
import { PdConfig } from '../../../models/pd-app.config';
import * as Keys from '../../../../core/constants/keys';
@Injectable({
    providedIn: 'root',
})
export class MsalConfigFactoryService {
    constructor(@Inject(Keys.APP_CONFIG) private config: PdConfig) {}
    get(): Msal.Configuration {
        return {
            auth: {
                clientId: this.config.clientID,
                authority: this.config.authority,
                knownAuthorities: this.config.knownAuthorities,

                redirectUri: this.config.redirectUri,
                navigateToLoginRequestUrl: false,
            },
            cache: {
                cacheLocation: this.config.cacheLocation,
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
