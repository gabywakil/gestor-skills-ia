import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Project = { id: number; name: string; description: string }
type Skill = { id: number; project_id: number; name: string; description: string }
type SkillVersion = { id: number; skill_id: number; number: number; content: string }
type VersionOption = { id: number; skill_id: number; skill_name: string; number: number }
type Column = { id: number; project_id: number; name: string; position: number }
type Task = {
  id: number
  project_id: number
  column_id: number
  skill_version_id: number | null
  title: string
  position: number
}

const API = 'http://127.0.0.1:8000'

// Función única para hablar con el backend: lanza un error si algo sale mal.
async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: options?.body ? { 'Content-Type': 'application/json' } : undefined,
  })
  if (!res.ok) {
    throw new Error(`Error ${res.status} al llamar a ${path}`)
  }
  if (res.status === 204) {
    return undefined as T
  }
  return res.json() as Promise<T>
}

function App() {
  const [error, setError] = useState<string | null>(null)

  // Proyectos
  const [projects, setProjects] = useState<Project[]>([])
  const [selected, setSelected] = useState<Project | null>(null)
  const [tab, setTab] = useState<'skills' | 'board'>('skills')
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')

  // Skills y versiones
  const [skills, setSkills] = useState<Skill[]>([])
  const [skillName, setSkillName] = useState('')
  const [skillDescription, setSkillDescription] = useState('')
  const [skillContent, setSkillContent] = useState('')
  const [openSkill, setOpenSkill] = useState<Skill | null>(null)
  const [versions, setVersions] = useState<SkillVersion[]>([])
  const [versionContent, setVersionContent] = useState('')

  // Tablero
  const [columns, setColumns] = useState<Column[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [versionOptions, setVersionOptions] = useState<VersionOption[]>([])
  const [taskTitle, setTaskTitle] = useState('')
  const [taskVersionId, setTaskVersionId] = useState('')

  useEffect(() => {
    api<Project[]>('/projects')
      .then(setProjects)
      .catch((err: Error) => setError(err.message))
  }, [])

  // Ejecuta una acción y muestra el error si falla (por ejemplo, backend apagado).
  async function run(action: () => Promise<void>) {
    try {
      setError(null)
      await action()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  async function refreshVersionOptions(projectId: number) {
    setVersionOptions(await api<VersionOption[]>(`/projects/${projectId}/versions`))
  }

  // ---------- Proyectos ----------

  async function createProject(e: FormEvent) {
    e.preventDefault()
    await run(async () => {
      const created = await api<Project>('/projects', {
        method: 'POST',
        body: JSON.stringify({ name: projectName, description: projectDescription }),
      })
      setProjects([...projects, created])
      setProjectName('')
      setProjectDescription('')
    })
  }

  async function deleteProject(p: Project) {
    if (!window.confirm(`¿Eliminar "${p.name}" con todos sus skills y tareas?`)) return
    await run(async () => {
      await api<void>(`/projects/${p.id}`, { method: 'DELETE' })
      setProjects(projects.filter((x) => x.id !== p.id))
      if (selected?.id === p.id) {
        setSelected(null)
      }
    })
  }

  async function selectProject(p: Project) {
    setSelected(p)
    setTab('skills')
    setSkills([])
    setOpenSkill(null)
    setVersions([])
    setColumns([])
    setTasks([])
    setVersionOptions([])
    await run(async () => {
      setSkills(await api<Skill[]>(`/projects/${p.id}/skills`))
      setColumns(await api<Column[]>(`/projects/${p.id}/columns`))
      setTasks(await api<Task[]>(`/projects/${p.id}/tasks`))
      await refreshVersionOptions(p.id)
    })
  }

  // ---------- Skills y versiones ----------

  async function createSkill(e: FormEvent) {
    e.preventDefault()
    if (!selected) return
    await run(async () => {
      const created = await api<Skill>(`/projects/${selected.id}/skills`, {
        method: 'POST',
        body: JSON.stringify({
          name: skillName,
          description: skillDescription,
          content: skillContent,
        }),
      })
      setSkills([...skills, created])
      setSkillName('')
      setSkillDescription('')
      setSkillContent('')
      await refreshVersionOptions(selected.id)
    })
  }

  async function openVersions(s: Skill) {
    setOpenSkill(s)
    setVersions([])
    setVersionContent('')
    await run(async () => {
      setVersions(await api<SkillVersion[]>(`/skills/${s.id}/versions`))
    })
  }

  async function createVersion(e: FormEvent) {
    e.preventDefault()
    if (!openSkill || !selected) return
    await run(async () => {
      const created = await api<SkillVersion>(`/skills/${openSkill.id}/versions`, {
        method: 'POST',
        body: JSON.stringify({ content: versionContent }),
      })
      setVersions([...versions, created])
      setVersionContent('')
      await refreshVersionOptions(selected.id)
    })
  }

  // ---------- Tablero ----------

  async function createTask(e: FormEvent) {
    e.preventDefault()
    if (!selected) return
    await run(async () => {
      const created = await api<Task>(`/projects/${selected.id}/tasks`, {
        method: 'POST',
        body: JSON.stringify({
          title: taskTitle,
          skill_version_id: taskVersionId === '' ? null : Number(taskVersionId),
        }),
      })
      setTasks([...tasks, created])
      setTaskTitle('')
      setTaskVersionId('')
    })
  }

  async function moveTask(task: Task, step: number) {
    const index = columns.findIndex((c) => c.id === task.column_id)
    const target = columns[index + step]
    if (!target) return
    await run(async () => {
      const moved = await api<Task>(`/tasks/${task.id}/move`, {
        method: 'PATCH',
        body: JSON.stringify({ column_id: target.id }),
      })
      setTasks(tasks.map((t) => (t.id === moved.id ? moved : t)))
    })
  }

  async function deleteTask(task: Task) {
    await run(async () => {
      await api<void>(`/tasks/${task.id}`, { method: 'DELETE' })
      setTasks(tasks.filter((t) => t.id !== task.id))
    })
  }

  function tasksIn(columnId: number) {
    return tasks
      .filter((t) => t.column_id === columnId)
      .sort((a, b) => a.position - b.position)
  }

  function versionLabel(id: number) {
    const v = versionOptions.find((o) => o.id === id)
    return v ? `${v.skill_name} v${v.number}` : `versión ${id}`
  }

  const newestFirst = [...versions].reverse()

  return (
    <div>
      <header className="topbar">
        <h1>Gestor de skills de IA</h1>
      </header>

      {error && (
        <div className="error">
          <span>{error}</span>
          <button onClick={() => setError(null)}>Cerrar</button>
        </div>
      )}

      <div className="layout">
        <aside className="sidebar">
          <h2>Proyectos</h2>
          <form onSubmit={createProject} className="stack">
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Nombre del proyecto"
              required
            />
            <input
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Descripción"
            />
            <button className="primary" type="submit">
              Crear proyecto
            </button>
          </form>
          {projects.length === 0 && <p className="muted">No hay proyectos todavía.</p>}
          <ul className="project-list">
            {projects.map((p) => (
              <li key={p.id} className={selected?.id === p.id ? 'active' : ''}>
                <button className="project-btn" onClick={() => selectProject(p)}>
                  <strong>{p.name}</strong>
                  {p.description && <span>{p.description}</span>}
                </button>
                <button
                  className="danger"
                  title="Eliminar proyecto"
                  onClick={() => deleteProject(p)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="content">
          {!selected ? (
            <p className="muted">Elige un proyecto para ver sus skills y su tablero.</p>
          ) : (
            <>
              <h2>{selected.name}</h2>
              <div className="tabs">
                <button
                  className={tab === 'skills' ? 'tab active' : 'tab'}
                  onClick={() => setTab('skills')}
                >
                  Skills
                </button>
                <button
                  className={tab === 'board' ? 'tab active' : 'tab'}
                  onClick={() => setTab('board')}
                >
                  Tablero
                </button>
              </div>

              {tab === 'skills' && (
                <>
                  <section className="card">
                    <h3>Nuevo skill</h3>
                    <form onSubmit={createSkill} className="stack">
                      <input
                        value={skillName}
                        onChange={(e) => setSkillName(e.target.value)}
                        placeholder="Nombre del skill"
                        required
                      />
                      <input
                        value={skillDescription}
                        onChange={(e) => setSkillDescription(e.target.value)}
                        placeholder="Descripción"
                      />
                      <textarea
                        value={skillContent}
                        onChange={(e) => setSkillContent(e.target.value)}
                        placeholder="Contenido (será la versión 1)"
                      />
                      <button className="primary" type="submit">
                        Crear skill
                      </button>
                    </form>
                  </section>

                  <section className="card">
                    <h3>Skills del proyecto</h3>
                    {skills.length === 0 && (
                      <p className="muted">Este proyecto no tiene skills todavía.</p>
                    )}
                    <ul className="plain-list">
                      {skills.map((s) => (
                        <li
                          key={s.id}
                          className={openSkill?.id === s.id ? 'row active' : 'row'}
                        >
                          <div>
                            <strong>{s.name}</strong>
                            {s.description && (
                              <span className="muted"> — {s.description}</span>
                            )}
                          </div>
                          <button onClick={() => openVersions(s)}>Ver versiones</button>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {openSkill && (
                    <section className="card">
                      <h3>Versiones de {openSkill.name}</h3>
                      <form onSubmit={createVersion} className="stack">
                        <textarea
                          value={versionContent}
                          onChange={(e) => setVersionContent(e.target.value)}
                          placeholder="Contenido de la nueva versión"
                          required
                        />
                        <button className="primary" type="submit">
                          Crear versión
                        </button>
                      </form>
                      <ul className="plain-list">
                        {newestFirst.map((v, i) => (
                          <li key={v.id} className="version">
                            <div className="version-head">
                              <strong>v{v.number}</strong>
                              {i === 0 && <span className="badge">vigente</span>}
                              <button
                                className="link"
                                onClick={() => setVersionContent(v.content)}
                              >
                                Restaurar en el formulario
                              </button>
                            </div>
                            <pre>{v.content}</pre>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </>
              )}

              {tab === 'board' && (
                <>
                  <section className="card">
                    <h3>Nueva tarea</h3>
                    <form onSubmit={createTask} className="row-form">
                      <input
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Título de la tarea"
                        required
                      />
                      <select
                        value={taskVersionId}
                        onChange={(e) => setTaskVersionId(e.target.value)}
                      >
                        <option value="">Sin skill</option>
                        {versionOptions.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.skill_name} v{v.number}
                          </option>
                        ))}
                      </select>
                      <button className="primary" type="submit">
                        Agregar
                      </button>
                    </form>
                  </section>

                  <div className="board">
                    {columns.map((c, ci) => (
                      <div key={c.id} className="column">
                        <h3>
                          {c.name} <span className="count">{tasksIn(c.id).length}</span>
                        </h3>
                        {tasksIn(c.id).length === 0 && (
                          <p className="muted">Sin tareas</p>
                        )}
                        {tasksIn(c.id).map((t) => (
                          <div key={t.id} className="task">
                            <strong>{t.title}</strong>
                            {t.skill_version_id !== null && (
                              <span className="chip">
                                {versionLabel(t.skill_version_id)}
                              </span>
                            )}
                            <div className="task-actions">
                              <button disabled={ci === 0} onClick={() => moveTask(t, -1)}>
                                ←
                              </button>
                              <button
                                disabled={ci === columns.length - 1}
                                onClick={() => moveTask(t, 1)}
                              >
                                →
                              </button>
                              <button className="danger" onClick={() => deleteTask(t)}>
                                Eliminar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default App