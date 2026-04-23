import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ContactosService } from '../../services/contactos';

/**
 * ==========================================================
 * COMPONENTE: ListaContactosComponent
 * ==========================================================
 *
 * Este componente muestra la lista de contactos cargados
 * desde el backend.
 *
 * También muestra:
 * - el total de contactos
 * - el estado de carga
 * - errores
 * - el estado vacío
 *
 * Toda la información visible proviene del servicio.
 */


@Component({
  selector: 'app-lista-contactos',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  template: `
    <mat-card class="section-card">
      <mat-card-content>
        <div class="section-heading">
          <div class="heading-icon">
            <mat-icon>contacts</mat-icon>
          </div>

          <div class="heading-text">
            <h2>Lista de contactos</h2>
            <p>Contactos obtenidos desde el backend FastAPI</p>
          </div>
        </div>

        <div class="list-header">
          <mat-chip-set>
            <mat-chip color="primary" highlighted>
              Total de contactos: {{ totalContactos() }}
            </mat-chip>
          </mat-chip-set>
        </div>

        @if (cargando()) {
          <div class="status-block">
            <p>Cargando contactos...</p>
            <mat-progress-bar mode="indeterminate"></mat-progress-bar>
          </div>
        }

        @if (error()) {
          <div class="status-inline status-error">
            <mat-icon>error</mat-icon>
            <span>{{ error() }}</span>
          </div>
        }

        @if (!cargando() && !error() && contactos().length === 0) {
          <div class="status-inline status-empty">
            <mat-icon>folder_open</mat-icon>
            <span>No hay contactos para mostrar.</span>
          </div>
        }

        @if (!cargando() && contactos().length > 0) {
          <div class="contact-list">
            @for (contacto of contactosFiltrados(); track contacto.id) {
              <div class="contact-item">
                <div class="contact-main">
                  <div class="contact-name">
                    <div class="contact-avatar">
                      <mat-icon>person</mat-icon>
                    </div>
                    <strong>{{ contacto.nombre }}</strong>
                  </div>

                  <div class="contact-meta">
                    <div class="contact-meta-row">
                      <mat-icon>phone</mat-icon>
                      <span>{{ contacto.telefono }}</span>
                    </div>

                    <div class="contact-meta-row">
                      <mat-icon>mail</mat-icon>
                      <span>{{ contacto.correo }}</span>
                    </div>

                        <div class="contact-meta-row">
                      <mat-icon>face</mat-icon>
                      <span>{{ contacto.correo }}</span>
                    </div>

                  </div>
                </div>

                <div class="contact-actions">
                  <button
                    mat-stroked-button
                    color="warn"
                    type="button"
                    (click)="eliminar(contacto.id)"
                  >
                    <mat-icon>delete</mat-icon>
                    Eliminar
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    :host {
      display: block;
    }

    .section-card {
      border-radius: 24px;
      overflow: hidden;
    }

    .section-heading {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
    }

    .heading-icon {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: rgba(37, 99, 235, 0.10);
      color: #2563eb;
      flex-shrink: 0;
    }

    .heading-text {
      min-width: 0;
    }

    .heading-text h2 {
      margin: 0 0 4px;
      font-size: 1.35rem;
      font-weight: 700;
      color: #0f172a;
    }

    .heading-text p {
      margin: 0;
      color: #64748b;
      font-size: 0.95rem;
      line-height: 1.4;
    }

    .list-header {
      margin-bottom: 16px;
    }

    .status-block {
      display: grid;
      gap: 10px;
      margin-bottom: 16px;
      padding: 16px 18px;
      border-radius: 18px;
      border: 1px solid rgba(148, 163, 184, 0.14);
      background: rgba(248, 250, 252, 0.95);
    }

    .status-block p {
      margin: 0;
    }

    .status-inline {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      padding: 15px 16px;
      border-radius: 18px;
    }

    .status-error {
      background: rgba(254, 242, 242, 0.95);
      border: 1px solid rgba(248, 113, 113, 0.20);
      color: #991b1b;
    }

    .status-empty {
      background: rgba(248, 250, 252, 0.95);
      border: 1px solid rgba(148, 163, 184, 0.14);
      color: #475569;
    }

    .contact-list {
      display: grid;
      gap: 16px;
    }

    .contact-item {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 18px;
      align-items: center;
      padding: 18px 18px 18px 20px;
      border-radius: 20px;
      background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.88));
      border: 1px solid rgba(148, 163, 184, 0.14);
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }

    .contact-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 26px rgba(15, 23, 42, 0.08);
    }

    .contact-main {
      display: grid;
      gap: 10px;
      min-width: 0;
    }

    .contact-name {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #0f172a;
      font-size: 1.02rem;
    }

    .contact-avatar {
      display: inline-grid;
      place-items: center;
      width: 42px;
      height: 42px;
      border-radius: 14px;
      background: rgba(37, 99, 235, 0.08);
      color: #2563eb;
      flex-shrink: 0;
    }

    .contact-meta {
      display: grid;
      gap: 6px;
      color: #475569;
      font-size: 0.95rem;
    }

    .contact-meta-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .contact-actions button {
      min-width: 140px;
      height: 44px;
      border-radius: 14px;
      font-weight: 700;
    }

    @media (max-width: 860px) {
      .contact-item {
        grid-template-columns: 1fr;
      }

      .contact-actions {
        justify-content: flex-start;
      }
    }
  `]
})

export class ListaContactosComponent implements OnInit {
  private contactosService = inject(ContactosService);

  contactos = this.contactosService.contactosPorCategoria;
  contactosFiltrados = this.contactosService.contactosFiltrados;

  totalContactos = this.contactosService.totalContactos;
  cargando = this.contactosService.cargando;
  error = this.contactosService.error;

  ngOnInit(): void {
    this.contactosService.cargarContactos();
  }

  eliminar(id: number): void {
    this.contactosService.eliminar(id);
  }
}