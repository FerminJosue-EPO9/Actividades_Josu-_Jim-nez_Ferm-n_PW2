// ============================
// IMPORTACIONES
// ============================

import { MatDatepickerModule } from '@angular/material/datepicker'; /* Módulo para el calendario desplegable */
import { MatNativeDateModule } from '@angular/material/core';       /* Adaptador para fechas nativas de JavaScript */
import { Component, computed, signal } from '@angular/core';        /* Funciones núcleo de Angular y Signals */
import { FormsModule } from '@angular/forms';                       /* Módulo para vinculación de formularios */
import { MatToolbarModule } from '@angular/material/toolbar';       /* Componente de barra de herramientas */
import { MatCardModule } from '@angular/material/card';             /* Componente de tarjetas contenedoras */
import { MatFormFieldModule } from '@angular/material/form-field';  /* Contenedor para campos de entrada */
import { MatInputModule } from '@angular/material/input';           /* Directiva para campos de texto */
import { MatSelectModule } from '@angular/material/select';         /* Componente de listas desplegables */
import { MatButtonModule } from '@angular/material/button';         /* Estilos de botones de Material */
import { MatChipsModule } from '@angular/material/chips';           /* Etiquetas visuales pequeñas */
import { MatListModule } from '@angular/material/list';             /* Componente de listas de elementos */
import { MatCheckboxModule } from '@angular/material/checkbox';     /* Componente de selección binaria */
import { MatDividerModule } from '@angular/material/divider';       /* Línea divisoria horizontal */
import { MatIconModule } from '@angular/material/icon';             /* Módulo para iconos de Material */

// ============================
// MODELOS DE DATOS
// ============================

interface Tarea {
  id: number;                       /* Identificador único de la actividad */
  titulo: string;                   /* Nombre descriptivo de la tarea */
  materia: string;                  /* Asignatura correspondiente */
  fecha: string;                    /* Fecha formateada como texto */
  prioridad: 'Alta' | 'Media' | 'Baja'; /* Niveles de urgencia permitidos */
  completada: boolean;              /* Estado de finalización */
}

// ============================
// TIPOS AUXILIARES
// ============================

type FiltroEstado = 'todas' | 'pendientes' | 'completadas' | 'en-proceso'; /* Estados de filtrado disponibles */

// ============================
// CONFIGURACIÓN
// ============================

@Component({
  selector: 'app-root',             /* Etiqueta HTML para insertar el componente */
  standalone: true,                 /* Define que el componente es autónomo */
  imports: [                        /* Dependencias externas cargadas en el componente */
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatCheckboxModule,
    MatDividerModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './app.html',        /* Ruta del archivo de estructura HTML */
  styleUrl: './app.scss'            /* Ruta del archivo de estilos personalizados */
})

// ============================
// CLASE
// ============================

export class App {

  tituloApp = 'Gestor de actividades académicas'; /* Texto de encabezado de la aplicación */

  mensajeError = '';                /* Texto para alertas de validación */
  nuevoTitulo = '';                 /* Variable vinculada al nombre de la nueva tarea */
  nuevaMateria = '';                /* Variable vinculada a la materia ingresada */
  nuevaFecha: Date | null = null;   /* Almacena el objeto fecha del calendario */
  nuevaPrioridad: 'Alta' | 'Media' | 'Baja' = 'Media'; /* Prioridad inicial por defecto */

  filtroActual = signal<FiltroEstado>('todas'); /* Señal reactiva para el filtro activo */
  tareas = signal<Tarea[]>([]);     /* Señal reactiva que contiene la lista de tareas */

  private siguienteId = 4;          /* Contador interno para generar IDs nuevos */

  totalTareas = computed(() => this.tareas().length); /* Cálculo automático del total de tareas */

  totalPendientes = computed(() =>
    this.tareas().filter(t => t.completada === false).length /* Contador reactivo de tareas activas */
  );

  totalCompletadas = computed(() =>
    this.tareas().filter(t => t.completada === true).length /* Contador reactivo de tareas finalizadas */
  );

  tareasFiltradas = computed(() => {
    const filtro = this.filtroActual(); /* Obtiene el valor actual del filtro */
    const lista = this.tareas();       /* Obtiene la lista actual de tareas */

    if (filtro === 'pendientes') {
      return lista.filter(t => t.completada === false); /* Retorna solo las no finalizadas */
    }

    if (filtro === 'completadas') {
      return lista.filter(t => t.completada === true); /* Retorna solo las terminadas */
    }

    return lista; /* Retorna la lista completa por defecto */
  });

  agregarTarea(): void {
    const titulo = this.nuevoTitulo.trim();   /* Limpia espacios del título */
    const materia = this.nuevaMateria.trim(); /* Limpia espacios de la materia */

    if (!titulo || !materia || !this.nuevaFecha) {
      this.mensajeError = 'Tiene que configurar todos los datos de su tarea antes de agregarla.'; /* Valida campos vacíos */
      return;
    } else {
      this.mensajeError = ''; /* Limpia el mensaje de error si todo es correcto */
    }

    const fechaFormateada = this.nuevaFecha.toLocaleDateString('es-MX'); /* Formatea la fecha al estándar mexicano */

    const nuevaTarea: Tarea = {
      id: this.siguienteId++,       /* Asigna ID y aumenta el contador */
      titulo,
      materia,
      fecha: fechaFormateada,
      prioridad: this.nuevaPrioridad,
      completada: false
    };

    this.tareas.update(lista => [nuevaTarea, ...lista]); /* Inserta la tarea al inicio de la señal */

    this.nuevoTitulo = '';          /* Restablece el campo de título */
    this.nuevaMateria = '';         /* Restablece el campo de materia */
    this.nuevaPrioridad = 'Media';  /* Restablece la prioridad a media */
    this.nuevaFecha = null;         /* Limpia la selección del calendario */
  }

  toggleTarea(id: number): void {
    this.tareas.update(lista =>
      lista.map(t =>
        t.id === id
          ? { ...t, completada: !t.completada } /* Invierte el estado de completado */
          : t
      )
    );
  }

  eliminarTarea(id: number): void {
    this.tareas.update(lista =>
      lista.filter(t => t.id !== id) /* Filtra la lista para excluir el ID borrado */
    );
  }

  cambiarFiltro(filtro: FiltroEstado): void {
    this.filtroActual.set(filtro);  /* Actualiza el estado del filtro global */
  }

  obtenerClasePrioridad(prioridad: Tarea['prioridad']): string {
    switch (prioridad) {
      case 'Alta':
        return 'chip-alta';         /* Clase CSS para prioridad elevada */
      case 'Media':
        return 'chip-media';        /* Clase CSS para prioridad regular */
      case 'Baja':
        return 'chip-baja';         /* Clase CSS para prioridad reducida */
      default:
        return '';                  /* Retorna vacío si no hay coincidencia */
    }
  }
}