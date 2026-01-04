# Laboratorio 8: Implementación de una API REST usando Ionic (Métodos GET)

## Descripción General
Este laboratorio implementa la integración de la API REST de GitHub en una aplicación Ionic utilizando Axios. La aplicación permite consultar repositorios e información del usuario desde la API de GitHub.

## Objetivos Completados

### ✅ 1. Configuración de Axios en el Proyecto
- Se instaló la librería **axios** como dependencia del proyecto
- Se creó una instancia configurada de Axios en `src/services/githubService.ts` con:
  - Base URL configurada a `https://api.github.com`
  - Headers configurados para la API v3 de GitHub
  - Manejo centralizado de errores

### ✅ 2. Implementación de Métodos GET

#### **GET /users/:username/repos**
```typescript
export const getUserRepositories = async (username: string): Promise<Repository[]>
```
- Obtiene todos los repositorios públicos de un usuario
- Devuelve un array tipado de repositorios
- Manejo de errores con try-catch

#### **GET /users/:username**
```typescript
export const getUserInfo = async (username: string): Promise<User>
```
- Obtiene información del perfil del usuario
- Devuelve objeto tipado con datos del usuario
- Incluye estadísticas (followers, repositorios, etc.)

### ✅ 3. Manejo de Estados de Carga y Errores

#### **Estados Implementados:**
1. **Estado de Carga (`loading`)**: Muestra spinner mientras se cargan datos
2. **Estado de Error (`error`)**: Muestra mensaje de error si la solicitud falla
3. **Estado de Éxito**: Muestra los datos obtenidos

#### **Componentes con Estados:**
- **Tab1 (Repositorios)**: Carga lista de repositorios con spinner y mensaje de error
- **Tab3 (Usuario)**: Carga información del usuario con spinner y mensaje de error

### ✅ 4. Integración con Componentes GUI

#### **Tab1 - Listado de Repositorios**
- Obtiene repositorios del usuario al cargar el componente (`useEffect`)
- Muestra loading spinner mientras se cargan datos
- Maneja errores con mensaje descriptivo
- Lista repositorios con componente `RepoItem`

#### **Tab3 - Información del Usuario**
- Obtiene información del perfil del usuario al cargar
- Muestra loading spinner
- Muestra datos del usuario en tarjeta elegante
- Incluye:
  - Avatar del usuario
  - Nombre y usuario
  - Biografía
  - Estadísticas (repos, followers, following, gists)
  - Ubicación, empresa, blog, Twitter
  - Enlace directo a perfil de GitHub

#### **Componente RepoItem**
- Actualizado para usar datos reales de la API
- Muestra:
  - Avatar del propietario
  - Nombre del repositorio
  - Descripción
  - Lenguaje de programación (badge)
  - Contador de estrellas
  - Enlace clickeable al repositorio

### ✅ 5. Endpoints Implementados

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/users/:username/repos` | GET | Obtiene repositorios del usuario |
| `/users/:username` | GET | Obtiene información del usuario |

## Estructura del Código

### Archivos Creados/Modificados

#### **src/services/githubService.ts** (NUEVO)
```typescript
// Configuración de axios
const githubApi = axios.create({...})

// Interfaces de tipos
export interface User {...}
export interface Repository {...}

// Funciones de API
export const getUserRepositories(username: string)
export const getUserInfo(username: string)
```

#### **src/pages/Tab1.tsx** (MODIFICADO)
```typescript
// Estados
const [repositories, setRepositories] = useState<Repository[]>([])
const [loading, setLoading] = useState<boolean>(true)
const [error, setError] = useState<string | null>(null)

// Efecto para cargar datos
useEffect(() => {
  fetchRepositories()
}, [])

// Renderizado condicional
- Loading: spinner
- Error: mensaje de error
- Éxito: lista de repositorios
```

#### **src/pages/Tab3.tsx** (MODIFICADO)
```typescript
// Estados similares a Tab1
// Efecto para cargar información del usuario
// Renderizado con datos del perfil
```

#### **src/components/RepoItem.tsx** (MODIFICADO)
```typescript
// Props actualizados a Repository type
// Muestra información real del repositorio
// Incluye enlace al repositorio de GitHub
```

## Estilos CSS Implementados

### Tab1.css
- `.loading-container`: Contenedor centrado para spinner
- `.error-container`: Estilo para mensaje de error
- `.empty-container`: Estilo cuando no hay repositorios

### Tab3.css
- `.user-avatar`: Imagen del perfil responsive
- `.user-info-grid`: Grid de 2 columnas para estadísticas
- `.detail-row`: Filas para información adicional
- `.action-buttons`: Botón para ir a GitHub
- `.badge-link`: Estilo clickeable con hover effect

### RepoItem.css
- `.repo-item`: Estilo del item de repositorio
- `.repo-header`: Encabezado con nombre y lenguaje
- `.repo-stats`: Estadísticas del repositorio

## Uso de la Aplicación

### Configuración del Usuario
Para cambiar el usuario de GitHub consultado, modifica la constante `GITHUB_USERNAME` en:
- `src/pages/Tab1.tsx`
- `src/pages/Tab3.tsx`

```typescript
const GITHUB_USERNAME = 'EvillegasG'; // Cambiar por otro usuario
```

### Flujo de Funcionamiento

1. **Al cargar Tab1:**
   - Se ejecuta `useEffect` que llama a `getUserRepositories()`
   - Muestra spinner mientras carga
   - Si es exitoso, muestra lista de repositorios
   - Si hay error, muestra mensaje de error

2. **Al cargar Tab3:**
   - Se ejecuta `useEffect` que llama a `getUserInfo()`
   - Muestra spinner mientras carga
   - Si es exitoso, muestra tarjeta con información del usuario
   - Si hay error, muestra mensaje de error

3. **Interacción del Usuario:**
   - Click en repositorio → Abre en nueva pestaña
   - Click en "Ver en GitHub" → Abre perfil del usuario

## Características Implementadas

✅ Llamadas HTTP GET con Axios
✅ Tipos TypeScript para seguridad de tipos
✅ Estados de carga y error
✅ Spinner de carga
✅ Mensajes de error descriptivos
✅ Lista de repositorios con información real
✅ Perfil de usuario con estadísticas
✅ Enlaces clickeables a GitHub
✅ Responsive design
✅ Estilos modernos con CSS

## Dependencias Utilizadas

```json
{
  "axios": "^latest",
  "@ionic/react": "^8.5.0",
  "react": "19.0.0",
  "react-router-dom": "^5.3.4"
}
```

## Notas Importantes

- La API de GitHub tiene límites de rate limiting (60 solicitudes/hora sin autenticación)
- Para aumentar el límite, se puede usar un token de GitHub en los headers
- Los datos se cargan solo una vez al montar el componente
- Se recomienda añadir un botón de "Recargar" para permitir actualizar los datos

## Ejemplo de Uso con Autenticación (Opcional)

Para usar un token de GitHub y aumentar el límite de rate limiting:

```typescript
const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Authorization': `token ${YOUR_GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
  },
});
```

## Pruebas Recomendadas

1. Cargar la pestaña de Repositorios
2. Cargar la pestaña de Usuario
3. Cambiar el nombre de usuario y verificar que se cargan datos diferentes
4. Click en repositorio para verificar que abre GitHub
5. Probar con usuario que no existe para ver manejo de errores

