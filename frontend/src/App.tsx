import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

type Project = {
  id: number
  name: string
  description: string
}

type Skill = {
  id: number
  project_id: number
  name: string
  description: string
}

const API = 'http://127.0.0.1:8000'

function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [skillName, setSkillName] = useState('')
  const [skillDescription, setSkillDescription] = useState('')
  const [skillContent, setSkillContent] = useState('')

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const res = await fetch(`${API}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    })
    if (!res.ok) {
      setError(`HTTP ${res.status}`)
      return
    }
    const created: Project = await res.json()
    setProjects([...projects, created])
    setError(null)
    setName('')
    setDescription('')
  }

  async function selectProject(p: Project) {
    setSelectedProject(p)
    setSkills([])
    const res = await fetch(`${API}/projects/${p.id}/skills`)
    if (!res.ok) {
      setError(`HTTP ${res.status}`)
      return
    }
    setSkills(await res.json())
  }

  async function handleCreateSkill(e: FormEvent) {
    e.preventDefault()
    if (!selectedProject) return
    const res = await fetch(`${API}/projects/${selectedProject.id}/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: skillName,
        description: skillDescription,
        content: skillContent,
      }),
    })
    if (!res.ok) {
      setError(`HTTP ${res.status}`)
      return
    }
    const created: Skill = await res.json()
    setSkills([...skills, created])
    setError(null)
    setSkillName('')
    setSkillDescription('')
    setSkillContent('')
  }

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '1.5rem' }}>
      <h1>Proyectos</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
          required
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción"
        />
        <button type="submit">Crear</button>
      </form>
      {error && <p>No se pudo cargar el API: {error}</p>}
      {!error && projects.length === 0 && <p>No hay proyectos todavía.</p>}
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <strong>{p.name}</strong>
            {p.description ? ` — ${p.description}` : ''}{' '}
            <button onClick={() => selectProject(p)}>Ver skills</button>
          </li>
        ))}
      </ul>
      {selectedProject && (
        <section>
          <h2>Skills de {selectedProject.name}</h2>
          <form onSubmit={handleCreateSkill}>
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
            <button type="submit">Crear skill</button>
          </form>
          {skills.length === 0 && <p>Este proyecto no tiene skills todavía.</p>}
          <ul>
            {skills.map((s) => (
              <li key={s.id}>
                <strong>{s.name}</strong>
                {s.description ? ` — ${s.description}` : ''}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}

export default App