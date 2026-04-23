import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ContactosService } from '../../services/contactos';

/**
 * ==========================================================
 * COMPONENTE: BuscadorContactosComponent
 * ==========================================================
 *
 * Este componente se encarga de capturar el texto de búsqueda.
 *
 * Su responsabilidad es:
 * - mostrar un campo de texto
 * - leer lo que el usuario escribe
 * - enviar ese valor al servicio
 *
 * El filtrado NO se hace aquí.
 * El filtrado real se hace en el servicio con un computed.
 */
@Component({
  selector: 'app-buscador-contactos',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  template: `
    <mat-card class="section-card">
      <mat-card-content>
        <div class="section-heading">
          <div class="heading-icon">
            <mat-icon>search</mat-icon>
          </div>

          <div class="heading-text">
            <h2>Buscar contacto</h2>
            <p>Filtra por nombre, teléfono o correo</p>
          </div>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Buscar contacto</mat-label>
          <input
            matInput
            type="text"
            name="busqueda"
            placeholder="Ej. Juan, 951..., correo@..."
            [(ngModel)]="texto"
            (input)="buscar()"
          >
          <mat-icon matSuffix>manage_search</mat-icon>
        </mat-form-field>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    :host {
      display: block;
      margin-bottom: 24px;
    }

    .section-card {
      border-radius: 24px;
      overflow: hidden;
    }

    .section-heading {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 14px;
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

    .full-width {
      width: 100%;
    }
  `]
})
export class BuscadorContactosComponent {
  private contactosService = inject(ContactosService);

  texto = '';

  /**
   * Actualiza el texto de búsqueda en el servicio.
   * Esto provoca que el computed del servicio se recalcule.
   */
  buscar(): void {
    this.contactosService.actualizarTextoBusqueda(this.texto);
  }
}