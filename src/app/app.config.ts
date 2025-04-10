import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { delayInterceptor } from './interceptors/delay.interceptor';
import PrimeNgPreset from './primeng-preset';

const primeNgProviders = [
  ConfirmationService,
  MessageService,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([delayInterceptor]),
    ),
    provideAnimations(),
    providePrimeNG({
      theme: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        preset: PrimeNgPreset,
        options: {
          darkModeSelector: '.dark',
        },
      },
    }),
    ...primeNgProviders,
  ],
};
