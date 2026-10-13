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

## Entrada 3: Listar y crear proyectos desde el frontend 

**Objetivo:** Que la interfaz React muestre los proyectos guardados en SQLite y permita crear uno nuevo con un formulario, sin pasar por Swagger.

**Herramienta:** Cursor (plan gratuito) generó el código para listar proyectos. Claude lo usamos como tutor para el formulario de creación, porque el uso gratuito de Cursor se agotó.

**Prompt usado:**
- A Cursor: se le pidió continuar con el paso 14 del plan (listar proyectos en App.tsx).
- A Claude: "explícalo como me lo estaba explicando Cursor, paso por paso y qué tengo que hacer en cada paso".

**Respuesta de la IA:** Cursor entregó un App.tsx que pide GET /projects al backend y muestra la lista. Claude dividió el formulario en 6 pasos pequeños (import, estados, función handleSubmit, formulario, fetch POST y actualización de la lista) y después entregó el App.tsx completo. Chat completo: [entrada-formulario.md](chats/entrada-formulario.md).

**Qué escribimos nosotros y qué generó la IA:**
- Generado por Cursor: el código de listar proyectos.
- Generado por Claude: la estructura del formulario y el App.tsx final.
- Hecho por nosotros: revisar en /docs de FastAPI cómo espera el backend un proyecto (campos name y description), ejecutar el código y probar todo en el navegador.
- BORRA UNA DE ESTAS DOS LÍNEAS:
  - Tecleamos los 6 pasos del formulario a mano, siguiendo la guía.
  - Pegamos el App.tsx completo que nos dio Claude y después lo leímos parte por parte.

**Qué corregimos o rechazamos y por qué:**
- Una instrucción de Cursor decía "sustituir todo el archivo" y nos dimos cuenta de que, con el formulario empezado, habríamos borrado trabajo; por eso pedimos que nos explicaran qué hacer exactamente.
- BORRA UNA DE ESTAS DOS LÍNEAS:
  - Sin errores en este paso.
  - Nos apareció un error al crear proyectos (por ejemplo 422) y lo resolvimos revisando que los nombres de los campos coincidieran con los de /docs.

**Qué entendimos:** (redactado con ayuda de Claude y repasado para poder explicarlo)
- El `[]` al final del `useEffect` hace que la petición al backend se haga una sola vez, al abrir la página. Sin él se repetiría sin parar, porque guardar la lista vuelve a dibujar la pantalla.
- `e.preventDefault()` evita que el navegador recargue la página al enviar el formulario, para que lo maneje React.
- Usamos `[...projects, created]` y no `push` porque React necesita recibir una lista nueva para darse cuenta de que algo cambió y actualizar la pantalla.
- `Content-Type: application/json` le avisa al backend que el cuerpo del envío viene en JSON, para que lo lea correctamente.

**Resultado:** La página lista los proyectos guardados y el formulario crea uno nuevo que aparece al instante y sigue ahí al recargar, porque queda guardado en SQLite.

**Reflexión:**
- Quedarnos sin uso gratuito en Cursor nos obligó a cambiar de herramienta de IA en mitad del proyecto. Cursor nos daba un paso pequeño a la vez con "qué hacer, qué hace y qué deberías ver", y con Claude tuvimos que pedir explícitamente ese mismo formato.
- Cuando la IA entrega un archivo completo es fácil pegarlo sin entenderlo; por eso añadimos la sección de comprensión y las preguntas de repaso, que nos obligan a explicar el código con nuestras palabras.
- La próxima vez guardaremos el chat exportado al terminar cada paso, en lugar de reconstruirlo después.