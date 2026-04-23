from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.contactos_routes import router as contactos_router

"""
Este archivo es el punto de entrada principal de la aplicación.

Aquí se crea la instancia de FastAPI y se registran:
- configuración general
- middlewares
- rutas

FastAPI genera automáticamente documentación interactiva
a partir de esta configuración y de los modelos Pydantic.
"""

app = FastAPI(
    title="API de Agenda de Contactos",
    description="Servicio web de ejemplo para publicar y administrar contactos",
    version="1.0.0"
)

"""
Configuración de CORS.

CORS permite que un frontend ejecutándose en otro origen
(por ejemplo Angular en http://localhost:4200)
pueda consumir este backend sin que el navegador lo bloquee.

Para clase y desarrollo local, se puede permitir todo.
En producción esto debe restringirse a orígenes específicos.
"""
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def inicio():
    """
    Ruta raíz de prueba.

    Sirve para verificar rápidamente que el backend está funcionando.
    """
    return {
        "mensaje": "Backend FastAPI de agenda de contactos funcionando correctamente"
    }


"""
Registramos el router de contactos.

Con esto, todas las rutas definidas en contactos_routes.py
quedan publicadas dentro de la aplicación.
"""
app.include_router(contactos_router)