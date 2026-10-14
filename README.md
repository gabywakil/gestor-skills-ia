# Gestor de skills de IA

Aplicación web para gestionar skills de IA con historial de versiones y un tablero de tareas. Proyecto universitario de Introducción a la Inteligencia Artificial, construido con asistencia de IA (Cursor y Claude). El proceso está documentado en `docs/`.

## Qué hace
- Crear y eliminar proyectos.
- Crear skills dentro de un proyecto; cada skill nace con su versión 1.
- Crear versiones nuevas de un skill sin editar las anteriores; la vigente es la de número más alto. Se puede restaurar el texto de una versión anterior en el formulario para crear una nueva a partir de ella.
- Tablero de tareas por proyecto con tres columnas (Por hacer, En progreso, Hecho): crear tareas, vincularlas a una versión de skill, moverlas entre columnas y eliminarlas.

## Requisitos
- Python 3.13
- Node.js 22

## Cómo arrancarlo (Windows, PowerShell)

Backend:

    cd backend
    py -3.13 -m venv .venv
    .\.venv\Scripts\Activate.ps1
    python -m pip install -r requirements.txt
    fastapi dev

La API queda en http://127.0.0.1:8000 y su documentación en http://127.0.0.1:8000/docs

Frontend (en otra terminal):

    cd frontend
    npm install
    npm run dev

La página queda en http://localhost:5173

## Estructura
- `backend/`: API con FastAPI, SQLAlchemy y SQLite.
- `frontend/`: interfaz con React, Vite y TypeScript.
- `docs/`: bitácora del proceso con IA, decisiones técnicas, capturas y chats exportados.