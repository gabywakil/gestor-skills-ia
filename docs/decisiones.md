# Decisiones técnicas

## D1: Stack
**Elegido:** Python (FastAPI) en el backend + React (Vite + TypeScript) en el frontend
**Alternativas:** Next.js + Prisma + SQLite (propuesta principal de Cursor); Java + Spring Boot + React (lo habíamos considerado); Django
**Por qué:** Pensamos usar Java + Spring Boot, pero para un MVP de clase resultaba tedioso (más configuración y código repetitivo). Python permite avanzar más rápido y FastAPI documenta la API solo.
**Contras asumidos:** dos proyectos y dos procesos que arrancar, configuración de CORS.

## D2: Vínculo tarea ↔ skill
**Elegido:** solo skill_version_id (opcional); el skill se deduce desde la versión.
**Alternativas:** guardar skill_id y skill_version_id a la vez (como propuso Cursor).
**Por qué:** evita datos duplicados e inconsistencias entre el skill y la versión.

## D3: Versión vigente
**Elegido:** la de número más alto.
**Alternativas:** un campo is_current que se marca a mano.
**Por qué:** es más simple y no se puede romper. Para "volver atrás" se crea una versión nueva copiando el contenido de una antigua, así el historial sigue siendo inmutable.

## D4: Alcance del skill
**Elegido:** texto simple (nombre, descripción y contenido).
**Alternativas:** texto más archivos adjuntos.
**Por qué:** los archivos adjuntos complican el MVP; es una simplificación consciente.