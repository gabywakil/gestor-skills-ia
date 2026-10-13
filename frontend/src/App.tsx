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