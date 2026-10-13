import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

type Project = {
  id: number
  name: string
  description: string
}

const API = 'http://127.0.0.1:8000'

function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

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
            {p.description ? ` — ${p.description}` : ''}
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App