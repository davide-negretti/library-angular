import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import PrimeNgPreset from './primeng-preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        preset: PrimeNgPreset,
        options: {
          darkModeSelector: false,
        },
      },
    }),
  ],
};
