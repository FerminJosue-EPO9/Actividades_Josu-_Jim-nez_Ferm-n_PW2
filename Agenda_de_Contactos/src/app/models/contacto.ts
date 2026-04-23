/**
 * ============================================
 * MODELO COMPLETO: Contacto
 * ============================================
 *
 * Este modelo representa un contacto REAL dentro del sistema.
 *
 * Es decir:
 * - ya fue creado
 * - ya está almacenado en el backend
 * - ya tiene un identificador único (id)
 *
 * Este modelo normalmente se usa cuando:
 * - el backend responde con una lista de contactos
 * - el backend responde con un contacto específico
 * - el backend devuelve el contacto recién creado
 *
 * IMPORTANTE:
 * El campo "id" no lo inventa el frontend.
 * El "id" lo genera el backend, porque el backend es quien controla
 * el almacenamiento y la identidad de cada registro.
 */
export interface Contacto {
  id: number;
  nombre: string;
  telefono: string;
  correo: string;
  categoria: 'personal' | 'trabajo' | 'familia';
}

/**
 * ============================================
 * MODELO DE ENTRADA: ContactoCreate
 * ============================================
 *
 * Este modelo representa los datos que el frontend ENVÍA al backend
 * cuando el usuario:
 * - crea un nuevo contacto
 * - actualiza un contacto existente
 *
 * ¿Por qué este modelo NO tiene id?
 *
 * Porque aquí todavía no estamos describiendo un registro completo
 * guardado en el sistema, sino solamente los datos que el usuario
 * captura en el formulario.
 *
 * El flujo correcto es este:
 *
 * 1. El usuario llena nombre, teléfono y correo
 * 2. Angular construye un objeto ContactoCreate
 * 3. Ese objeto se envía al backend
 * 4. El backend genera el id
 * 5. El backend devuelve un objeto Contacto completo
 *
 * En otras palabras:
 *
 * - ContactoCreate = lo que el cliente envía
 * - Contacto = lo que el backend devuelve
 *
 * Esta separación es una buena práctica porque:
 * - evita que el frontend invente ids
 * - deja claras las responsabilidades
 * - refleja mejor cómo funciona una API real
 * - hace más mantenible el código
 */
export interface ContactoCreate {
  nombre: string;
  telefono: string;
  correo: string;
  categoria: 'personal' | 'trabajo' | 'familia';
}