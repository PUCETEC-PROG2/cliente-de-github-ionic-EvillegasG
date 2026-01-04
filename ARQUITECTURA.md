# 📱 Laboratorio 8 - Implementación de API REST

## 🎯 Visión General

```
┌─────────────────────────────────────────────────────────────┐
│          APLICACIÓN IONIC - CLIENTE GITHUB                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │   TAB 1          │  │   TAB 3          │                │
│  │ REPOSITORIOS     │  │ INFORMACIÓN DEL  │                │
│  │                  │  │ USUARIO          │                │
│  │ GET /users/:user │  │                  │                │
│  │ /repos           │  │ GET /users/:user │                │
│  │                  │  │                  │                │
│  └────────┬─────────┘  └────────┬─────────┘                │
│           │                    │                           │
│           └────────┬───────────┘                           │
│                    │                                        │
│            ┌───────▼────────┐                              │
│            │  AXIOS SERVICE │                              │
│            │  githubService │                              │
│            └───────┬────────┘                              │
│                    │                                        │
│                    ▼                                        │
│        ┌──────────────────────┐                            │
│        │   GITHUB API v3      │                            │
│        │ api.github.com       │                            │
│        └──────────────────────┘                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Arquitectura de Datos

```
CLIENTE (Ionic/React)
    │
    ├── State Management
    │   ├── repositories: Repository[]
    │   ├── user: User | null
    │   ├── loading: boolean
    │   └── error: string | null
    │
    └── API Service (Axios)
        └── GitHub API
            ├── /users/{username}
            └── /users/{username}/repos
```

## 🔄 Flujo de Datos

### Tab1 (Repositorios)

```
Carga de Tab1
    │
    ▼
useEffect ejecuta
    │
    ▼
getUserRepositories('EvillegasG')
    │
    ▼
Axios GET /users/EvillegasG/repos
    │
    ├─ Success ──▶ setRepositories(data)
    │             render: Lista de repos
    │
    └─ Error ──▶ setError(mensaje)
                 render: Error message
```

### Tab3 (Usuario)

```
Carga de Tab3
    │
    ▼
useEffect ejecuta
    │
    ▼
getUserInfo('EvillegasG')
    │
    ▼
Axios GET /users/EvillegasG
    │
    ├─ Success ──▶ setUser(data)
    │             render: User profile
    │
    └─ Error ──▶ setError(mensaje)
                 render: Error message
```

## 🎨 Componentes

### Jerarquía de Componentes

```
App
├── IonTabs
│   ├── Route(Tab1)
│   │   └── Tab1
│   │       ├── IonSpinner (si loading)
│   │       ├── IonNote (si error)
│   │       └── IonList
│   │           └── RepoItem[] (si success)
│   │
│   └── Route(Tab3)
│       └── Tab3
│           ├── IonSpinner (si loading)
│           ├── IonNote (si error)
│           └── IonCard (si success)
│               └── User Profile Content
│
└── IonTabBar (navigation)
```

## 📦 Estructura de Carpetas Final

```
cliente-de-github-ionic-EvillegasG/
│
├── src/
│   ├── services/
│   │   └── githubService.ts ✨ NEW
│   │       ├── axios config
│   │       ├── User interface
│   │       ├── Repository interface
│   │       ├── getUserRepositories()
│   │       └── getUserInfo()
│   │
│   ├── pages/
│   │   ├── Tab1.tsx ✏️ UPDATED
│   │   │   ├── states (loading, error, repos)
│   │   │   ├── useEffect hook
│   │   │   └── conditional rendering
│   │   ├── Tab1.css ✏️ UPDATED
│   │   ├── Tab3.tsx ✏️ UPDATED
│   │   │   ├── states (loading, error, user)
│   │   │   ├── useEffect hook
│   │   │   └── conditional rendering
│   │   └── Tab3.css ✏️ UPDATED
│   │
│   ├── components/
│   │   ├── RepoItem.tsx ✏️ UPDATED
│   │   │   ├── extends Repository interface
│   │   │   ├── clickable link
│   │   │   └── stars display
│   │   └── RepoItem.css ✏️ UPDATED
│   │
│   ├── App.tsx (sin cambios)
│   ├── main.tsx (sin cambios)
│   └── theme/
│       └── variables.css (sin cambios)
│
├── package.json ✏️ UPDATED (axios added)
│
└── 📚 Documentation
    ├── LABORATORIO_8_DOCUMENTACION.md
    ├── RESUMEN_IMPLEMENTACION.md
    ├── GUIA_RAPIDA.md
    ├── EJEMPLOS_USO.md
    ├── ESTADO_FINAL.md
    └── ARQUITECTURA.md (this file)
```

## 🔌 Integración de Axios

```typescript
// ┌─ Configuración
│  axios.create({
│    baseURL: 'https://api.github.com',
│    headers: { 'Accept': 'application/vnd.github.v3+json' }
│  })
│
├─ Método GET (Repositorios)
│  export const getUserRepositories = async (username) => {
│    const response = await githubApi.get(`/users/${username}/repos`)
│    return response.data // Repository[]
│  }
│
└─ Método GET (Usuario)
   export const getUserInfo = async (username) => {
     const response = await githubApi.get(`/users/${username}`)
     return response.data // User
   }
```

## 🎯 Estados y Transiciones

```
                START
                  │
                  ▼
            ┌──────────────┐
            │  loading:true│
            │   spinner    │◀─────┐
            └──────┬───────┘      │
                   │              │
    ┌──────────────┼──────────────┐
    │              │              │
    │       loading:false         │
    │              │              │
    ▼              ▼              ▼
┌────────┐  ┌──────────┐  ┌──────────┐
│ ERROR  │  │  EMPTY   │  │ SUCCESS  │
│ show   │  │ show no  │  │ show     │
│ error  │  │ data msg │  │ data     │
└────────┘  └──────────┘  └──────────┘
```

## 📡 API Endpoints

### GET /users/:username

Devuelve:
```json
{
  "login": "EvillegasG",
  "name": "Esteban Villegas",
  "avatar_url": "https://avatars.githubusercontent.com/u/...",
  "bio": "Developer",
  "location": "Colombia",
  "company": "TechCorp",
  "blog": "https://example.com",
  "twitter_username": "username",
  "public_repos": 25,
  "followers": 150,
  "following": 50,
  "public_gists": 10,
  "created_at": "2020-01-01T00:00:00Z",
  "updated_at": "2024-01-04T00:00:00Z",
  "html_url": "https://github.com/EvillegasG"
}
```

### GET /users/:username/repos

Devuelve:
```json
[
  {
    "id": 123456,
    "name": "project-name",
    "full_name": "EvillegasG/project-name",
    "description": "A cool project",
    "html_url": "https://github.com/EvillegasG/project-name",
    "language": "TypeScript",
    "stargazers_count": 42,
    "watchers_count": 42,
    "forks_count": 5,
    "created_at": "2020-01-01T00:00:00Z",
    "updated_at": "2024-01-04T00:00:00Z",
    "pushed_at": "2024-01-04T00:00:00Z",
    "owner": {
      "login": "EvillegasG",
      "avatar_url": "https://avatars.githubusercontent.com/u/..."
    }
  }
]
```

## 🎬 Secuencia de Ejecución

### Primer Render (Loading)

```
1. Component monta
2. useEffect se ejecuta
3. llamaGetRepositories() inicia
4. loading = true
5. Spinner se renderiza

░░░░░░░░░░░
░ Cargando ░
░░░░░░░░░░░
```

### Después de Respuesta (Success)

```
1. API responde con datos
2. catch no se ejecuta
3. setRepositories(data)
4. loading = false
5. error = null
6. RepoItem[] se renderizan

┌─────────────────────┐
│ [Avatar] Repo Name  │
│ Description         │
│ ⭐ 42 stars        │
└─────────────────────┘
```

### Si hay Error

```
1. API rechaza request
2. catch se ejecuta
3. setError(mensaje)
4. loading = false
5. Mensaje de error se muestra

┌──────────────────────┐
│ ❌ Error: Not found  │
└──────────────────────┘
```

## 💾 Hooks Utilizados

### useState
```typescript
const [repositories, setRepositories] = useState<Repository[]>([])
const [loading, setLoading] = useState<boolean>(true)
const [error, setError] = useState<string | null>(null)
```

### useEffect
```typescript
useEffect(() => {
  const fetch = async () => {
    try {
      const data = await getUserRepositories(username)
      setRepositories(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  fetch()
}, []) // Se ejecuta una sola vez al montar
```

## 🎨 CSS Modulación

### Tab1.css
```css
.loading-container  → Flex centrado con spinner
.error-container    → Estilo de error rojo
.empty-container    → Mensaje cuando no hay datos
```

### Tab3.css
```css
.user-avatar        → Imagen responsive
.user-info-grid     → Grid de estadísticas 2x2
.detail-row         → Fila de información
.action-buttons     → Botón interactivo
.badge-link         → Link con efecto hover
.timestamp          → Texto pequeño de fecha
.loading-container  → Similar a Tab1
.error-container    → Similar a Tab1
```

### RepoItem.css
```css
.repo-item          → Container base
.repo-header        → Nombre + language badge
.repo-stats         → Estadísticas de repo
```

## 🔍 Manejo de Errores

```typescript
try {
  const data = await getUserRepositories(username)
  setRepositories(data)
} catch (error) {
  // Error: NetworkError, timeout, API error, etc.
  const message = error instanceof Error 
    ? error.message 
    : 'Unknown error'
  setError(message)
  setRepositories([])
} finally {
  // Siempre se ejecuta
  setLoading(false)
}
```

## 📈 Rendimiento

- ⚡ Carga bajo demanda con useEffect
- 🎯 Memoria: Solo datos necesarios en estado
- 🔄 Re-renders: Solo cuando hay cambios de estado
- 📦 Bundle: axios ~ 14KB

## 🌐 Rate Limiting

```
Sin Token:     60 requests/hora
Con Token:  5000 requests/hora
```

Resetea cada hora UTC.

## 🚀 Stack Tecnológico

```
Frontend Framework    → Ionic/React
Language             → TypeScript
HTTP Client          → Axios
Backend (API)        → GitHub REST API v3
State Management     → React Hooks (useState)
Async Handling       → async/await
Build Tool           → Vite
Package Manager      → npm
```

## ✅ Verificación de Implementación

| Feature | Status |
|---------|--------|
| Axios configurado | ✅ |
| GET /users/:user/repos | ✅ |
| GET /users/:user | ✅ |
| Loading states | ✅ |
| Error handling | ✅ |
| UI components | ✅ |
| TypeScript types | ✅ |
| CSS styles | ✅ |
| Documentación | ✅ |
| Ejemplos | ✅ |

---

**Laboratorio 8: COMPLETADO ✅**

