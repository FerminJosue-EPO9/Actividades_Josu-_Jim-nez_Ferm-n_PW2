from app.models.contacto_model import Contacto

"""
Este archivo simula la fuente de datos del sistema.

En lugar de una base de datos real, usamos una lista en memoria.
Esto es muy útil para clase porque:
- simplifica el ejemplo
- permite enfocarse en la publicación del servicio web
- evita meter todavía temas de persistencia o SQL

Importante:
estos datos se reinician cada vez que se apaga o reinicia el servidor.
"""

contactos_db: list[Contacto] = [
    Contacto(
        id=1,
        nombre="Juan Pérez",
        telefono="9511234567",
        correo="juan@correo.com",
        categoria="personal"
    ),
    Contacto(
        id=2,
        nombre="Ana López",
        telefono="9517654321",
        correo="ana@correo.com",
        categoria="personal"
    ),
    Contacto(
        id=3,
        nombre="Carlos Ruiz",
        telefono="9519998888",
        correo="carlos@correo.com",
        categoria="personal"
    )
]