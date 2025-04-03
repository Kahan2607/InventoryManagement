import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAuth0 } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAuth0({
      domain: 'kahan2607.jp.auth0.com',
      clientId: 'fDvyk8ovpSWD9ivJYNmoPtCtqWgJMGzM',
      authorizationParams: {
        redirect_uri: `${window.location.origin}/home`,
      },
    }),
    provideHttpClient(),
  ],
};
