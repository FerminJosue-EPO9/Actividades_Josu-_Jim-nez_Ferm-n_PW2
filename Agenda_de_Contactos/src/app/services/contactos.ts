import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contacto, ContactoCreate } from '../models/contacto';

@Injectable({
  providedIn: 'root'
})
export class ContactosService {

  private http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:8000/contactos';

  private contactosSignal = signal<Contacto[]>([]);
  contactos = this.contactosSignal.asReadonly();

  private textoBusquedaSignal = signal<string>('');
  textoBusqueda = this.textoBusquedaSignal.asReadonly();

  private cargandoSignal = signal<boolean>(false);
  cargando = this.cargandoSignal.asReadonly();

  private errorSignal = signal<string>('');
  error = this.errorSignal.asReadonly();

  private categoriaSeleccionadaSignal = signal<string>('todas');
  categoriaSeleccionada = this.categoriaSeleccionadaSignal.asReadonly();

  contactosFiltrados = computed(() => {
    const texto = this.textoBusquedaSignal().trim().toLowerCase();

    if (!texto) {
      return this.contactosSignal();
    }

    return this.contactosSignal().filter(contacto =>
      contacto.nombre.toLowerCase().includes(texto) ||
      contacto.telefono.toLowerCase().includes(texto) ||
      contacto.correo.toLowerCase().includes(texto)
    );
  });

  totalContactos = computed(() => this.contactosSignal().length);

  contactosPorCategoria = computed(() => {
  const categoria = this.categoriaSeleccionadaSignal();

  if (categoria === 'todas') {
    return this.contactosSignal();
  }

  return this.contactosSignal().filter(c => c.categoria === categoria);
});


  cargarContactos(): void {
    this.cargandoSignal.set(true);
    this.errorSignal.set('');

    this.http.get<Contacto[]>(`${this.apiUrl}/`).subscribe({
      next: (respuesta) => {
        this.contactosSignal.set(respuesta);
        this.cargandoSignal.set(false);
      },
      error: () => {
        this.errorSignal.set('No se pudieron cargar los contactos desde el servidor.');
        this.cargandoSignal.set(false);
      }
    });
  }

  

  actualizarTextoBusqueda(texto: string): void {
    this.textoBusquedaSignal.set(texto);
  }

  agregar(datos: ContactoCreate): void {
    this.errorSignal.set('');

    this.http.post<Contacto>(`${this.apiUrl}/`, datos).subscribe({
      next: (contactoCreado) => {
        this.contactosSignal.update(listaActual => [...listaActual, contactoCreado]);
      },
      error: () => {
        this.errorSignal.set('No se pudo guardar el contacto.');
      }
    });
  }

  actualizar(id: number, datos: ContactoCreate): void {
    this.errorSignal.set('');

    this.http.put<Contacto>(`${this.apiUrl}/${id}`, datos).subscribe({
      next: (contactoActualizado) => {
        this.contactosSignal.update(listaActual =>
          listaActual.map(contacto =>
            contacto.id === id ? contactoActualizado : contacto
          )
        );
      },
      error: () => {
        this.errorSignal.set('No se pudo actualizar el contacto.');
      }
    });
  }

  eliminar(id: number): void {
    this.errorSignal.set('');

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.contactosSignal.update(listaActual =>
          listaActual.filter(contacto => contacto.id !== id)
        );
      },
      error: () => {
        this.errorSignal.set('No se pudo eliminar el contacto.');
      }
    });
  }

  obtenerPorId(id: number): Contacto | undefined {
    return this.contactosSignal().find(contacto => contacto.id === id);
  }

  obtenerPorCategoria(categoria: string): void {
    this.cargandoSignal.set(true);
    this.errorSignal.set('');

    this.http.get<Contacto[]>(`${this.apiUrl}/categoria/${categoria}`).subscribe({
      next: (respuesta) => {
        this.contactosSignal.set(respuesta);
        this.cargandoSignal.set(false);
      },
      error: () => {
        this.errorSignal.set('No se pudieron filtrar los contactos.');
        this.cargandoSignal.set(false);
      }
    });
  }

  cambiarCategoria(categoria: string): void {
  this.categoriaSeleccionadaSignal.set(categoria);

  if (categoria === 'todas') {
    this.cargarContactos();
  } else {
    this.obtenerPorCategoria(categoria);
  }
}

  
}