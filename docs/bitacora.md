# Bitácora de desarrollo asistido por IA

## Declaración de herramientas de IA

- **Cursor (plan gratuito):** herramienta principal elegida. Se usó para la planificación inicial, el esqueleto del proyecto y los primeros pasos del backend y del frontend.
- **Claude:** herramienta de apoyo desde el inicio, para revisar los pasos que proponía Cursor, explicar conceptos y preparar la documentación. Desde que se agotó el uso gratuito de Cursor, pasó a ser la guía principal del desarrollo; Cursor se siguió usando como editor de código.
- **Por qué dos herramientas:** el plan gratuito de Cursor tiene un límite de uso mensual que se agotó a mitad del proyecto. Con ambas mantuvimos las mismas reglas: pasos pequeños, sin vibe coding y revisando cada cambio antes de aceptarlo.
- **Conversaciones guardadas:** Cursor en `docs/chats/cursor_project_setup_guidance.md` y en las capturas de `docs/capturas/`; Claude en `docs/chats/claude.md`.

## Entrada 1: Planificación inicial del MVP 

**Objetivo:** Definir el stack, el modelo de datos y el plan de construcción antes de escribir código.

**Herramienta:** Cursor (plan gratuito; el selector mostraba Cursor Grok 4.6 Medium).

**Prompt usado:** "Quiero construir un MVP web para gestionar skills de IA con versiones y un tablero kanban de tareas. Somos estudiantes de ingeniería de software. No escribas código todavía. Proponme 2 o 3 opciones de stack con pros y contras, el modelo de datos con sus relaciones y un plan de construcción en pasos pequeños."

**Respuesta de la IA:** Propuso tres stacks (Next.js con Prisma y SQLite, FastAPI con React, Django), un modelo de cinco entidades (Project, Skill, SkillVersion, KanbanColumn y Task) con versiones inmutables y un plan de 11 pasos. Recomendó Next.js. Evidencia: capturas `entrada1-planificacion-1.png` a `entrada1-planificacion-9.png`.

**Qué escribimos nosotros y qué generó la IA:** Cursor generó la propuesta. Nosotros la revisamos, la cuestionamos y tomamos las decisiones D1 a D4 (ver `decisiones.md`).

**Qué corregimos o rechazamos y por qué:**
- Descartamos el stack recomendado. Primero pensamos en Java con Spring Boot y React, pero lo descartamos por exceso de configuración para un MVP. Elegimos Python (FastAPI) con React.
- Task tenía a la vez skill_id y skill_version_id: es redundante. Dejamos solo skill_version_id, opcional.
- Quitamos el campo is_current: la versión vigente es la de número más alto.
- Simplificamos el skill a texto plano; los archivos adjuntos quedan fuera del MVP.

**Qué entendimos:**
- Las versiones son inmutables: una versión nueva se agrega al final y las anteriores nunca se editan, así el historial se conserva.
- La tarea se vincula a una versión y no al skill, porque la versión ya implica el skill y así no hay datos duplicados que puedan contradecirse.

**Resultado:** Stack, modelo de datos y plan aceptados con ajustes.

**Reflexión:** La IA propuso un diseño sólido, pero incluyó datos redundantes y recomendó un stack que no era el que queríamos. Revisarlo antes de construir evitó heredar esos problemas.

## Entrada 2: Esqueleto del proyecto 

**Objetivo:** Dejar el backend (FastAPI) y el frontend (React con Vite) arrancando, sin funciones propias.

**Herramienta:** Cursor, en modo tutor. Evidencia: `docs/chats/cursor_project_setup_guidance.md` y capturas `entrada2-pregunta-uvicorn.png` y siguientes.

**Prompt usado:** Le pedimos que actuara como tutor: no ejecutar comandos ni modificar archivos, dar un paso a la vez y explicar qué hace cada comando y cada archivo. Incluimos los datos de nuestro entorno: Windows con PowerShell, Python 3.13 y Node 22.

**Respuesta de la IA:** Guió paso a paso: entorno virtual, instalación de fastapi[standard] y sqlalchemy, un archivo main.py con un endpoint de prueba /health, el archivo requirements.txt y el proyecto de Vite con React y TypeScript. Nosotros ejecutamos los comandos y le hicimos preguntas, por ejemplo para qué sirve Uvicorn.

**Qué escribimos nosotros y qué generó la IA:** Cursor propuso cada paso y su explicación; nosotros ejecutamos los comandos, escribimos los archivos y verificamos el resultado.

**Qué corregimos o rechazamos y por qué:**
- Cursor detectó un main.py sobrante dentro de la carpeta .venv; comprobamos cuál era cuál antes de borrar.
- En Windows no existe el comando pip suelto; usamos python -m pip.
- Python en Windows se instala ahora con el Python Install Manager. Elegimos la versión 3.13 y no la 3.15 porque las versiones recién salidas pueden no tener aún paquetes para las librerías que usamos.
- En Vite elegimos TypeScript y ESLint (decisión D5). Aceptamos que el asistente instalara las dependencias y arrancara el servidor, y después pedimos que nos explicara cada archivo creado.

**Qué entendimos:**
- El entorno virtual aísla las librerías del proyecto y se activa por terminal.
- requirements.txt en el backend cumple el papel de package.json en el frontend; ni .venv ni node_modules se suben a Git.
- Vite es el servidor de desarrollo y empaquetador del frontend; React es la librería con la que se construye la interfaz.

**Resultado:** El backend responde en /health y muestra su documentación en /docs; el frontend arranca con la página inicial de Vite.

**Reflexión:** Darle a la IA los detalles de nuestro entorno evita comandos que no funcionan. Pedirle que actúe como tutor nos obligó a ejecutar y entender cada paso.

## Entrada 3: Modelos, API de proyectos y primera pantalla 

**Objetivo:** Crear la base de datos y la API de proyectos, y mostrarlos en una página de React.

**Herramienta:** Cursor, en modo tutor.

**Respuesta de la IA:** Cursor guió la creación de la base de datos SQLite, los cinco modelos de SQLAlchemy, los esquemas de validación, el CRUD de proyectos, la configuración de CORS y una primera pantalla que lista los proyectos.

**Qué escribimos nosotros y qué generó la IA:** El código lo propuso Cursor paso a paso. Nosotros lo aplicamos, lo probamos en /docs y revisamos los modelos contra nuestras decisiones.

**Qué corregimos o rechazamos y por qué:** Comprobamos que los modelos respetaran las decisiones D2 a D4: Task solo tiene skill_version_id, SkillVersion no tiene is_current y existe una restricción única sobre skill_id y número de versión, que impide repetir el mismo número en un skill.

**Qué entendimos:**
- CORS es el permiso que el backend da para que el navegador deje a la página (puerto 5173) llamar a la API (puerto 8000).
- El efecto de React con la lista vacía al final se ejecuta una sola vez, al abrir la página; sin ella se repetiría sin parar.
- El tipo Project en TypeScript es el contrato con lo que devuelve el backend.

**Resultado:** La página muestra los proyectos guardados en SQLite.

**Reflexión:** Probar primero cada endpoint en /docs nos permitió saber que el backend funcionaba antes de tocar React.

## Entrada 4: Formulario de proyectos, skills y versiones en el backend 

**Objetivo:** Crear proyectos desde la página y construir en el backend la parte central del producto: skills que nacen con su versión 1, y nuevas versiones sin editar las anteriores.

**Herramienta:** Claude como tutor, porque el uso gratuito de Cursor se agotó.

**Prompt usado:** "Dime paso a paso lo que tengo que hacer, literalmente como me lo da Cursor: crear este archivo, pegar esto, dime cuando esté listo y seguimos". Para que la guía se adaptara a nuestro código, le pasamos el contenido de database.py, main.py, models.py y schemas.py.

**Respuesta de la IA:** Claude dividió el trabajo en pasos pequeños, cada uno con qué hacer, qué hace y qué deberíamos ver: el formulario de creación de proyectos en React (importar el tipo del evento, dos estados, la función de envío, el formulario, el fetch con POST y la actualización de la lista), los esquemas de skills, el endpoint que crea un skill con su versión 1, el que lista los skills de un proyecto, el que lista las versiones de un skill y el que crea una versión nueva.

**Qué escribimos nosotros y qué generó la IA:** Claude generó el código y la explicación de cada paso. Nosotros lo aplicamos, lo probamos en /docs con casos de éxito (201 y 200) y de error (404 y 422) y revisamos que respetara las decisiones D2 a D4.

**Qué corregimos o rechazamos y por qué:**
- Se pegó el cuerpo de un skill en el endpoint de proyectos en lugar del de skills y aparecieron dos proyectos llamados "Resumen APA"; los borramos.
- Claude detectó, leyendo nuestros modelos, que borrar un proyecto con skills fallaría; lo dejamos anotado para el paso siguiente.

**Qué entendimos:**
- preventDefault evita que el navegador recargue la página al enviar el formulario.
- Se usa una lista nueva y no push para que React detecte que el estado cambió.
- Content-Type application/json avisa al backend que el cuerpo viene en JSON.
- El texto del skill vive en la versión, no en el skill; por eso el esquema de creación recibe un campo content que se guarda en la versión 1.
- Guardar skill y versión 1 con un solo commit garantiza que se guarden los dos o ninguno.
- El número de una versión nueva lo calcula el servidor (el más alto más uno), para que nadie se salte la numeración (decisión D3).

**Resultado:** Se pueden crear proyectos desde la página, crear skills con su versión 1, listar skills y versiones, y crear versiones nuevas dejando intactas las anteriores.

**Reflexión:** Que Claude leyera nuestro código antes de proponer los pasos evitó nombres inventados. Con guías de pasos pequeños es fácil pegar sin entender; por eso respondimos preguntas de comprensión después de cada paso.

## Entrada 5: Borrado en cascada, errores del backend y skills en React 

**Objetivo:** Arreglar el borrado de proyectos con contenido, resolver los errores que aparecieron y mostrar skills y versiones en la página.

**Herramienta:** Claude como tutor. Cuando algo fallaba, pegamos el error o una captura para que lo diagnosticara.

**Respuesta de la IA:** Claude propuso el borrado en cascada y los pasos del frontend: ver los skills de un proyecto, crear skills con un formulario y ver las versiones de un skill con la última marcada como vigente.

**Qué escribimos nosotros y qué generó la IA:** Claude generó el código. Nosotros lo aplicamos, reprodujimos el fallo antes del arreglo y probamos el resultado.

**Qué corregimos o rechazamos y por qué:**
- Borrar un proyecto con skills daba error 500: SQLAlchemy intentaba dejar los skills sin proyecto y la columna project_id no admite vacío. Lo resolvimos con borrado en cascada (decisión D6).
- IndentationError en models.py (líneas 10 y 34): al pegar los cambios el editor sumó espacios y Python no pudo cargar los modelos. Lo resolvimos reemplazando el archivo completo y comprobando con py_compile.
- La página parecía lenta: /health respondía pero /projects se agotaba. La causa era el error de sangría y no la base de datos.
- El comando fastapi no se reconocía en una terminal nueva porque no tenía el entorno virtual activo.

**Qué entendimos:**
- La opción all, delete-orphan hace que borrar un padre borre a sus hijos, y que un hijo que se queda sin padre se elimine.
- Python usa la sangría como parte de su sintaxis; pegar con el cursor ya sangrado suma espacios.
- Un traceback se lee de abajo hacia arriba: la última línea dice qué pasó y la anterior dónde.
- En pantalla, la versión vigente es la última de la lista ordenada, o sea la de número más alto.

**Resultado:** El borrado en cascada funciona (204) y la página muestra skills y versiones y permite crear ambos.

**Reflexión:** Los errores de este paso vinieron de aplicar cambios a mano, no de la lógica. Aprendimos a comprobar con py_compile antes de arrancar y a diagnosticar dónde está el problema.

## Entrada 6: Tablero, interfaz final y manejo de errores

**Objetivo:** Terminar el aplicativo: tablero de tareas, interfaz con estilos y avisos de error cuando el backend falla.

**Herramienta:** Claude, porque el uso gratuito de Cursor seguía agotado.

**Respuesta de la IA:** Claude entregó archivos completos, para evitar los errores de sangría anteriores. En el backend: columnas por defecto del tablero, crear y listar tareas, mover una tarea de columna, eliminarla y listar las versiones de skill de un proyecto. En el frontend: barra lateral de proyectos, pestañas Skills y Tablero, botones para mover tareas, botón para restaurar una versión en el formulario, manejo de errores y estilos propios en lugar de los de la plantilla.

**Qué escribimos nosotros y qué generó la IA:** Claude generó los archivos de este paso. Nosotros los aplicamos, probamos cada función en el navegador y en /docs, comprobamos el caso del backend apagado y preparamos los datos de ejemplo.

**Qué corregimos o rechazamos y por qué:**
- Reemplazamos los estilos de la plantilla de Vite, que centraban toda la página.
- Unificamos las llamadas al backend en una sola función, con manejo de errores, para que un backend apagado muestre un aviso en vez de fallar en silencio.

**Qué entendimos:**
- Las tres columnas se crean junto con cada proyecto en un solo commit, y a los proyectos anteriores se les crean la primera vez que se pide su tablero (decisión D7).
- Al crear una tarea con una versión de skill se comprueba que esa versión pertenezca al mismo proyecto, para no mezclar datos entre proyectos.
- mover una tarea comprueba que la columna destino sea del mismo proyecto de la tarea.
- La función que habla con el backend es el único lugar donde se llama a fetch: si la respuesta no es buena lanza un error, así el manejo de errores se escribe una sola vez.

**Resultado:** Aplicativo completo: proyectos, skills con historial de versiones, tablero con tres columnas, interfaz con estilos y avisos de error.

**Reflexiones:**
- Quedarnos sin uso gratuito en Cursor nos obligó a seguir con otra IA como tutor; cuando la IA entrega archivos completos es fácil dejar de pensar, por eso fue importante probar y explicar cada parte.
- Para la próxima, dejaríamos más margen para escribir nosotros las piezas centrales y que la IA las revise.