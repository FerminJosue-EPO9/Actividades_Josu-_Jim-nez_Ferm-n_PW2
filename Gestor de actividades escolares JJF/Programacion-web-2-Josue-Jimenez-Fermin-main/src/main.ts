// main.ts es el punto de entrada real de la aplicación Angular.
// Todo comienza aquí cuando el navegador carga el proyecto.

import { bootstrapApplication } from '@angular/platform-browser';

// appConfig contiene la configuración global de la aplicación.
// Ahí se registran providers como rutas, hidratación y manejo global de errores.
import { appConfig } from './app/app.config';

// Importamos el componente raíz real del proyecto.
// En esta estructura moderna el archivo se llama app.ts
// y la clase exportada se llama App.
import { App } from './app/app';

// bootstrapApplication arranca la aplicación Angular standalone.
// Recibe:
// 1. el componente principal
// 2. la configuración global
bootstrapApplication(App, appConfig)

  // Si ocurre un error durante el arranque, se imprime en consola.
  .catch((err) => console.error(err));