import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { BuscadorContactosComponent } from './components/buscador-contactos/buscador-contactos';
import { FormularioContactoComponent } from './components/formulario-contacto/formulario-contacto';
import { ListaContactosComponent } from './components/lista-contactos/lista-contactos';

/**
 * ==========================================================
 * COMPONENTE RAÍZ: App
 * ==========================================================
 *
 * Este componente organiza la estructura general de la aplicación.
 *
 * Su responsabilidad es:
 * - mostrar la barra superior
 * - mostrar el bloque introductorio
 * - renderizar el buscador
 * - distribuir formulario y lista en un layout de dos columnas
 *
 * Aquí no se maneja lógica de negocio.
 * Toda la lógica relacionada con contactos se delega
 * al servicio y a los componentes especializados.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    BuscadorContactosComponent,
    FormularioContactoComponent,
    ListaContactosComponent
  ],
  template: `
    <mat-toolbar class="app-toolbar">
      <div class="toolbar-inner">
        <div class="brand">
          <div class="brand-icon">
            <mat-icon>contacts</mat-icon>
          </div>
          <div class="brand-text">
            <span class="brand-title">Agenda de Contactos</span>
            <span class="brand-subtitle">Angular + FastAPI + Signals</span>
          </div>
        </div>
      </div>
    </mat-toolbar>

    <main class="page-shell">
      <section class="hero-panel">
        <p class="eyebrow">Proyecto ejemplo de consumo de servicios web</p>
        <h1>Agenda de Contactos</h1>
        <p class="hero-description">
          Aplicación construida con Angular moderno, Angular Material,
          Signals para estado reactivo y FastAPI como backend.
        </p>
      </section>

      <app-buscador-contactos></app-buscador-contactos>

      <section class="content-grid">
        <app-formulario-contacto></app-formulario-contacto>
        <app-lista-contactos></app-lista-contactos>
      </section>
    </main>
  `
})
export class App {}