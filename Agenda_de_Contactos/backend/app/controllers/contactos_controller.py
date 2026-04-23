from fastapi import HTTPException
from app.data.contactos_data import contactos_db
from app.models.contacto_model import Contacto, ContactoCreate

CATEGORIAS_VALIDAS = ["familia", "personal", "trabajo"]


def obtener_contactos_por_categoria(categoria: str):
    if categoria not in CATEGORIAS_VALIDAS:
        raise HTTPException(status_code=400, detail="Categoría inválida")

    contactos = obtener_contactos()
    return [c for c in contactos if c.categoria == categoria]


def obtener_contactos() -> list[Contacto]:
    return contactos_db


def obtener_contacto_por_id(contacto_id: int) -> Contacto:
    for contacto in contactos_db:
        if contacto.id == contacto_id:
            return contacto

    raise HTTPException(status_code=404, detail="Contacto no encontrado")


def crear_contacto(datos: ContactoCreate) -> Contacto:
    nuevo_id = 1 if not contactos_db else contactos_db[-1].id + 1

    nuevo_contacto = Contacto(
        id=nuevo_id,
        nombre=datos.nombre,
        telefono=datos.telefono,
        correo=datos.correo,
        categoria=datos.categoria
    )

    contactos_db.append(nuevo_contacto)
    return nuevo_contacto


def actualizar_contacto(contacto_id: int, datos: ContactoCreate) -> Contacto:
    for indice, contacto in enumerate(contactos_db):
        if contacto.id == contacto_id:
            contacto_actualizado = Contacto(
                id=contacto_id,
                nombre=datos.nombre,
                telefono=datos.telefono,
                correo=datos.correo,
                categoria=datos.categoria
            )

            contactos_db[indice] = contacto_actualizado
            return contacto_actualizado

    raise HTTPException(status_code=404, detail="Contacto no encontrado")


def eliminar_contacto(contacto_id: int) -> dict:
    for indice, contacto in enumerate(contactos_db):
        if contacto.id == contacto_id:
            eliminado = contactos_db.pop(indice)
            return {
                "mensaje": "Contacto eliminado correctamente",
                "contacto": eliminado
            }

    raise HTTPException(status_code=404, detail="Contacto no encontrado")


def buscar_contactos(texto: str) -> list[Contacto]:
    texto_normalizado = texto.strip().lower()

    if not texto_normalizado:
        return contactos_db

    return [
        contacto
        for contacto in contactos_db
        if texto_normalizado in contacto.nombre.lower()
        or texto_normalizado in contacto.telefono.lower()
        or texto_normalizado in contacto.correo.lower()
    ]