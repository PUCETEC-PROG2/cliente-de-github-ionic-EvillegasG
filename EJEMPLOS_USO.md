# 📖 Ejemplos de Uso - Laboratorio 8

## Ejemplo 1: Usar el Servicio en un Componente Personalizado

```typescript
import { getUserRepositories, Repository } from '../services/githubService'
import { useState, useEffect } from 'react'

const MyComponent = () => {
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const data = await getUserRepositories('torvalds')
        setRepos(data)
      } finally {
        setLoading(false)
      }
    }
    fetchRepos()
  }, [])

  return (
    <div>
      {loading ? <p>Cargando...</p> : <ul>
        {repos.map(repo => <li key={repo.id}>{repo.name}</li>)}
      </ul>}
    </div>
  )
}
```

## Ejemplo 2: Obtener Información del Usuario

```typescript
import { getUserInfo, User } from '../services/githubService'

const getUserProfile = async () => {
  try {
    const user: User = await getUserInfo('EvillegasG')
    console.log(`${user.name} tiene ${user.followers} followers`)
  } catch (error) {
    console.error('No se pudo obtener el usuario:', error)
  }
}
```

## Ejemplo 3: Componente con Refetch

```typescript
import { IonButton } from '@ionic/react'
import { getUserRepositories, Repository } from '../services/githubService'
import { useState } from 'react'

const RepositoriesList = ({ username }: { username: string }) => {
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRepos = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getUserRepositories(username)
      setRepos(data)
    } catch (err) {
      setError('Error al cargar repositorios')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <IonButton onClick={fetchRepos} disabled={loading}>
        {loading ? 'Cargando...' : 'Recargar'}
      </IonButton>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {repos.map(repo => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank">
              {repo.name} - ⭐ {repo.stargazers_count}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## Ejemplo 4: Componente con Búsqueda

```typescript
import { IonInput, IonButton, IonList } from '@ionic/react'
import { getUserRepositories, Repository } from '../services/githubService'
import { useState } from 'react'

const SearchRepositories = () => {
  const [username, setUsername] = useState('')
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!username) return
    
    setLoading(true)
    setSearched(true)
    try {
      const data = await getUserRepositories(username)
      setRepos(data)
    } catch (error) {
      setRepos([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <IonInput
          value={username}
          onIonChange={(e) => setUsername(String(e.detail.value))}
          placeholder="Username de GitHub"
        />
        <IonButton onClick={handleSearch} disabled={loading}>
          Buscar
        </IonButton>
      </div>

      {loading && <p>Buscando...</p>}
      {searched && repos.length === 0 && !loading && (
        <p>No se encontraron repositorios para "{username}"</p>
      )}

      {repos.length > 0 && (
        <IonList>
          {repos.map(repo => (
            <div key={repo.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
              <h3>{repo.name}</h3>
              <p>{repo.description}</p>
              <small>Lenguaje: {repo.language} | ⭐ {repo.stargazers_count}</small>
            </div>
          ))}
        </IonList>
      )}
    </div>
  )
}
```

## Ejemplo 5: Filtrar Repositorios por Lenguaje

```typescript
import { getUserRepositories, Repository } from '../services/githubService'

const getRepositoriesByLanguage = async (username: string, language: string) => {
  const repos = await getUserRepositories(username)
  return repos.filter(repo => repo.language === language)
}

// Uso:
const pythonRepos = await getRepositoriesByLanguage('EvillegasG', 'Python')
```

## Ejemplo 6: Obtener Top Repositorios por Stars

```typescript
import { getUserRepositories } from '../services/githubService'

const getTopRepositories = async (username: string, limit: number = 5) => {
  const repos = await getUserRepositories(username)
  return repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, limit)
}

// Uso:
const topRepos = await getTopRepositories('EvillegasG', 10)
console.log(topRepos.map(r => `${r.name}: ${r.stargazers_count} ⭐`))
```

## Ejemplo 7: Comparar Dos Usuarios

```typescript
import { getUserInfo, getUserRepositories, User, Repository } from '../services/githubService'

interface UserComparison {
  user1: User & { repos: Repository[] }
  user2: User & { repos: Repository[] }
}

const compareUsers = async (user1: string, user2: string): Promise<UserComparison> => {
  const [userData1, reposData1, userData2, reposData2] = await Promise.all([
    getUserInfo(user1),
    getUserRepositories(user1),
    getUserInfo(user2),
    getUserRepositories(user2),
  ])

  return {
    user1: { ...userData1, repos: reposData1 },
    user2: { ...userData2, repos: reposData2 },
  }
}

// Uso:
const comparison = await compareUsers('EvillegasG', 'torvalds')
console.log(`${comparison.user1.name} vs ${comparison.user2.name}`)
```

## Ejemplo 8: Componente con Paginación

```typescript
import { useState } from 'react'
import { getUserRepositories, Repository } from '../services/githubService'
import { IonButton } from '@ionic/react'

const PaginatedRepositories = ({ username }: { username: string }) => {
  const [repos, setRepos] = useState<Repository[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 5

  const loadRepos = async () => {
    const data = await getUserRepositories(username)
    setRepos(data)
  }

  const paginatedRepos = repos.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  return (
    <div>
      {repos.length === 0 ? (
        <IonButton onClick={loadRepos}>Cargar Repositorios</IonButton>
      ) : (
        <>
          <ul>
            {paginatedRepos.map(repo => (
              <li key={repo.id}>{repo.name}</li>
            ))}
          </ul>
          <div>
            <IonButton
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              Anterior
            </IonButton>
            <span>Página {currentPage + 1}</span>
            <IonButton
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={(currentPage + 1) * itemsPerPage >= repos.length}
            >
              Siguiente
            </IonButton>
          </div>
        </>
      )}
    </div>
  )
}
```

## Ejemplo 9: Guardar Datos en localStorage

```typescript
import { getUserRepositories, Repository } from '../services/githubService'

const fetchAndCacheRepositories = async (username: string) => {
  const cacheKey = `repos_${username}`
  const cached = localStorage.getItem(cacheKey)

  if (cached) {
    return JSON.parse(cached) as Repository[]
  }

  const repos = await getUserRepositories(username)
  localStorage.setItem(cacheKey, JSON.stringify(repos))
  return repos
}

// Uso:
const repos = await fetchAndCacheRepositories('EvillegasG')
```

## Ejemplo 10: Componente con Favoritos

```typescript
import { useState } from 'react'
import { getUserRepositories, Repository } from '../services/githubService'
import { IonIcon } from '@ionic/react'
import { star, starOutline } from 'ionicons/icons'

const RepositoriesWithFavorites = ({ username }: { username: string }) => {
  const [repos, setRepos] = useState<Repository[]>([])
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  const toggleFavorite = (repoId: number) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(repoId)) {
      newFavorites.delete(repoId)
    } else {
      newFavorites.add(repoId)
    }
    setFavorites(newFavorites)
    // Guardar en localStorage
    localStorage.setItem(`favorites_${username}`, JSON.stringify(Array.from(newFavorites)))
  }

  const getFavoriteRepositories = () => {
    return repos.filter(repo => favorites.has(repo.id))
  }

  return (
    <div>
      <h2>Repositorios Favoritos ({favorites.size})</h2>
      <ul>
        {getFavoriteRepositories().map(repo => (
          <li key={repo.id}>
            <span>{repo.name}</span>
            <button onClick={() => toggleFavorite(repo.id)}>
              <IonIcon icon={favorites.has(repo.id) ? star : starOutline} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## Casos de Uso Comunes

### 1. Actualizar datos periódicamente

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    fetchRepositories()
  }, 300000) // Cada 5 minutos

  return () => clearInterval(interval)
}, [])
```

### 2. Manejar múltiples usuarios

```typescript
const [selectedUser, setSelectedUser] = useState('EvillegasG')

useEffect(() => {
  fetchRepositories(selectedUser)
}, [selectedUser])
```

### 3. Buscar repositorio específico

```typescript
const searchRepository = (repos: Repository[], query: string) => {
  return repos.filter(repo =>
    repo.name.toLowerCase().includes(query.toLowerCase()) ||
    (repo.description?.toLowerCase().includes(query.toLowerCase()) ?? false)
  )
}
```

### 4. Filtros avanzados

```typescript
const filterRepositories = (repos: Repository[], filters: {
  language?: string
  minStars?: number
  private?: boolean
}) => {
  return repos.filter(repo => {
    if (filters.language && repo.language !== filters.language) return false
    if (filters.minStars && repo.stargazers_count < filters.minStars) return false
    if (filters.private !== undefined && repo.private !== filters.private) return false
    return true
  })
}
```

