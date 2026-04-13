// ApplicationConfig permite definir la configuración global de la aplicación.
// Aquí se registran servicios y mecanismos que estarán disponibles en toda la app.
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

// provideRouter activa el sistema de rutas de Angular.
// routes es el arreglo donde normalmente se declaran las rutas.
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// provideClientHydration se usa en proyectos modernos de Angular.
// Ayuda a rehidratar la aplicación del lado del cliente.
// withEventReplay conserva eventos del usuario mientras la app termina de cargar.
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// appConfig es el objeto que Angular utilizará al iniciar la aplicación.
export const appConfig: ApplicationConfig = {
  providers: [

    // Este provider ayuda a escuchar errores globales del navegador.
    // Es útil para centralizar errores no controlados.
    provideBrowserGlobalErrorListeners(),

    // Activa el sistema de navegación por rutas.
    // Aunque este ejemplo no use varias páginas, la estructura queda lista.
    provideRouter(routes),

    // Habilita la hidratación del cliente.
    // Es común en proyectos modernos y no estorba aunque no uses SSR.
    provideClientHydration(withEventReplay())

    // Nota:
    // En versiones modernas de Angular ya no se acostumbra registrar aquí
    // animaciones como antes con provideAnimations().
    // Angular Material puede funcionar correctamente sin eso en este ejemplo.
  ]
};