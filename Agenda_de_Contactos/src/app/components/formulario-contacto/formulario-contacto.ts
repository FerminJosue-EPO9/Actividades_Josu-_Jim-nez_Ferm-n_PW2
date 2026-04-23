import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { ContactosService } from '../../services/contactos';
import { ContactoCreate } from '../../models/contacto';

@Component({
  selector: 'app-formulario-contacto',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  template: `
    <mat-card class="section-card">
      <mat-card-content>

        <div class="section-heading">
          <div class="heading-icon">
            <mat-icon>person_add</mat-icon>
          </div>

          <div class="heading-text">
            <h2>Formulario de contacto</h2>
            <p>Registra un nuevo contacto en el sistema</p>
          </div>
        </div>

        <form class="form-grid" (ngSubmit)="guardar()">

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nombre</mat-label>
            <input matInput name="nombre" [(ngModel)]="nombre" required>
            <mat-icon matSuffix>person</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Teléfono</mat-label>
            <input matInput name="telefono" [(ngModel)]="telefono" required>
            <mat-icon matSuffix>phone</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Correo</mat-label>
            <input matInput name="correo" type="email" [(ngModel)]="correo" required>
            <mat-icon matSuffix>mail</mat-icon>
          </mat-form-field>

          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Categoría</mat-label>
            <mat-select name="categoria" [(ngModel)]="categoria" required>
              <mat-option value="personal">Personal</mat-option>
              <mat-option value="trabajo">Trabajo</mat-option>
              <mat-option value="familia">Familia</mat-option>
            </mat-select>
          </mat-form-field>

          <div class="actions-row">
            <button mat-flat-button color="primary" type="submit">
              <mat-icon>save</mat-icon>
              Guardar contacto
            </button>
          </div>

        </form>
      </mat-card-content>
    </mat-card>
  `
})
export class FormularioContactoComponent {

  private contactosService = inject(ContactosService);

  nombre = '';
  telefono = '';
  correo = '';
  categoria: 'personal' | 'trabajo' | 'familia' = 'personal';

  guardar(): void {
    if (
      !this.nombre.trim() ||
      !this.telefono.trim() ||
      !this.correo.trim() ||
      !this.categoria
    ) {
      return;
    }

    const nuevoContacto: ContactoCreate = {
      nombre: this.nombre.trim(),
      telefono: this.telefono.trim(),
      correo: this.correo.trim(),
      categoria: this.categoria
    };

    this.contactosService.agregar(nuevoContacto);
    this.limpiarFormulario();
  }

  private limpiarFormulario(): void {
    this.nombre = '';
    this.telefono = '';
    this.correo = '';
    this.categoria = 'personal';
  }
}