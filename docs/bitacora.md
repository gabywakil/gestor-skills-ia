## Entrada 1: Planificación inicial del MVP (12/10/2026)
**Objetivo:** Definir stack, modelo de datos y plan de construcción antes de escribir código.
**Herramienta:** Cursor (modelo: [el que muestre el chat, ver nota abajo])
**Prompt usado:** "Quiero construir un MVP web para gestionar skills de IA con versiones y un tablero kanban de tareas. Somos estudiantes de ingeniería de software. No escribas código todavía. Proponme 2 o 3 opciones de stack con pros y contras, el modelo de datos con sus relaciones y un plan de construcción en pasos pequeños."
**Respuesta de la IA:** Propuso 3 stacks (Next.js + Prisma + SQLite, FastAPI + React, Django), un modelo de 5 entidades (Project, Skill, SkillVersion, KanbanColumn, Task) con versiones inmutables y un plan de 11 pasos. Recomendó la opción A (Next.js).
**Qué corregimos o rechazamos y por qué:**
- Descartamos la opción recomendada (Next.js). Primero pensamos en Java + Spring Boot con React, pero lo descartamos por ser tedioso para un MVP; elegimos Python (FastAPI) + React.
- Task tenía skill_id y skill_version_id a la vez: redundante. Dejamos solo skill_version_id (opcional).
- Quitamos el flag is_current: la versión vigente es la de número más alto.
- Simplificamos el skill a texto plano; los archivos adjuntos quedan fuera del MVP.
**Resultado:** Stack: Python (FastAPI) + React (Vite + TypeScript) + SQLite. Plan de 11 pasos aceptado con los ajustes anteriores.
**Reflexión:** La IA propuso un diseño sólido, pero incluyó datos redundantes en el modelo y recomendó un stack que no era el que el equipo quería. Revisarlo antes de construir evitó heredar esos problemas.

## Entrada 2: Esqueleto FastAPI + Vite (12/10/2026)
**Objetivo:** Dejar el proyecto arrancable, sin modelos ni pantallas del MVP.
**Herramienta:** Cursor (tutor, sin que la IA ejecute comandos) + PowerShell.
**Qué hicimos:**
- Entorno virtual Python 3.13 en `backend/.venv`
- `fastapi[standard]` y `sqlalchemy`; Uvicorn viene en `[standard]` y sirve el puerto
- `backend/main.py` con `GET /health` → `{"status":"ok"}`
- `backend/requirements.txt` escrito a mano (no `pip freeze`)
- `frontend/` con `npm create vite@latest frontend -- --template react-ts`
**Errores y correcciones:**
- `main.py` se creó por error dentro de `.venv`; se movió a `backend/main.py`
- `pip` suelto no existe; se usó `python -m pip`
- PowerShell necesita comillas en `"fastapi[standard]"`
**Resultado:** API en `:8000`, front de plantilla en `:5173`. SQLAlchemy instalado y sin usar. Sin CORS ni pantallas del gestor.
**Reflexión:** El extra `[standard]` no es “FastAPI mágico”: incluye el servidor (Uvicorn). Separar backend y frontend obliga a dos procesos; es un costo consciente (D1).