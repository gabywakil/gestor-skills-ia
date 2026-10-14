# Extractos de la conversación con Claude

Selección de mensajes que muestran cómo se usó Claude durante el desarrollo del aplicativo. Claude se usó como apoyo desde el inicio (para revisar los pasos y las propuestas de Cursor) y, cuando se agotó el uso gratuito de Cursor, pasó a ser la guía principal del desarrollo.

Cada extracto muestra primero lo que pidió el equipo y después la respuesta de Claude. Los mensajes se reproducen tal como se enviaron, con los títulos internos reducidos de nivel para que quepan en este documento. Donde aparece `[...]` se omitió una parte larga (código completo o plantillas), que está en el repositorio.

---

## 1. Revisión crítica de la propuesta de Cursor

**Lo que pidió el equipo:** pegó la respuesta de Cursor al prompt de planificación (tres opciones de stack, modelo de datos de cinco entidades y plan de 11 pasos) con el mensaje: "esta es la respuesta que dio con el promtp que le coloque".

**Respuesta de Claude:**

La respuesta es buena y sirve como base. Pero revísenla con ojo crítico, porque esos puntos son justo lo que va en el campo "Qué corregimos o rechazamos y por qué" de la bitácora.

#### Lo que está bien

- Acota el MVP y deja fuera lo que no hace falta (usuarios, notificaciones, etc.).
- Recomienda la opción A (Next.js + TypeScript + Prisma + SQLite), que es razonable: una sola app, un lenguaje y sin instalar una base de datos.
- Las versiones inmutables (se crea una nueva, no se edita la vieja) son una buena decisión de diseño.
- El plan es de pasos pequeños y demostrables.

#### Lo que yo cuestionaría

**1. `Task` guarda `skill_id` y `skill_version_id` a la vez.** Es redundante: la versión ya implica el skill. Además el propio texto reconoce que habría que garantizar que la versión pertenezca a ese skill, y eso es fácil de romper. Lo más limpio es dejar solo uno (por ejemplo `skill_version_id`, opcional) y deducir el skill desde ahí.

**2. El flag `is_current`.** Exige que haya una sola versión vigente por skill, y esa regla es incómoda de garantizar en la base de datos. Hay dos caminos: considerar vigente la versión con mayor `version_number` (más simple), o mantener el flag si quieren poder "volver a una versión anterior" como vigente. Es una decisión suya y vale la pena anotarla.

**3. Qué es un "skill".** Cursor lo modeló como un solo campo de texto (`content`). Si su idea es parecida a las skills de Claude (instrucciones más archivos de apoyo), el modelo se queda corto. Para el MVP el texto basta, pero dejen escrito que fue una simplificación consciente.

**4. SQLite y el despliegue.** Funciona perfecto en local para la clase. Si luego quieren publicarlo en internet, muchas plataformas no conservan archivos locales, y habría que cambiar a otra base de datos. Anótenlo como limitación.

**5. Las versiones de las herramientas cambian.** Cuando empiecen a construir, pídanle a Cursor que consulte la documentación actual de Next.js y Prisma, para evitar que use instrucciones desactualizadas.

#### Decisiones que les tocan a ustedes

Anótenlas en `docs/decisiones.md`:

1. Stack: ¿opción A (la recomendada) u otra? Yo iría con la A.
2. ¿Quitan `skill_id` de `Task` y dejan solo la versión?
3. ¿Versión vigente por flag o por número más alto?
4. ¿Skill como texto simple en el MVP?

`[...]` (aquí seguía una plantilla de la Entrada 1 de la bitácora, que está en `docs/bitacora.md`)

**Qué hizo el equipo con esto:** descartó la recomendación de Next.js y eligió Python con React; quitó el campo redundante de la tarea; decidió que la versión vigente es la de número más alto; y dejó el skill como texto simple. Ver `docs/decisiones.md` (D1 a D4).

---

## 2. Cambio de forma de trabajo: sin vibe coding

**Lo que pidió el equipo:** "ten algo en cuenta que no se puede tener vibe coding".

**Respuesta de Claude:**

Gracias por avisar, porque cambia la forma de usar Cursor. El prompt del esqueleto que te pasé le deja a la IA ejecutar todo sola, y eso es justo lo que conviene evitar.

Vibe coding es aceptar el código que genera la IA sin leerlo ni entenderlo, guiándose solo por si "parece que funciona". Lo contrario es que **ustedes dirigen y entienden cada paso**, y la IA asiste.

#### Cómo trabajar sin vibe coding

1. **La IA explica, ustedes ejecutan.** Pídele los pasos y que explique cada comando y archivo, y los corren ustedes mismos en la terminal.
2. **Lean cada cambio antes de aceptarlo.** Si Cursor propone modificar archivos, revisen el diff línea por línea. Si no pueden explicar una línea, pregunten qué hace antes de aceptarla.
3. **Escriban ustedes lo importante.** La lógica central (los modelos, la regla de versiones, el movimiento de tareas) conviene escribirla ustedes y usar la IA para revisar, sugerir mejoras o explicar errores.
4. **Pasos pequeños.** Un cambio, una comprobación, un commit. Nada de pedirle "hazme todo el módulo".
5. **Prueben cada cosa.** Comprueben ustedes mismos que funciona, y no solo confíen en que la IA diga que sí.
6. **Hagan commit solo de lo que puedan explicar.**

Cursor tiene un modo de **preguntas/chat** además del modo **Agent** (el que aparece en tu panel). Usen el modo de preguntas para aprender y reserven Agent para tareas pequeñas y muy acotadas, revisando siempre lo que hace.

#### Prompt corregido para el esqueleto

> "Vamos a empezar el paso 1 del plan: el esqueleto del proyecto, sin features. Actúa como tutor: **no ejecutes comandos ni modifiques archivos**. Guíame paso a paso y yo los ejecuto. Quiero `backend/` con FastAPI (Python, entorno virtual, SQLAlchemy y SQLite) y `frontend/` con React usando Vite y TypeScript.
>
> Mi entorno: Windows con PowerShell, Python 3.13 (`py -3.13 -m venv .venv`), Node.js 22. El comando `pip` suelto no existe aquí: usa `python -m pip`.
>
> Para cada paso dime: qué comando correr, qué hace exactamente y qué debería ver si salió bien. Explícame también para qué sirve cada archivo que se cree. Consulta la documentación actual de FastAPI y Vite. Sin modelos ni pantallas todavía; solo un endpoint de prueba `/health`. Dame un paso a la vez y espera a que te diga que lo terminé."

#### Ajusta la bitácora

Agrega dos campos a la plantilla de cada entrada, porque son los que demuestran que no hubo vibe coding:

```markdown
**Qué escribimos nosotros y qué generó la IA:**
**Qué entendimos (explicado con nuestras palabras):**
```

Y ante cada fragmento de código que acepten, háganse esta pregunta: *¿podría explicarlo en la presentación sin mirar la respuesta de la IA?* Si no, todavía no está listo para el commit.

#### Un punto que conviene aclarar

No sé cómo define exactamente su profesor el "vibe coding" ni cómo lo evalúa. Revisen la rúbrica o pregúntenle qué espera ver: por ejemplo, si permite que la IA genere el código base si ustedes lo revisan y lo explican, o si pide que escriban ustedes ciertas partes. Con eso afinamos el nivel de ayuda que le piden a Cursor.

**Qué hizo el equipo con esto:** pasó a pedir pasos pequeños con "qué hacer, qué hace y qué deberías ver", y agregó a la bitácora los campos "Qué escribimos nosotros y qué generó la IA" y "Qué entendimos".

---

## 3. Un paso típico: qué hacer, qué hace, qué deberías ver

**Lo que pidió el equipo:** después de probar los esquemas de skills (paso 15), escribió "listo". Antes había pedido: "quiero que me des los siguientes pasos, literalmente así como me lo está dando Cursor. O sea, tienes que crear este archivo, tienes que pegar esto, dime cuando esté listo y seguimos".

**Respuesta de Claude:**

#### Paso 16: Endpoint para crear un skill (con su versión 1)

Se hace en dos partes, las dos en `backend/main.py`.

**Parte A: Ajusta dos líneas de import**

**Qué hacer:** en la parte de arriba de `main.py`, cambia estas dos líneas:

```python
from models import Project
from schemas import ProjectCreate, ProjectRead, ProjectUpdate
```

para que queden así:

```python
from models import Project, Skill, SkillVersion
from schemas import ProjectCreate, ProjectRead, ProjectUpdate, SkillCreate, SkillRead
```

**Qué hace:** trae los dos modelos nuevos (`Skill` y `SkillVersion`) y los dos esquemas que vas a usar en este paso (`SkillCreate` para lo que entra y `SkillRead` para lo que sale). No importamos `SkillVersionRead` todavía porque se usa en el paso 18.

**Parte B: Agrega el endpoint**

**Qué hacer:** pega esto **al final** de `main.py`, después de `delete_project`. Escríbelo a mano si puedes.

```python
@app.post(
    "/projects/{project_id}/skills",
    response_model=SkillRead,
    status_code=status.HTTP_201_CREATED,
)
def create_skill(project_id: int, payload: SkillCreate, db: Session = Depends(get_db)):
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    skill = Skill(
        project_id=project_id,
        name=payload.name,
        description=payload.description,
    )
    skill.versions.append(SkillVersion(number=1, content=payload.content))
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill
```

Guarda con **Ctrl + S**.

**Qué hace, línea por línea:**

- **`"/projects/{project_id}/skills"`**: la ruta anida el skill dentro de un proyecto. El `{project_id}` de la URL llega como el parámetro `project_id` de la función.
- **`payload: SkillCreate`**: FastAPI lee el JSON del cuerpo y lo valida con el esquema del paso 15. Si el nombre viene vacío, responde 422 sin que tú escribas nada.
- **`db.get(Project, project_id)` y el 404**: antes de crear nada comprueba que el proyecto existe, igual que haces en `get_project`.
- **`Skill(...)`**: crea el skill con los datos del proyecto, el nombre y la descripción. Todavía no está guardado.
- **`skill.versions.append(SkillVersion(number=1, content=payload.content))`**: esta línea es la regla de tu decisión D3. Todo skill nace con su versión 1, y el `content` del esquema pasa a vivir en esa versión.
- **`db.add(skill)`**: marca el skill para guardarlo. SQLAlchemy guarda también la versión, porque está colgada de la lista `versions` del skill.
- **`db.commit()`**: guarda skill y versión **juntos, en una sola operación**. O se guardan los dos, o ninguno.
- **`db.refresh(skill)`**: vuelve a leer el skill de la base de datos para tener su `id`.
- **`return skill`**: FastAPI lo convierte en JSON con la forma de `SkillRead`.

**Qué deberías ver:** la terminal de `fastapi dev` se recarga sola sin errores en rojo. Si sale un error de import o de sintaxis, pégamelo.

#### Pruébalo en `/docs`

1. Abre `http://127.0.0.1:8000/docs` y recarga con F5. Debe aparecer **POST /projects/{project_id}/skills**.
2. Ábrelo, pulsa **Try it out**, escribe `1` en `project_id` (tu proyecto "MVP clase") y pon este cuerpo:

```json
{
  "name": "Resumen APA",
  "description": "Resume textos con formato APA",
  "content": "Resume el texto en 5 líneas y cita la fuente en formato APA."
}
```

3. Pulsa **Execute**.

**Qué deberías ver:** código **201** y una respuesta con `id`, `project_id`, `name` y `description`. La respuesta **no** muestra el `content` ni la versión, y es normal: `SkillRead` no los incluye. La versión 1 se guardó, y la veremos en el paso 18.

Prueba también estos dos casos, porque son los que demuestran que el endpoint se defiende:

- Con `project_id` = `999`: debe dar **404** "Proyecto no encontrado".
- Con `"name": ""`: debe dar **422**.

#### Preguntas para ti (sin mirar, para la bitácora)

1. ¿Por qué se comprueba que el proyecto existe **antes** de crear el skill?
2. ¿Qué ventaja tiene guardar el skill y su versión 1 con un solo `commit`?
3. Dime con tus palabras cómo se relaciona esta línea con la decisión D3: `skill.versions.append(SkillVersion(number=1, ...))`.

**Qué hizo el equipo con esto:** aplicó el paso, probó el 201, el 404 y el 422 en `/docs`, y respondió las preguntas de comprensión para la bitácora.

---

## 4. Diagnóstico de un error

**Lo que pidió el equipo:** envió una captura del final de un traceback de Python (`IndentationError: unexpected indent` en `models.py`, línea 10) después de que el backend dejara de responder y la página pareciera lenta.

**Respuesta de Claude:**

Ese error explica la lentitud y tiene arreglo rápido. Mira las dos últimas líneas de la captura: `models.py, line 10` y `IndentationError: unexpected indent`. Significa que en `models.py` hay una línea con **más espacios al inicio de los que Python espera**. Con ese archivo roto, el backend no puede cargar los modelos, y por eso `/health` respondía pero `/projects` no.

Es casi seguro que viene del cambio del paso 20. Mis bloques de código ya traían 4 espacios al inicio, y si pegaste con el cursor ya sangrado, quedaron 8. Fue culpa de cómo te di el paso, no tuya.

**Cómo leer este tipo de error:** el traceback se lee **de abajo hacia arriba**. La última línea dice qué pasó, y la anterior, en qué archivo y línea. Ahí está la pista.

#### Paso 1: Abre la línea con el problema

1. En Cursor abre `backend/models.py`.
2. Pulsa **Ctrl + G**, escribe `10` y Enter. Te lleva a esa línea.

La línea 10 es el comienzo de `skills: Mapped[list["Skill"]] = relationship(`.

#### Paso 2: Compara con cómo debe quedar

Esto es la clase `Project` completa. Fíjate en la sangría: el inicio de `skills:`, `columns:` y `tasks:` va con **4 espacios**, y la línea de adentro (`back_populates=...`) con **8**:

```python
class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text, default="")

    skills: Mapped[list["Skill"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )
    columns: Mapped[list["KanbanColumn"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )
    tasks: Mapped[list["Task"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )
```

Si tus líneas `skills:`, `columns:` o `tasks:` están más a la derecha que `id:` y `name:`, ese es el problema.

#### Paso 3: Corrígelo

1. **Selecciona** las líneas que están de más a la derecha (con el mouse, o con Shift + flechas).
2. Pulsa **Shift + Tab**: quita un nivel de sangría a todas a la vez.
3. Repite hasta que `skills:` quede alineada con `id:`.

`[...]` (siguen la revisión de las otras dos clases y los pasos para comprobar la sintaxis y reiniciar el backend)

#### Para la bitácora

Esto es una buena entrada para "Qué corregimos o rechazamos": un cambio mío dejó la sangría mal al pegarlo, el backend dejó de arrancar sin avisar de forma obvia, y se encontró leyendo el traceback de abajo hacia arriba y comparando con la versión correcta. Anota también qué aprendiste: que `/health` funcionaba (no usaba modelos) y `/projects` no, lo que apuntaba a los modelos.

**Qué hizo el equipo con esto:** corrigió el archivo, comprobó la sintaxis con `py_compile` y volvió a arrancar el backend. Un segundo error de sangría en la línea 34 se resolvió reemplazando el archivo completo.

---

## 5. Entrega de archivos completos por la fecha límite

**Lo que pidió el equipo:** con la entrega del video al día siguiente, escribió: "ahora dame en el chat, todo lo que falta del código".

**Respuesta de Claude:**

Te dejo todo lo que falta en un solo bloque. Con esto el proyecto queda completo:

- **Backend:** mover una tarea de columna, borrar una tarea y un endpoint que lista las versiones de skill de un proyecto (para vincular tareas desde la pantalla).
- **Frontend:** barra lateral de proyectos, pestañas Skills y Tablero, versiones con la marca "vigente", tablero con botones ← →, manejo de errores con `try/catch` y estilos.

Para no repetir el problema de sangría, todos los archivos van **completos**, y se reemplazan enteros: selecciona todo con **Ctrl + A**, bórralo y pega con el cursor en la línea 1. No toques `models.py` ni `database.py`.

`[...]` (aquí iban los archivos completos `schemas.py`, `main.py`, `index.css`, `App.css` y `App.tsx`, que están en el repositorio)

**Lo nuevo respecto a lo que ya tenías (backend):**

- **`GET /projects/{id}/versions`:** une versiones con el nombre de su skill (`join`) para que el selector de tareas muestre "Resumen APA v2".
- **`PATCH /tasks/{id}/move`:** comprueba que la columna destino pertenezca al **mismo proyecto** de la tarea (si no, 400) y deja la tarea **al final** de esa columna. Si ya está en esa columna, no hace nada.
- **`DELETE /tasks/{id}`:** borra una tarea.

**Comprueba y prueba el frontend:**

1. Se ve una barra superior morada, los proyectos a la izquierda y el área de trabajo a la derecha.
2. Elige un proyecto: pestañas **Skills** y **Tablero**.
3. **Skills:** crea un skill, ábrelo con **Ver versiones**, crea una versión nueva y comprueba que la última queda como **vigente** y que la v1 sigue intacta.
4. **Tablero:** agrega una tarea con y sin skill, y muévela con **←** y **→** entre las tres columnas.
5. Recarga con **F5** y comprueba que todo sigue en su sitio.
6. **El caso del `try/catch`:** apaga el backend con **Ctrl + C** y pulsa cualquier botón. Debe aparecer un aviso rojo arriba en vez de quedarse mudo.

#### Antes del video: que lo entiendan, no solo que funcione

Como esto lo escribí yo completo y no lo tecleó nadie del grupo, anótenlo así en la bitácora ("generado por Claude: tablero, mover tareas, estilos y manejo de errores") y repártanse piezas para entenderlas. Cada persona debería poder responder, con sus palabras, algo de su pieza:

1. **¿Qué hace la función `api` y por qué hay un solo lugar donde se llama a `fetch`?** (Pista: así el manejo de errores se escribe una vez.)
2. **¿Por qué `move_task` comprueba que la columna sea del mismo proyecto de la tarea?**
3. **¿Cómo se sabe en pantalla cuál es la versión vigente?** (Pista: se invierte la lista y la primera es la más nueva.)
4. **¿Para qué sirve `run` y qué pasa si el backend está apagado?**

**Qué hizo el equipo con esto:** aplicó los archivos, probó cada función en el navegador y en `/docs`, y dejó constancia en la bitácora de que este paso lo generó Claude.

---

## 6. Transparencia sobre el uso de dos herramientas

**Lo que pidió el equipo:** "¿hay algún problema con que hayamos usado Cursor hasta la mitad y luego Claude, o no es necesario nombrar eso? Porque la idea era usar una sola herramienta, pero pues no se pudo".

**Respuesta de Claude:**

Sí hay que nombrarlo, y lo mejor es contarlo antes de que se lo pregunten.

#### Por qué conviene decirlo

- **La actividad evalúa justamente eso:** cómo se asistieron con IA. Si omiten una de las herramientas, la documentación no describe lo que realmente pasó, y eso es peor que cualquier penalización por haber usado dos.
- **No lo pueden esconder bien.** Las conversaciones, los prompts y la propia bitácora muestran el cambio, y en la presentación les pueden preguntar.
- **Tiene una explicación honesta y razonable:** el plan gratuito de Cursor se agotó a mitad del trabajo. Los profesores suelen entender un límite real, y lo mal visto es ocultarlo.
- **Además es material para su análisis:** comparar cómo trabajó cada herramienta y qué pasa cuando una se vuelve inaccesible es justo el tipo de reflexión que piden.

No sé si la rúbrica penaliza usar dos herramientas. Por eso lo más seguro es preguntárselo hoy al profe, con un mensaje corto, y dejar la respuesta anotada.

#### Una corrección a tu bitácora

En las entradas que te armé escribí que Claude se usó "como tutor para el formulario" y "tras agotarse Cursor". Para ser exactos con lo que pasó: **Claude estuvo presente desde antes**, porque en este chat revisamos juntas los pasos de Cursor, el stack, las decisiones y la plantilla de bitácora, y a partir del límite pasó a ser la guía principal. Les recomiendo agregar esto **al inicio de `docs/bitacora.md`**:

```markdown
## Declaración de herramientas de IA

- **Cursor (plan gratuito):** herramienta principal elegida. Se usó para la planificación inicial, el esqueleto del proyecto y los primeros pasos del backend y del frontend.
- **Claude:** herramienta de apoyo desde el inicio, para revisar los pasos que proponía Cursor, explicar conceptos y preparar la documentación. Desde que se agotó el uso gratuito de Cursor, pasó a ser la guía principal del desarrollo; Cursor se siguió usando como editor de código.
- **Por qué dos herramientas:** el plan gratuito de Cursor tiene un límite de uso mensual que se agotó a mitad del proyecto. Mantuvimos las mismas reglas con ambas: pasos pequeños, sin vibe coding y con revisión de cada cambio.
```

