# Project setup guidance
_Exported on 10/12/2026 at 18:38:23 GMT-5 from Cursor (3.24.12)_

---

**User**

Vamos a empezar el paso 1 del plan: el esqueleto del proyecto, sin features. Actúa como tutor: no ejecutes comandos ni modifiques archivos. Guíame paso a paso y yo los ejecuto. Quiero backend/ con FastAPI (Python, entorno virtual, SQLAlchemy y SQLite) y frontend/ con React usando Vite y TypeScript.

Mi entorno: Windows con PowerShell, Python 3.13 (py -3.13 -m venv .venv), Node.js 22. El comando pip suelto no existe aquí: usa python -m pip.

Para cada paso dime: qué comando correr, qué hace exactamente y qué debería ver si salió bien. Explícame también para qué sirve cada archivo que se cree. Consulta la documentación actual de FastAPI y Vite. Sin modelos ni pantallas todavía; solo un endpoint de prueba /health. Dame un paso a la vez y espera a que te diga que lo terminé.Ya existen la carpeta backend y un .gitignore en la raíz.

---

**Cursor**

Actuaré como tutora: no correré comandos ni tocaré archivos. Primero reviso lo que ya hay en el repo y la documentación actual de FastAPI y Vite, y te doy un solo paso.

Perfecto: yo no ejecuto nada ni toco archivos. Tú corres, me dices cómo fue, y pasamos al siguiente.

**Contexto breve:** FastAPI sigue recomendando instalar `fastapi[standard]` (incluye Uvicorn y el CLI) y arrancar con `fastapi dev`. Vite sigue scaffoldando React + TypeScript con `npm create vite@latest … -- --template react-ts`. Eso lo usaremos más adelante. Hoy el primer objetivo es el entorno de Python, aislado, dentro de `backend/`.

En tu repo **ya existe** `backend/.venv` (un entorno virtual de Python 3.13). No lo vuelvas a crear; si lo recreas, PowerShell puede quejarse porque la carpeta no está vacía.

---

## Paso 1 — Entrar a `backend/` y activar el entorno virtual

Abre PowerShell y corre **estos tres comandos, en este orden**:

```powershell
cd C:\Users\esmer\gestor-skills-ia\backend
.\.venv\Scripts\Activate.ps1
python --version
```

### Qué hace cada uno

1. **`cd …\backend`**  
   Te coloca en la carpeta del API. El entorno virtual vive ahí, no en la raíz del repo.

2. **`.\.venv\Scripts\Activate.ps1`**  
   Activa ese entorno. A partir de ahora, `python` (y `python -m pip`) apuntan al Python **de este proyecto**, no al de Windows. Así las librerías de FastAPI no se mezclan con las del sistema: es simple, suficiente para el MVP y fácil de defender en clase.

3. **`python --version`**  
   Comprueba que estás usando Python 3.13 dentro del venv.

### Si sale bien, deberías ver

- En el prompt, un prefijo parecido a `(.venv)` al inicio de la línea.
- Algo como: `Python 3.13.16`

Si `Activate.ps1` falla con un error de **política de ejecución**, no sigas instalando paquetes. Copia el mensaje y dímelo; hay un ajuste de una línea (solo para tu usuario) y lo vemos juntos.

### Archivos que ya están (no crees nada nuevo en este paso)

| Qué | Para qué |
|-----|----------|
| `backend/` | Carpeta del API. Separada de `frontend/` para que Python y Node no se pisen. |
| `backend/.venv/` | Entorno virtual: Python + pip propios del proyecto. **No se sube a git** (ya está en `.gitignore`). |
| `.gitignore` (raíz) | Evita commitear `.venv/`, `node_modules/`, bases `.db` y `.env`. |

Cuando esto funcione, responde **“terminado”** (y pega `python --version` si quieres). El **paso 2** será instalar FastAPI y SQLAlchemy con `python -m pip`.

---

**User**

Ya hice estos pasos por mi cuenta: creé el .gitignore en la raíz, la carpeta backend y el entorno virtual .venv con Python 3.13 dentro de backend. Continúa desde ahí, un paso a la vez

---

**Cursor**

Reviso el estado de tu terminal para no repetir lo que ya hiciste y darte el siguiente paso exacto.

El entorno ya está creado. El siguiente paso es **activarlo e instalar las librerías**. Aún no creamos `main.py` ni el frontend.

---

## Paso 2 — Activar el venv e instalar FastAPI y SQLAlchemy

En PowerShell, asegúrate de estar en `backend` (tu prompt ya debería decir `…\gestor-skills-ia\backend`). Luego corre:

```powershell
.\.venv\Scripts\Activate.ps1
python -m pip install "fastapi[standard]" sqlalchemy
```

### Qué hace

1. **`Activate.ps1`**  
   Enciende el entorno. Debería aparecer `(.venv)` al inicio del prompt. Desde ahí, `python` es el de este proyecto.

2. **`python -m pip install …`**  
   Instala paquetes **dentro** de `.venv`. Usamos `python -m pip` porque en tu máquina no hay un `pip` suelto.

   Las comillas en `"fastapi[standard]"` son importantes en PowerShell: sin ellas, `[standard]` se interpreta como un comodín y el comando falla.

   - **`fastapi[standard]`**: lo que recomienda la [documentación oficial](https://fastapi.tiangolo.com/). Incluye FastAPI, Uvicorn (el servidor) y el comando `fastapi`. Extra `standard` = lo mínimo para desarrollar y arrancar, sin añadir auth ni otras features.
   - **`sqlalchemy`**: el ORM que usaremos con SQLite. Lo instalamos ya para dejar el stack listo; **todavía no escribimos modelos ni conectamos la base**.

### Si sale bien, deberías ver

- `(.venv)` en el prompt.
- Una lista de paquetes descargándose y al final algo como `Successfully installed fastapi-… uvicorn-… sqlalchemy-…` (los números de versión pueden variar).
- El comando termina sin error rojo; vuelves al prompt.

Para confirmar, corre:

```powershell
python -m pip show fastapi uvicorn sqlalchemy
```

Deberías ver tres bloques con `Name`, `Version` y `Location` apuntando a `…\backend\.venv\Lib\site-packages`.

### Archivos que se crean

Ninguno que vayamos a commitear. pip escribe dentro de `.venv/` (ya ignorado por git). El listado reproducible (`requirements.txt`) lo hacemos **después**, cuando el backend arranque.

Si `Activate.ps1` se queja de política de ejecución, pega el error y lo resolvemos antes de instalar.

Cuando termines, escribe **terminado** (o el error si aparece). El paso 3 será crear `main.py` con el endpoint `/health`.

---

**User**

Para qué sirve Uvicorn y por qué fastapi[standard] lo incluye?

---

**Cursor**

**Uvicorn es el programa que mantiene la API escuchando en una dirección** (por ejemplo `http://127.0.0.1:8000`) y le pasa cada petición HTTP a tu código FastAPI.

FastAPI **no es un servidor**. Tú escribes rutas (`/health`, más adelante `/projects`, etc.). Eso es una aplicación **ASGI**: un contrato de Python que dice “cuando llegue una petición, llama a esta función”. Hace falta otro proceso que:

1. abra el puerto,
2. hable HTTP,
3. invoque tu `app`.

Ese proceso es Uvicorn. Por eso en la [documentación](https://fastapi.tiangolo.com/) el arranque real es Uvicorn (o el comando `fastapi dev`, que por debajo usa Uvicorn).

**Por qué `fastapi[standard]` lo incluye:** el extra `[standard]` es el conjunto de dependencias que FastAPI considera “para desarrollar y servir de verdad”, no solo el paquete mínimo. Ahí van, entre otras:

- **Uvicorn** — para poder abrir el servidor sin instalarlo a mano  
- **el CLI `fastapi`** — para `fastapi dev` / `fastapi run`

Sin `[standard]` podrías instalar solo `fastapi` y tendrías el framework, pero **no podrías arrancar** hasta añadir Uvicorn (u otro servidor ASGI). Para el MVP, `[standard]` evita esa pieza suelta: un install y ya puedes servir el `/health`.

Analogía corta: FastAPI es el menú y la cocina; Uvicorn es quien abre el local y atiende la puerta.

Cuando hayas terminado el paso 2 (`Activate.ps1` + `python -m pip install …`), dime **terminado** y seguimos con `main.py` y `/health`.

---

**User**

Osea Uvicorn es como el puente con la api y el puerto?

---

**Cursor**

Sí. Esa idea es correcta.

**Uvicorn** es quien:

- abre el **puerto** (8000, por ejemplo),
- recibe las peticiones HTTP del navegador o de React,
- se las entrega a tu **app FastAPI**,
- y devuelve la respuesta al cliente.

FastAPI define *qué* hace cada ruta (`/health` → `{ "status": "ok" }`). Uvicorn es *quién está escuchando* en esa dirección y hace de puente entre HTTP y tu código Python.

Cuando el paso 2 esté listo, dime **terminado** y armamos `main.py`.

---

**User**

Terminado: activé el entorno, instalé fastapi[standard] y sqlalchemy, y verifiqué con pip show. ¿Cuál es el siguiente paso?

---

**Cursor**

Siguiente: **crear la aplicación FastAPI mínima**, todavía sin arrancar el servidor. SQLAlchemy sigue instalado y sin usar: nada de modelos ni base de datos.

---

## Paso 3 — Crear `backend/main.py` con `/health`

En Cursor, crea el archivo **`backend/main.py`** (al mismo nivel que `.venv`, no dentro de `.venv`) y pega exactamente esto:

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
def health():
    return {"status": "ok"}
```

Guarda el archivo.

### Qué hace cada parte

- **`from fastapi import FastAPI`**  
  Trae la clase con la que defines la API.

- **`app = FastAPI()`**  
  Crea la aplicación. Ese objeto `app` es el que Uvicorn va a cargar después (`main:app` = “módulo `main`, variable `app`”).

- **`@app.get("/health")`**  
  Declara una **ruta GET**. Cuando alguien pida `http://127.0.0.1:8000/health`, se ejecuta la función de abajo. GET = “solo leer, no cambiar datos”. Encaja con un chequeo de “¿estás viva?”.

- **`def health():`**  
  La función que atiende esa ruta. El nombre puede ser el que quieras; lo que importa es el path `/health`.

- **`return {"status": "ok"}`**  
  FastAPI convierte el diccionario a JSON. El cliente verá `{"status":"ok"}`.

No hace falta `async` aquí: la [documentación](https://fastapi.tiangolo.com/tutorial/first-steps/) permite funciones normales; `async` entra cuando hay I/O concurrente de verdad.

### Si sale bien, deberías ver

- En el explorador: `backend/main.py` (junto a `backend/.venv`).
- El archivo guardado, sin errores de sintaxis (puntos rojos en el editor).

### Para qué sirve este archivo

| Archivo | Para qué |
|---------|----------|
| `backend/main.py` | Punto de entrada del API. Hoy solo `/health`; más adelante aquí (o en módulos que importes) vivirán proyectos, skills y kanban. |

Aún **no** ejecutes `fastapi dev`. Eso es el paso 4, para que separes “escribir la app” de “levantar Uvicorn”.

Cuando el archivo esté creado y guardado, escribe **terminado**.

---

**User**

si quedo bien creado el archivo?

---

**Cursor**

**No: el archivo está en el lugar incorrecto.** Lo creaste **dentro** de `.venv`, y además está vacío.

En el explorador se ve así:

`backend` → `.venv` → `main.py`

Tiene que quedar así:

`backend` → `main.py` (al lado de `.venv`, **no** dentro)

`.venv` es el entorno virtual (Python, pip, librerías). Git lo ignora. Si dejas `main.py` ahí, FastAPI no lo encontrará al arrancar desde `backend/`, y tu código quedaría mezclado con archivos que no se versionan.

También aparece `pyvenv.cfg` dentro de `.venv`: **ese sí va ahí**. Lo crea Python al hacer el venv; no lo muevas ni lo borres.

---

### Cómo corregirlo

1. Cierra la pestaña de `main.py` si está abierta.
2. En el explorador, **borra** `backend/.venv/main.py` (solo ese archivo, no la carpeta `.venv`).
3. Clic derecho en la carpeta **`backend`** (la que contiene `.venv`, no `.venv` misma) → **New File** → nómbralo `main.py`.
4. Pega el código y guarda:

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
def health():
    return {"status": "ok"}
```

### Si quedó bien

- Ruta en Cursor: `gestor-skills-ia/backend/main.py` (sin `.venv` en medio).
- El archivo tiene esas ~7 líneas, no está en blanco.
- `.venv` sigue teniendo `Include`, `Lib`, `Scripts` y `pyvenv.cfg`, **sin** tu `main.py`.

Cuando lo veas así, escribe **terminado**.

---

**User**

listo, ya tengo el archivo creado y guardado, ahora que sigue 

---

**Cursor**

El `main.py` bueno ya está en `backend/`. Antes de arrancar, borra el **sobrante vacío** `backend/.venv/main.py` (clic derecho → Delete). Ese no es tu código; si se queda ahí solo confunde.

---

## Paso 4 — Arrancar el servidor y probar `/health`

En PowerShell, con el venv **activado** (`(.venv)` en el prompt) y estando en `backend`:

```powershell
cd C:\Users\esmer\gestor-skills-ia\backend
fastapi dev
```

Si `fastapi` no se reconoce, usa el equivalente:

```powershell
python -m fastapi dev
```

**Deja esa terminal abierta.** El servidor se queda escuchando; no cierres la ventana ni pulses Ctrl+C hasta que hayamos comprobado la ruta.

### Qué hace

`fastapi dev` (documentación oficial) busca `main.py`, carga el objeto `app` y arranca **Uvicorn** con recarga automática: si cambias el código, reinicia solo. Es el modo desarrollo; en producción se usaría `fastapi run`.

### Si sale bien, en la terminal deberías ver

Algo parecido a:

- `Serving at: http://127.0.0.1:8000`
- `API docs: http://127.0.0.1:8000/docs`
- `Uvicorn running on http://127.0.0.1:8000`

### Compruébalo en el navegador

1. Abre [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)  
   Deberías ver: `{"status":"ok"}`

2. Abre [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)  
   Es la documentación interactiva (Swagger) que FastAPI genera solo. Debería listar `GET /health`. Por eso elegimos FastAPI para el MVP: la API se documenta sin trabajo extra.

La raíz `http://127.0.0.1:8000/` puede dar `{"detail":"Not Found"}`: es normal, no definimos `/`, solo `/health`.

Cuando `/health` muestre `{"status":"ok"}`, escribe **terminado**. El servidor puede seguir corriendo; el paso 5 será congelar dependencias en `requirements.txt` (en **otra** terminal, o paramos y lo hacemos después).

---

**User**

terminado, ahora que sigue 

---

**Cursor**

El API ya responde. Siguiente pieza del backend: **dejar por escrito qué librerías hace falta instalar**, para que en otro PC (o el de tu compañera) no dependan de “acordarse de los pip install”.

El servidor puede seguir en esa terminal. Este paso es un archivo nuevo; no hace falta parar `fastapi dev`.

Sigue ahí el `backend/.venv/main.py` vacío. Bórralo cuando puedas; no entra en git, pero no debe estar.

---

## Paso 5 — Crear `backend/requirements.txt`

En Cursor, crea **`backend/requirements.txt`** (junto a `main.py`, no dentro de `.venv`) con exactamente esto:

```
fastapi[standard]
sqlalchemy
```

Guarda.

### Qué es y por qué así

`requirements.txt` es la lista de dependencias del backend. En otro entorno se instala con:

```powershell
python -m pip install -r requirements.txt
```

No usamos `pip freeze` (ese comando vuelca **todas** las librerías internas: decenas de paquetes). Para el MVP basta con lo que **nosotros** elegimos; pip resuelve el resto. Es más fácil de leer y de defender en clase.

Los corchetes `[standard]` son el mismo extra de antes: FastAPI + Uvicorn + CLI.

### Si sale bien

- En el explorador: `backend/requirements.txt` al lado de `backend/main.py`.
- Dos líneas, sin rutas raras ni `.venv` en el medio.

| Archivo | Para qué |
|---------|----------|
| `backend/requirements.txt` | Receta de instalación del API. Se **sí** sube a git. `.venv` no. |

Cuando esté guardado, escribe **terminado**. El paso 6 será crear `frontend/` con Vite + React + TypeScript.

---

**User**

Terminado: eliminé el main.py sobrante dentro de .venv y creé backend/requirements.txt escribiéndolo a mano. ¿Cuál es el siguiente paso?

---

**Cursor**

El backend ya está listo como esqueleto. Ahora el **frontend**, en **otra terminal**: la actual sigue ocupada por `fastapi dev` y no hay que pararlo.

---

## Paso 6 — Crear `frontend/` con Vite + React + TypeScript

Abre una **terminal nueva** en PowerShell y corre:

```powershell
cd C:\Users\esmer\gestor-skills-ia
npm create vite@latest frontend -- --template react-ts
```

No crees la carpeta `frontend` a mano: el comando la genera.

### Qué hace

Según la [guía de Vite](https://vite.dev/guide/):

- **`npm create vite@latest`** descarga la última plantilla oficial.
- **`frontend`** es el nombre de la carpeta (junto a `backend/`, no dentro).
- **`--`** en npm 7+ (el de Node 22) pasa las opciones al generador, no a npm.
- **`--template react-ts`** = React + TypeScript, sin React Compiler ni extras. Suficiente para el MVP: Vite sirve el front en caliente y TypeScript atrapa errores de tipos.

Puede pedir confirmación (`Need to install the following packages: create-vite`). Acepta con `y`.

Si pregunta si **instala dependencias y arranca ahora**, elige **No**. El `npm install` lo hacemos en el siguiente paso, a propósito.

### Si sale bien

- Mensaje tipo `Scaffolding project in …\frontend`.
- En el explorador, carpeta `frontend/` al mismo nivel que `backend/` y `docs/`.

Archivos que crea Vite (los que importan ahora):

| Archivo | Para qué |
|---------|----------|
| `frontend/package.json` | Nombre del front, scripts (`dev`, `build`) y dependencias. Equivalente “Node” de `requirements.txt`. |
| `frontend/vite.config.ts` | Configuración de Vite (puerto, plugins de React). |
| `frontend/tsconfig.json` (y relacionados) | Reglas de TypeScript. |
| `frontend/index.html` | Página que el navegador carga; Vite la usa como entrada (no está “escondida” en `public`). |
| `frontend/src/main.tsx` | Arranque de React: monta la app en el HTML. |
| `frontend/src/App.tsx` | Componente de ejemplo de la plantilla. **No lo conviertas en pantallas del gestor todavía.** |
| `frontend/public/` | Archivos estáticos (favicon, etc.). |

`node_modules/` **aún no** debería existir (o casi vacío) si dijiste que no instalara. Eso es correcto.

Cuando veas `frontend/` con esos archivos, escribe **terminado**.

---

**User**

terminado 

---

**Cursor**

El comando de Vite sigue activo en tu terminal; miro la salida para ver si quedó un menú pendiente o si ya terminó el scaffold.

El scaffold salió bien. En el asistente de Vite elegiste **instalar y arrancar ahora**, así que el `npm install` ya está hecho y el servidor de desarrollo está corriendo. No hace falta repetirlo.

En la terminal deberías ver `VITE v8.3.4 ready` y `Local: http://localhost:5173/`. Déjala abierta, igual que la de FastAPI.

---

## Paso 7 — Comprobar el front en el navegador

Abre [http://localhost:5173/](http://localhost:5173/).

### Qué estás viendo

Vite sirve el React de plantilla. **No es el gestor de skills todavía**: logos, contador o texto de Vite/React. Solo confirma que Node, Vite y TypeScript arrancan.

Tienes **dos procesos** (es el contra de D1, el stack en dos carpetas):

| Proceso | Dirección | Para qué |
|---------|-----------|----------|
| `fastapi dev` | http://127.0.0.1:8000/health | API |
| `npm run dev` (Vite) | http://localhost:5173/ | Interfaz |

Aún **no** los conectamos (eso sería CORS y `fetch` al `/health`; queda para un paso posterior, cuando haya pantallas).

### Si sale bien

- La página carga sin pantalla en blanco ni error de conexión.
- En la terminal de Vite no aparece un stack trace rojo.

Si el navegador no abre, dime qué ves (página en blanco, “no se puede acceder”, otro puerto).

Cuando la plantilla cargue, escribe **terminado**. Con eso el esqueleto del paso 1 queda cerrado: backend con `/health` y frontend Vite+React+TS, sin modelos ni pantallas del MVP.

---

**User**

terminado, ahora que paso sigue?

---

**Cursor**

El esqueleto ya está. Reviso el plan del proyecto para decirte el siguiente paso real, no inventar uno.

El **paso 1 del plan** (esqueleto, sin features) ya está cerrado.

Tienes:

- `backend/`: venv, FastAPI, SQLAlchemy instalado, `/health`, `requirements.txt`
- `frontend/`: Vite + React + TypeScript, plantilla en http://localhost:5173/
- Dos servidores distintos; **aún no** se hablan entre sí

No hace falta más `pip` ni `npm` de setup.

---

## Qué sigue ahora (cierre, no código)

Antes de modelos y CRUD, **anota la bitácora**. En tu repo ya hay capturas `entrada2-pregunta-uvicorn`; encaja con esta sesión.

Abre `docs/bitacora.md` y **añade al final** (no borres la Entrada 1) algo como esto; ajústalo si quieres:

```markdown
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
```

Guarda. Esa entrada es la evidencia de clase de este paso.

Los servidores pueden seguir abiertos o los paras con **Ctrl+C** en cada terminal; no se pierde código.

Cuando la bitácora esté, escribe **terminado**. El **paso 2 del plan** sería conectar SQLAlchemy a SQLite y crear los modelos (`Project`, `Skill`, `SkillVersion`, `KanbanColumn`, `Task`), todavía sin CRUD completo en pantalla. Si prefieres saltar la bitácora e ir directo a modelos, dímelo.

---

**User**

Explícame qué hizo npm install, qué es la carpeta node_modules y qué archivos creó Vite dentro de frontend/ (package.json, vite.config.ts, src/, etc.). ¿Para qué sirve cada uno?

---

**Cursor**

Reviso los archivos reales de tu `frontend/` para explicarte exactamente lo que Vite te dejó, no una plantilla genérica.

Piensa el front como el backend, pero con Node:

| Backend | Frontend |
|---------|----------|
| `requirements.txt` | `package.json` (+ `package-lock.json`) |
| `python -m pip install` | `npm install` |
| `.venv/` | `node_modules/` |

---

## Qué hizo `npm install`

Leyó `package.json` (qué librerías quieres) y `package-lock.json` (versiones exactas) y **descargó el código** de React, Vite, TypeScript, ESLint, etc. a `node_modules/`.

En tu caso lo hizo el asistente de Vite cuando dijiste que sí a “Install with npm and start now”. Por eso no tuviste que correr `npm install` a mano.

No “crea la app”: solo trae las herramientas. El código tuyo (o de la plantilla) está en `src/` e `index.html`.

---

## Qué es `node_modules/`

Es la carpeta gorda con **todas las librerías y las librerías de esas librerías**. Miles de archivos. No se edita a mano y **no se sube a git** (tu `.gitignore` de la raíz y el de `frontend/` ya la ignoran).

Si la borramos, el proyecto no se rompe: con `npm install` se reconstruye. Igual que borrar `.venv` y volver a instalar con `requirements.txt`.

---

## Archivos que Vite dejó en `frontend/`

### Manifiesto e instalación

**`package.json`**  
La receta del front. Aquí está:

- `"type": "module"` — JavaScript moderno (`import`/`export`).
- **`scripts`**: atajos. `npm run dev` ejecuta Vite; `build` compila TypeScript y genera la carpeta `dist/` para producción; `lint` corre ESLint; `preview` sirve ese build.
- **`dependencies`**: lo que la app necesita en el navegador (`react`, `react-dom`).
- **`devDependencies`**: herramientas de desarrollo (Vite, TypeScript, ESLint, tipos). El usuario final no las “usa”; tú sí, para programar.

**`package-lock.json`**  
Lista **exacta** de versiones que npm instaló. Para que en el PC de tu compañera salga lo mismo. Se **sí** commitea. No lo edites a mano.

### Cómo arranca Vite

**`vite.config.ts`**  
Configuración de Vite. La tuya es mínima: el plugin `@vitejs/plugin-react` para que entienda JSX y recargue el navegador al guardar. Más adelante, si el front llama al API, aquí se puede poner un *proxy* o CORS no hace falta en Vite del mismo modo; CORS vive en FastAPI. Por ahora no toques esto.

**`index.html`** (en la raíz de `frontend/`, no dentro de `src/`)  
La página que el navegador pide. Vite la trata como **entrada**. Lo importante:

- `<div id="root"></div>` — hueco donde React pinta la UI.
- `<script type="module" src="/src/main.tsx">` — Vite carga TypeScript desde ahí.

**`public/`**  
Archivos estáticos tal cual (`favicon.svg`, `icons.svg`). URL `/favicon.svg` = `public/favicon.svg`. No pasan por el compilador de React.

### Tu código React

**`src/`** — el código de la interfaz.

| Archivo | Para qué |
|---------|----------|
| `src/main.tsx` | Arranque: toma `#root`, monta `<App />`. `StrictMode` es un aviso extra de React en desarrollo (detecta malos hábitos); no es una pantalla. |
| `src/App.tsx` | Componente de ejemplo (logos, texto de Vite). **Aún no es el gestor.** Aquí (o en componentes que importes) vivirán proyectos, skills y kanban. |
| `src/App.css`, `src/index.css` | Estilos de la plantilla. |
| `src/assets/` | Imágenes/SVG que importas desde el código (`hero.png`, logos). Vite les pone URL al empaquetar. Distinto de `public/`: estos sí se procesan si los importas. |

### TypeScript y calidad

**`tsconfig.json`**  
Archivo “índice”: no configura mucho; apunta a otros dos.

**`tsconfig.app.json`**  
Reglas de TypeScript para **tu app** (`src/`).

**`tsconfig.node.json`**  
Reglas para archivos de herramientas (`vite.config.ts`). Se separan porque el navegador y Node no son el mismo entorno.

**`eslint.config.js`**  
ESLint: avisa de código raro o hooks de React mal usados. Lo pediste al crear el proyecto (elegiste ESLint). No es obligatorio para que arranque; ayuda en clase y en el día a día.

### Otros

**`frontend/.gitignore`**  
Otro ignore (logs, `node_modules`, `dist`). El de la **raíz** del repo ya cubre lo importante; este vino con la plantilla. Puedes dejarlo.

**`README.md`**  
Instrucciones genéricas de Vite (`npm run dev`, etc.). No es la bitácora del curso; esa sigue en `docs/`.

**`dist/`**  
Aún no debería existir. Aparece cuando corras `npm run build`: HTML/JS/CSS listos para un servidor estático. En desarrollo usas `npm run dev`, no `dist/`.

---

Resumen para defender en clase: **Vite no es React**. Vite es el servidor/empaquetador (análogo grosero a Uvicorn + un compilador). React es la librería de UI. `package.json` declara las piezas; `npm install` las baja a `node_modules`; `src/` es lo que ustedes van a cambiar.

Cuando quieras, seguimos con la **bitácora** o con el **paso 2 (modelos SQLAlchemy + SQLite)**.

---

**User**

ya actualice la bitacora, ahora que sigue 

---

**Cursor**

La bitácora quedó bien. Empieza el **paso 2 del plan: base de datos**, todavía **sin tablas ni CRUD**. Solo el “enchufe” a SQLite.

Nota corta: la [doc actual de FastAPI](https://fastapi.tiangolo.com/tutorial/sql-databases/) enseña **SQLModel**. Ustedes ya eligieron **SQLAlchemy** (D1) y lo instalaron; no cambiamos de librería. El patrón es el mismo: motor + sesión por petición.

---

## Paso 8 — Crear `backend/database.py`

En Cursor, crea **`backend/database.py`** (junto a `main.py`, no dentro de `.venv`) y pega:

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = "sqlite:///./gestor.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

Guarda. **No** hace falta cambiar `main.py` todavía ni parar el servidor.

### Qué hace cada pieza

- **`DATABASE_URL = "sqlite:///./gestor.db"`**  
  SQLite = un archivo, sin instalar un servidor de base de datos. Suficiente para el MVP y fácil de defender. `./gestor.db` se crea en la carpeta desde la que corres `fastapi dev` (normalmente `backend/`). Ya está cubierto por `*.db` en el `.gitignore`.

- **`engine`**  
  El puente SQLAlchemy ↔ archivo SQLite (análogo grosero: Uvicorn es HTTP; el engine es SQL). Hay **uno** para toda la app.

- **`connect_args={"check_same_thread": False}`**  
  SQLite, por defecto, no deja usar la conexión desde otro hilo. FastAPI puede usar más de un hilo en una petición. Este flag lo permite; la seguridad la da usar **una sesión por request**, no una sesión global.

- **`SessionLocal`**  
  Fábrica de sesiones. Una sesión = “unidad de trabajo” (consultas y `commit`). No es la base; es el objeto con el que hablas a la base en un request.

- **`class Base(DeclarativeBase)`**  
  Clase madre de los modelos (`Project`, `Skill`, …). SQLAlchemy 2 usa esto en lugar del `declarative_base()` viejo. Hoy está vacía a propósito.

- **`get_db()`**  
  Dependencia de FastAPI: abre sesión, la presta al endpoint (`yield`), y en el `finally` la cierra aunque haya error. Aún no la usamos en `/health`.

### Si sale bien

- En el explorador: `backend/database.py` al lado de `main.py` y `requirements.txt`.
- El archivo tiene ese código, sin `gestor.db` todavía (el archivo `.db` aparece cuando creemos tablas).

| Archivo | Para qué |
|---------|----------|
| `backend/database.py` | Conexión y sesiones. Los modelos y las rutas lo importarán. |

Cuando esté guardado, escribe **terminado**. El paso siguiente será **definir los 5 modelos**, según D2–D4 (tarea solo con `skill_version_id`, versión vigente = número más alto, skill en texto).

---

**User**

terminado 

---

**Cursor**

`database.py` es solo el enchufe. Ahora las **tablas en código**: los 5 modelos del plan, alineados con D2–D4. Aún **no** se crea el archivo `.db` ni hay endpoints CRUD.

---

## Paso 9 — Crear `backend/models.py`

Crea **`backend/models.py`** (junto a `database.py`) y pega todo esto:

```python
from sqlalchemy import ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text, default="")

    skills: Mapped[list["Skill"]] = relationship(back_populates="project")
    columns: Mapped[list["KanbanColumn"]] = relationship(back_populates="project")
    tasks: Mapped[list["Task"]] = relationship(back_populates="project")


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    name: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text, default="")

    project: Mapped["Project"] = relationship(back_populates="skills")
    versions: Mapped[list["SkillVersion"]] = relationship(back_populates="skill")


class SkillVersion(Base):
    __tablename__ = "skill_versions"
    __table_args__ = (UniqueConstraint("skill_id", "number"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id"))
    number: Mapped[int] = mapped_column(Integer)
    content: Mapped[str] = mapped_column(Text, default="")

    skill: Mapped["Skill"] = relationship(back_populates="versions")
    tasks: Mapped[list["Task"]] = relationship(back_populates="skill_version")


class KanbanColumn(Base):
    __tablename__ = "kanban_columns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    name: Mapped[str] = mapped_column(String(100))
    position: Mapped[int] = mapped_column(Integer, default=0)

    project: Mapped["Project"] = relationship(back_populates="columns")
    tasks: Mapped[list["Task"]] = relationship(back_populates="column")


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    column_id: Mapped[int] = mapped_column(ForeignKey("kanban_columns.id"))
    skill_version_id: Mapped[int | None] = mapped_column(
        ForeignKey("skill_versions.id"),
        nullable=True,
    )
    title: Mapped[str] = mapped_column(String(200))
    position: Mapped[int] = mapped_column(Integer, default=0)

    project: Mapped["Project"] = relationship(back_populates="tasks")
    column: Mapped["KanbanColumn"] = relationship(back_populates="tasks")
    skill_version: Mapped["SkillVersion | None"] = relationship(back_populates="tasks")
```

Guarda. No toques `main.py` todavía.

### Por qué así (decisiones)

- **`Project`** agrupa skills, columnas y tareas. Un tablero vive dentro de un proyecto.
- **`Skill`**: nombre y descripción (D4). **No** guarda el prompt/contenido: eso cambia con cada versión.
- **`SkillVersion`**: `number` + `content`. **No** hay `is_current` (D3): la vigente será `MAX(number)` en consultas, más adelante. `UniqueConstraint("skill_id", "number")` evita dos “v3” del mismo skill.
- **`KanbanColumn`**: nombre + `position` (orden de izquierda a derecha).
- **`Task`**: está en un proyecto y en una columna. **`skill_version_id` opcional** (D2): el skill se deduce por `task.skill_version.skill`. No duplicamos `skill_id`.
- **`position` en Task**: orden de tarjetas dentro de la columna (para no perderlo al mover, que era un riesgo típico del kanban).

`Mapped[...]` y `mapped_column` son SQLAlchemy 2: el tipo de Python y el de SQL van juntos; TypeScript en el front hará algo parecido con interfaces, más adelante.

`relationship` / `back_populates` no son columnas extra: son atajos en Python (`proyecto.skills` en lugar de un `JOIN` a mano).

### Si sale bien

- `backend/models.py` junto a `database.py`.
- Sin archivo `gestor.db` todavía (eso es el paso siguiente: `create_all`).
- El editor no debería marcar error en `from database import Base` si abres el archivo con Cursor usando el venv de `backend`.

| Archivo | Para qué |
|---------|----------|
| `backend/models.py` | Forma de las tablas. SQLAlchemy las usará para crear SQLite y para leer/escribir filas. |

Cuando esté guardado, escribe **terminado**. El paso 10 será **crear las tablas al arrancar** (`Base.metadata.create_all`) y comprobar que aparece `gestor.db`.

---

**User**

terminado

---

**Cursor**

Los modelos son el plano. Ahora hay que **decir a SQLAlchemy que construya las tablas** en SQLite al arrancar.

---

## Paso 10 — Crear las tablas al iniciar y comprobar `gestor.db`

Sustituye **`backend/main.py`** por esto (deja `/health`):

```python
from contextlib import asynccontextmanager

from fastapi import FastAPI

from database import Base, engine
import models  # registra las tablas en Base.metadata

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/health")
def health():
    return {"status": "ok"}
```

Guarda.

### Qué hace

- **`import models`**  
  Obligatorio. Si no importas los modelos, `Base` no “conoce” las clases y `create_all` no crea las 5 tablas. El comentario lo recuerda; no usamos `models` en otra línea a propósito.

- **`lifespan`**  
  Código que corre al **arrancar** (antes del `yield`) y al **apagar** (después; aquí no hay nada). Es lo que recomienda FastAPI ahora, frente al `@app.on_event("startup")` antiguo.

- **`Base.metadata.create_all(bind=engine)`**  
  “Si la tabla no existe, créala.” No borra datos. Para el MVP evita Alembic (migraciones): suficiente y fácil de defender. Límite: si **cambias** una columna después, SQLite no se actualiza solo; eso se vería más adelante.

### Cómo comprobarlo

1. Estás en `backend/` con el venv activado.
2. Si `fastapi dev` sigue corriendo, al guardar debería recargar. Si no, arráncalo otra vez: `fastapi dev`.
3. En el explorador, en **`backend/`**, debería aparecer **`gestor.db`**.
4. [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health) sigue mostrando `{"status":"ok"}`.

`gestor.db` es el archivo SQLite. No lo abras como texto (es binario). No se sube a git (`*.db` en `.gitignore`).

### Si no ves `gestor.db`

- Mira si estás viendo `backend/` y no `.venv`.
- El archivo nace en el directorio de trabajo de `fastapi dev`. Tiene que ser `backend/`.
- Si hay error en la terminal al recargar, cópialo y lo vemos.

Cuando exista `gestor.db` y `/health` responda, escribe **terminado**. El siguiente paso del plan sería el **CRUD de proyectos** en la API (todavía sin pantallas React).

---

**User**

listo, health responde ok y gestor aparece 

---

**Cursor**

Las tablas existen. Siguiente: **contrato de la API de proyectos**, todavía sin rutas. FastAPI valida entrada/salida con **Pydantic**; SQLAlchemy es la base. Son dos capas a propósito: fácil de explicar en clase.

---

## Paso 11 — Crear `backend/schemas.py` (solo proyectos)

Crea **`backend/schemas.py`** junto a `models.py` y pega:

```python
from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: str = ""


class ProjectUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: str = ""


class ProjectRead(BaseModel):
    id: int
    name: str
    description: str

    model_config = {"from_attributes": True}
```

Guarda. No cambies `main.py` aún.

### Para qué cada clase

- **`ProjectCreate`** — cuerpo JSON al **crear** (`POST`). No lleva `id`: lo asigna SQLite.
- **`ProjectUpdate`** — cuerpo al **editar** (`PUT`). Mismos campos editables; el `id` va en la URL (`/projects/3`).
- **`ProjectRead`** — lo que **devolvemos**. Incluye `id`.  
  `from_attributes = True` permite `ProjectRead.model_validate(fila_sqlalchemy)`: Pydantic lee `.id`, `.name` del objeto ORM.

`Field(min_length=1)` rechaza nombre vacío **antes** de tocar la base. Eso es validación de API, no de SQLAlchemy.

Skills, versiones, columnas y tareas **aún no**: un recurso a la vez, el más simple primero (proyecto no depende de los demás).

### Si sale bien

- `backend/schemas.py` al lado de `models.py`.
- `/health` sigue igual (no tocamos rutas).

| Archivo | Para qué |
|---------|----------|
| `backend/schemas.py` | Forma del JSON (entrada y salida). `models.py` es la tabla; este archivo es lo que ve el cliente. |

Cuando esté guardado, escribe **terminado**. El paso 12 serán los endpoints `POST/GET/PUT/DELETE /projects`.

---

**User**

terminado 

---

**Cursor**

Los schemas ya definen el JSON. Ahora las **rutas** que leen y escriben la tabla `projects`.

---

## Paso 12 — CRUD de proyectos en `main.py`

Sustituye **`backend/main.py`** por esto:

```python
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import Base, engine, get_db
import models
from models import Project
from schemas import ProjectCreate, ProjectRead, ProjectUpdate


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/projects", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    project = Project(name=payload.name, description=payload.description)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@app.get("/projects", response_model=list[ProjectRead])
def list_projects(db: Session = Depends(get_db)):
    return db.scalars(select(Project).order_by(Project.id)).all()


@app.get("/projects/{project_id}", response_model=ProjectRead)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return project


@app.put("/projects/{project_id}", response_model=ProjectRead)
def update_project(project_id: int, payload: ProjectUpdate, db: Session = Depends(get_db)):
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    project.name = payload.name
    project.description = payload.description
    db.commit()
    db.refresh(project)
    return project


@app.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    db.delete(project)
    db.commit()
```

Guarda. Si `fastapi dev` está en marcha, recargará solo.

### Qué hace cada bloque

- **`Depends(get_db)`** — FastAPI llama a `get_db`, te pasa la sesión y la cierra al terminar. Una sesión por petición.
- **`db.add` + `commit` + `refresh`** — guarda, confirma en SQLite, recarga el `id` autogenerado.
- **`db.scalars(select(...)).all()`** — estilo SQLAlchemy 2 (no el `.query()` viejo).
- **`db.get(Project, id)`** — busca por clave primaria; si no hay fila, `None` → 404.
- **`response_model=ProjectRead`** — la respuesta se recorta al schema (no se filtran secretos hoy, pero el patrón queda).
- **`201` al crear, `204` al borrar** — convenciones HTTP: creado / sin cuerpo.

`import models` se queda para que `create_all` siga viendo las tablas.

### Cómo probarlo (sin React)

1. Abre [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).
2. Deberías ver `GET /health` y las rutas `/projects`.
3. En `POST /projects` → **Try it out** → body, por ejemplo:

```json
{
  "name": "MVP clase",
  "description": "Prueba"
}
```

Execute. Status **201** y un JSON con `"id": 1` (u otro número).

4. `GET /projects` debe listar ese proyecto.
5. `GET /projects/1` el mismo; un id que no exista → **404**.
6. `PUT` cambia nombre/descripción; `DELETE` y luego GET → 404.

`/health` sigue en `{"status":"ok"}`.

Si al guardar la terminal muestra un traceback, pégalo. Si `/docs` no lista `/projects`, el servidor no recargó: revisa que `fastapi dev` siga en `backend/`.

Cuando hayas creado un proyecto por `/docs` y lo hayas visto en el GET, escribe **terminado**. El siguiente paso sería listar/crear proyectos en el **frontend** (y entonces sí CORS), o seguir con CRUD de skills en la API. Tú eliges; lo más natural es **CORS + lista de proyectos en React**, para ver el circuito completo.

---

**User**

muestra esto 

---

**Cursor**

Eso es **exactamente** el éxito del `POST`.

- **201** = se creó un recurso nuevo  
- **`id: 1`** = SQLite asignó la clave primaria  
- **`name` / `description`** = lo que enviaste en el JSON, ya guardado en `gestor.db`  
- **`server: uvicorn`** = Uvicorn respondió HTTP; FastAPI armó el JSON con `ProjectRead`

Antes de pasar al front, en `/docs` corre **`GET /projects`**. Deberías ver un array:

```json
[
  {
    "id": 1,
    "name": "MVP clase",
    "description": "Prueba"
  }
]
```

Eso confirma listar, no solo crear.

---

## Paso 13 — Permitir que React llame al API (CORS)

El front vive en `http://localhost:5173` y el API en `http://127.0.0.1:8000`. El navegador bloquea esa mezcla si el API no lo autoriza. Es el contra de D1; se arregla en FastAPI, no en Vite.

En **`backend/main.py`**, deja los imports que ya tienes y **añade** al bloque de imports:

```python
from fastapi.middleware.cors import CORSMiddleware
```

Justo **después** de `app = FastAPI(lifespan=lifespan)` (y **antes** de `@app.get("/health")`), pega:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Guarda. El servidor recarga solo.

### Qué hace

**CORS** = el API declara: “acepto peticiones del origen `http://localhost:5173`”. Sin esto, `fetch("http://127.0.0.1:8000/projects")` desde React falla aunque `/docs` funcione (Swagger está en el mismo origen `:8000`).

Solo ese origen: el de Vite. No uses `*` en un trabajo de clase si puedes evitarlo; queda más claro.

### Si sale bien

- `/docs` y `GET /projects` siguen igual. CORS no cambia Swagger.
- En la terminal, recarga sin traceback.

Cuando hayas guardado (y, si puedes, visto el GET en `/docs`), escribe **terminado**. El paso 14 será que `App.tsx` liste esos proyectos.

---

**User**

terminado

---

**Cursor**

CORS ya está. Ahora el front deja la plantilla de Vite y **muestra los proyectos** que ya tienes en SQLite (`MVP clase`).

---

## Paso 14 — Listar proyectos en `App.tsx`

Sustituye **todo** `frontend/src/App.tsx` por esto:

```tsx
import { useEffect, useState } from 'react'

type Project = {
  id: number
  name: string
  description: string
}

const API = 'http://127.0.0.1:8000'

function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API}/projects`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        return res.json() as Promise<Project[]>
      })
      .then(setProjects)
      .catch((err: Error) => setError(err.message))
  }, [])

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '1.5rem' }}>
      <h1>Proyectos</h1>
      {error && <p>No se pudo cargar el API: {error}</p>}
      {!error && projects.length === 0 && <p>No hay proyectos todavía.</p>}
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <strong>{p.name}</strong>
            {p.description ? ` — ${p.description}` : ''}
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
```

Guarda. Vite recarga solo (HMR).

### Qué hace

- **`type Project`** — el mismo contrato que `ProjectRead` en Python. TypeScript avisa si usas un campo que no existe.
- **`useState`** — `projects` es la lista en memoria; `error` por si el API está caído.
- **`useEffect(..., [])`** — al montar la página, **una vez**, pide `GET /projects`. El `[]` evita un bucle infinito de fetches.
- **`fetch`** — el navegador llama a FastAPI. Gracias a CORS, `:5173` puede hablar con `:8000`.
- **`key={p.id}`** — React necesita un id estable por ítem de la lista.

No hay formulario de alta todavía: solo **leer**. Crear sigue en `/docs` por ahora.

### Qué debe estar corriendo

Dos terminales:

1. `backend/` → `fastapi dev` → `/health` ok  
2. `frontend/` → si Vite no está, `cd frontend` y `npm run dev`

Abre [http://localhost:5173/](http://localhost:5173/) (no el `:8000`).

### Si sale bien

- Ya no ves logos de Vite/React ni el contador.
- Título **Proyectos** y una viñeta: **MVP clase — Prueba**.

### Si falla

- Página en blanco o “No se pudo cargar”: el API no está arriba, o CORS no recargó. Mira la consola del navegador (F12 → Console).
- Lista vacía sin error: el GET funciona pero no hay filas (¿otra `gestor.db`?). Dime qué ves.

Cuando aparezca **MVP clase**, escribe **terminado**. El siguiente paso puede ser un **formulario para crear proyectos** desde React (POST), sin pasar por Swagger.

---

**User**

terminado

