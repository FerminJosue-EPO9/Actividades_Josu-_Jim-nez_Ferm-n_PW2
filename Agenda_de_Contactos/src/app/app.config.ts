import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';

/**
 * Configuración principal de la aplicación.
 *
 * Aquí registramos los proveedores globales que Angular usará
 * en toda la app.
 *
 * En este proyecto son importantes:
 *
 * - provideRouter(routes)
 *   Activa el sistema de rutas.
 *
 * - provideClientHydration(withEventReplay())
 *   Habilita hidratación en cliente y replay de eventos.
 *
 * - provideHttpClient(withFetch())
 *   Registra HttpClient y le indica que use la API moderna fetch.
 *
 * Esto elimina la advertencia NG02801 y es la configuración
 * recomendada por Angular en proyectos modernos.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch())
  ]
};