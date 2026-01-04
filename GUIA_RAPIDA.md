# 🚀 Guía Rápida - Laboratorio 8

## Qué se Implementó

### ✅ Servicio de GitHub API
**Archivo:** `src/services/githubService.ts`

```typescript
// Importar en componentes
import { getUserRepositories, getUserInfo, Repository, User } from '../services/githubService'

// Usar en componentes
const repos = await getUserRepositories('EvillegasG')
const user = await getUserInfo('EvillegasG')
```

### ✅ Tab1 - Listado de Repositorios
**Archivo:** `src/pages/Tab1.tsx`

```typescript
// Estados
const [repositories, setRepositories] = useState<Repository[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

// Cargar datos al montar
useEffect(() => {
  const fetchRepositories = async () => {
    try {
      const repos = await getUserRepositories(GITHUB_USERNAME)
      setRepositories(repos)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  fetchRepositories()
}, [])
```

**Renderizado:**
- ⏳ Spinner mientras `loading === true`
- ❌ Mensaje de error si `error !== null`
- ✅ Lista de repos si `!loading && !error`

### ✅ Tab3 - Información del Usuario
**Archivo:** `src/pages/Tab3.tsx`

Implementación similar a Tab1 pero mostrando:
- Avatar del usuario
- Nombre y username
- Biografía
- Estadísticas (repos, followers, etc.)
- Información de contacto (ubicación, empresa, blog, Twitter)

### ✅ Componente RepoItem
**Archivo:** `src/components/RepoItem.tsx`

```typescript
// Props tipados
interface RepoProps extends Repository {
  imageUrl?: string
}

// Renderizado
<IonItem button onClick={() => window.open(html_url, '_blank')}>
  <IonThumbnail slot="start">
    <img src={owner.avatar_url} />
  </IonThumbnail>
  <IonLabel>
    <h2>{name}</h2>
    <p>{description}</p>
    <span>⭐ {stargazers_count} stars</span>
  </IonLabel>
</IonItem>
```

## Estructura de Carpetas

```
src/
├── services/
│   └── githubService.ts ← NUEVO
├── pages/
│   ├── Tab1.tsx ← ACTUALIZADO
│   ├── Tab1.css ← ACTUALIZADO
│   └── Tab3.tsx ← ACTUALIZADO
│   └── Tab3.css ← ACTUALIZADO
└── components/
    ├── RepoItem.tsx ← ACTUALIZADO
    └── RepoItem.css ← ACTUALIZADO
```

## Endpoints Utilizados

```
GET https://api.github.com/users/:username/repos
GET https://api.github.com/users/:username
```

## Estados Implementados

### Loading
```
┌─────────────────┐
│   🔄 Spinner    │
│  Cargando...   │
└─────────────────┘
```

### Error
```
┌─────────────────────────────┐
│ ❌ Error: [mensaje de error]│
└─────────────────────────────┘
```

### Success
```
┌──────────────────────────────┐
│ ✅ Datos cargados            │
│    Mostrando información      │
└──────────────────────────────┘
```

### Empty
```
┌──────────────────────────────┐
│ No se encontraron datos      │
└──────────────────────────────┘
```

## Configuración Axios

```typescript
const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
  },
});

// Opcional: Usar token para más requests/hora
headers: {
  'Authorization': `token YOUR_TOKEN_HERE`,
}
```

## Cambiar Usuario de GitHub

**Edita estas líneas:**

```typescript
// En Tab1.tsx
const GITHUB_USERNAME = 'EvillegasG' // ← Cambiar aquí

// En Tab3.tsx
const GITHUB_USERNAME = 'EvillegasG' // ← Cambiar aquí
```

## Ejemplo: Cambiar a otro usuario

```typescript
const GITHUB_USERNAME = 'torvalds' // Para ver repos de Linus Torvalds
```

## Types Disponibles

### User
```typescript
{
  login: string
  name: string
  avatar_url: string
  bio: string | null
  location: string
  company: string
  blog: string
  email: string | null
  twitter_username: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
  html_url: string
  // ... más propiedades
}
```

### Repository
```typescript
{
  id: number
  name: string
  full_name: string
  owner: { login: string; avatar_url: string }
  html_url: string
  description: string | null
  private: boolean
  language: string | null
  stargazers_count: number
  watchers_count: number
  forks_count: number
  created_at: string
  updated_at: string
  pushed_at: string
  // ... más propiedades
}
```

## Flujo de Componentes

```
App.tsx
  ├── Tab1 (Repositorios)
  │   ├── Llama getUserRepositories()
  │   ├── Muestra IonSpinner si loading
  │   ├── Muestra error si hay error
  │   └── Mapea Repository[] a RepoItem[]
  │
  └── Tab3 (Usuario)
      ├── Llama getUserInfo()
      ├── Muestra IonSpinner si loading
      ├── Muestra error si hay error
      └── Muestra datos del usuario en IonCard
```

## Manejo de Errores

```typescript
try {
  const data = await getUserRepositories(username)
  setData(data)
} catch (err) {
  setError(err instanceof Error ? err.message : 'Unknown error')
} finally {
  setLoading(false)
}
```

## Interactividad Implementada

1. **Click en Repositorio:**
   - Abre el repositorio en GitHub
   - `onClick={() => window.open(html_url, '_blank')}`

2. **Click en "Ver en GitHub":**
   - Abre el perfil del usuario
   - `onClick={() => window.open(user.html_url, '_blank')}`

## Estilos CSS

### Tab1.css
- `.loading-container` - Spinner centrado
- `.error-container` - Mensaje de error
- `.empty-container` - Estado vacío

### Tab3.css
- `.user-avatar` - Imagen responsive
- `.user-info-grid` - Grid 2 columnas
- `.detail-row` - Información adicional
- `.action-buttons` - Botones interactivos

### RepoItem.css
- `.repo-item` - Contenedor
- `.repo-header` - Nombre + badge
- `.repo-stats` - Estadísticas

## Pruebas Recomendadas

1. ✅ Cargar Tab1 y verificar lista de repos
2. ✅ Cargar Tab3 y verificar información del usuario
3. ✅ Click en repo para abrir en GitHub
4. ✅ Click en "Ver en GitHub" para abrir perfil
5. ✅ Cambiar usuario y verificar que cargan datos diferentes
6. ✅ Probar con usuario inválido para ver error handling

## Rate Limiting

- 60 requests/hora sin autenticación
- 5000 requests/hora con token de GitHub

Para aumentar el límite, añade un token:

```typescript
const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Authorization': `token ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`,
    'Accept': 'application/vnd.github.v3+json',
  },
});
```

## Instalación

```bash
# Instalar axios
npm install axios

# Ejecutar
npm run dev
```

## Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `src/services/githubService.ts` | Servicio API centralizado |
| `src/pages/Tab1.tsx` | Listado de repositorios |
| `src/pages/Tab3.tsx` | Información del usuario |
| `src/components/RepoItem.tsx` | Item individual de repositorio |

## ✨ Features Implementadas

- ✅ Llamadas HTTP GET con Axios
- ✅ Manejo de estados (loading, error, success, empty)
- ✅ TypeScript types para seguridad
- ✅ Spinners de carga
- ✅ Mensajes de error descriptivos
- ✅ Componentes reutilizables
- ✅ Estilos modernos
- ✅ Links interactivos
- ✅ Responsive design
- ✅ Integración completa con Ionic

