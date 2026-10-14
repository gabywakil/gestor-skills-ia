# Decisiones técnicas

## D1: Stack
**Elegido:** Python (FastAPI) en el backend y React (Vite con TypeScript) en el frontend.
**Alternativas:** Next.js con Prisma y SQLite (propuesta principal de Cursor); Java con Spring Boot y React; Django.
**Por qué:** Pensamos usar Java con Spring Boot, pero para un MVP de clase resultaba tedioso (más configuración y código repetitivo). Python permite avanzar más rápido y FastAPI documenta la API solo.
**Contras asumidos:** dos proyectos y dos procesos que arrancar, y configuración de CORS.

## D2: Vínculo tarea y skill
**Elegido:** solo skill_version_id (opcional); el skill se deduce desde la versión.
**Alternativas:** guardar skill_id y skill_version_id a la vez, como propuso Cursor.
**Por qué:** evita datos duplicados e inconsistencias entre el skill y la versión.

## D3: Versión vigente
**Elegido:** la de número más alto.
**Alternativas:** un campo is_current que se marca a mano.
**Por qué:** es más simple y no se puede romper. Para volver atrás se crea una versión nueva copiando el contenido de una antigua, así el historial sigue siendo inmutable.

## D4: Alcance del skill
**Elegido:** texto simple (nombre, descripción y contenido).
**Alternativas:** texto más archivos adjuntos.
**Por qué:** los archivos adjuntos complican el MVP; es una simplificación consciente.

## D5: Linter del frontend
**Elegido:** ESLint.
**Alternativas:** Oxlint, la opción por defecto del asistente de Vite.
**Por qué:** es el estándar más conocido, con más documentación, y es más fácil de explicar y de buscar ayuda.

## D6: Borrado de un proyecto con contenido
**Elegido:** borrado en cascada: al borrar un proyecto se borran sus skills, versiones, columnas y tareas, configurado en los modelos de SQLAlchemy.
**Alternativas:** bloquear el borrado con un error 409 si el proyecto tiene skills.
**Por qué:** el proyecto es el contenedor de todo lo demás y la alternativa exigía un endpoint para borrar skills que aún no existía.
**Contras asumidos:** el borrado destruye también el historial de versiones; la cascada la aplica SQLAlchemy y no la base de datos.

## D7: Columnas del tablero
**Elegido:** tres columnas fijas (Por hacer, En progreso, Hecho), creadas con cada proyecto; los proyectos anteriores las reciben la primera vez que se pide su tablero.
**Alternativas:** columnas personalizables por proyecto.
**Por qué:** es lo mínimo que necesita el MVP.
**Contras asumidos:** el equipo no puede cambiar el flujo de trabajo.

## D8: Cómo se mueven las tareas
**Elegido:** botones que pasan la tarea a la columna vecina.
**Alternativas:** arrastrar y soltar.
**Por qué:** es más simple de implementar y de explicar, y no requiere librerías extra.
**Contras asumidos:** es menos cómodo si hubiera muchas columnas.