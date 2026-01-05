# Examen Parcial 2: Gestión Completa CRUD con DELETE y PATCH

## 📋 Descripción General

Implementación de funcionalidades avanzadas de gestión de repositorios GitHub utilizando los métodos HTTP DELETE y PATCH. El proyecto ahora soporta un ciclo CRUD completo (Create, Read, Update, Delete).

## 🎯 Endpoints Implementados

### DELETE - Eliminar Repositorio
```
DELETE /repos/{owner}/{repo}
Elimina un repositorio completo del usuario
```

**Código de la función:**
```typescript
export const deleteRepository = async (
  owner: string,
  repo: string,
  token: string
): Promise<void> => {
  const authenticatedApi = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  await authenticatedApi.delete(`/repos/${owner}/${repo}`);
};
```

**Manejo de Errores:**
- 401: Token inválido
- 403: Sin permisos para eliminar
- 404: Repositorio no encontrado

---

### PATCH - Actualizar Repositorio
```
PATCH /repos/{owner}/{repo}
Actualiza campos de un repositorio existente
```

**Código de la función:**
```typescript
export const updateRepository = async (
  owner: string,
  repo: string,
  updateData: UpdateRepositoryRequest,
  token: string
): Promise<Repository> => {
  const authenticatedApi = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  const response = await authenticatedApi.patch<Repository>(
    `/repos/${owner}/${repo}`,
    updateData
  );

  return response.data;
};
```

**Campos Actualizables:**
```typescript
interface UpdateRepositoryRequest {
  name?: string;
  description?: string;
  private?: boolean;
  homepage?: string;
  has_wiki?: boolean;
  has_issues?: boolean;
  has_projects?: boolean;
}
```

---

## 📁 Archivos Modificados

### 1. `src/services/githubService.ts`
- ✅ Agregada función `deleteRepository()`
- ✅ Agregada función `updateRepository()`
- ✅ Nueva interfaz `UpdateRepositoryRequest`
- ✅ Manejo completo de errores HTTP

### 2. `src/components/RepoItem.tsx`
- ✅ Nuevas props `onEdit` y `onDelete` (opcionales)
- ✅ Botón de editar (ícono de lápiz)
- ✅ Botón de eliminar (ícono de papelera)
- ✅ Manejadores de clic con stop propagation
- ✅ Acciones en slot="end"

### 3. `src/components/RepoItem.css`
- ✅ Estilos para `.repo-actions`
- ✅ Botones con iconos bien alineados
- ✅ Hover effects para mejor UX

### 4. `src/components/EditRepoModal.tsx` (NUEVO)
- ✅ Modal para editar repositorios
- ✅ Campos: nombre, descripción, privacidad
- ✅ Validación de formulario
- ✅ Estados de carga
- ✅ Manejo de errores

### 5. `src/components/EditRepoModal.css` (NUEVO)
- ✅ Estilos para el modal
- ✅ Alertas de error
- ✅ Spinner de carga
- ✅ Acciones de botones

### 6. `src/pages/Tab1.tsx`
- ✅ Estados para modal de edición
- ✅ Estados para confirmación de eliminación
- ✅ Estados para feedback visual
- ✅ Función `handleEditRepo()`
- ✅ Función `handleSaveChanges()`
- ✅ Función `handleDeleteRepo()`
- ✅ Función `confirmDelete()`
- ✅ Modal EditRepoModal integrado
- ✅ Alert de confirmación para eliminar
- ✅ Toasts para feedback

---

## 🎨 Interfaz de Usuario

### Botones en Cada Repositorio
```
[Avatar] Nombre Repo | ⭐ Stars | [✏️ Edit] [🗑️ Delete]
```

### Modal de Edición
- Título: "Editar Repositorio"
- Campo de nombre (obligatorio)
- Campo de descripción (opcional)
- Checkbox para privacidad
- Botones: Guardar Cambios / Cancelar

### Confirmación de Eliminación
```
Título: "Eliminar Repositorio"
Mensaje: "¿Estás seguro de que deseas eliminar 'nombre-repo'? 
          Esta acción no se puede deshacer."
Botones: [Cancelar] [Eliminar]
```

---

## ✨ Características Implementadas

### 1. Ciclo CRUD Completo
- ✅ **Create** (POST) - Crear repositorio (Laboratorio 9)
- ✅ **Read** (GET) - Leer repositorios (Laboratorio 8)
- ✅ **Update** (PATCH) - Editar repositorio (Examen 2)
- ✅ **Delete** (DELETE) - Eliminar repositorio (Examen 2)

### 2. Confirmaciones de Acciones Destructivas
- ✅ Alert modal antes de eliminar
- ✅ Mensaje claro con nombre del repositorio
- ✅ Advertencia de irreversibilidad
- ✅ Opción de cancelar

### 3. Actualización Dinámica de Interfaz
- ✅ Lista se actualiza inmediatamente después de editar
- ✅ Lista se actualiza inmediatamente después de eliminar
- ✅ No es necesario refrescar manualmente
- ✅ Pull-to-refresh sigue disponible

### 4. Manejo Completo de Errores
```typescript
// Error 401: Token inválido
// Error 403: Sin permisos
// Error 404: Repositorio no encontrado
// Error 422: Datos inválidos (en actualización)
```

### 5. Feedback Visual
- ✅ Spinner durante operaciones
- ✅ Toast de éxito (verde) con mensaje
- ✅ Toast de error (rojo) con detalles
- ✅ Estados de carga en botones
- ✅ Deshabilitación de inputs durante carga

---

## 🔐 Seguridad

### Token Protection
- Token almacenado en `src/config/githubConfig.ts` (ignorado en git)
- Usado automáticamente en Tab1 para todas las operaciones
- Nunca se expone en URLs o logs

### Validaciones
- Nombre de repositorio obligatorio
- Confirmación antes de eliminar
- Manejo de permisos insuficientes
- Verificación de existencia de repositorio

---

## 📊 Estado de Implementación

| Característica | Estado |
|---|---|
| GET /users/:username/repos | ✅ Completo |
| GET /user | ✅ Completo |
| POST /user/repos | ✅ Completo |
| DELETE /repos/{owner}/{repo} | ✅ **Nuevo** |
| PATCH /repos/{owner}/{repo} | ✅ **Nuevo** |
| Pull-to-refresh | ✅ Funcional |
| Modal de edición | ✅ Funcional |
| Confirmación de eliminar | ✅ Funcional |
| Feedback visual | ✅ Completo |

---

## 🚀 Flujo de Usuario

### Para Editar un Repositorio
1. Ver lista de repositorios
2. Click en botón ✏️ (editar)
3. Se abre modal con datos actuales
4. Modificar campos deseados
5. Click "Guardar Cambios"
6. Lista se actualiza automáticamente
7. Toast de éxito muestra confirmación

### Para Eliminar un Repositorio
1. Ver lista de repositorios
2. Click en botón 🗑️ (eliminar)
3. Aparece alert de confirmación
4. Click "Eliminar" para confirmar
5. Repositorio se elimina del servidor
6. Lista se actualiza automáticamente
7. Toast de éxito muestra confirmación

---

## 💡 Casos de Uso

### Caso 1: Cambiar Descripción
```typescript
// Usuario cambia la descripción sin cambiar privacidad
updateData = {
  description: "Nueva descripción del proyecto"
}
```

### Caso 2: Hacer Repositorio Privado
```typescript
// Usuario quiere hacer un repositorio privado
updateData = {
  private: true
}
```

### Caso 3: Cambiar Nombre y Descripción
```typescript
// Usuario renombra repositorio y actualiza descripción
updateData = {
  name: "nuevo-nombre",
  description: "Nueva descripción"
}
```

### Caso 4: Eliminar Repositorio
```typescript
// Usuario quiere eliminar un repositorio
deleteRepository(owner, repoName, token)
// Se ejecuta después de confirmación
```

---

## 🧪 Verificación de Funcionamiento

### Test Manual
1. **Editar:** Cambiar descripción de un repo → Debe guardarse
2. **Eliminar:** Intentar eliminar un repo → Debe pedir confirmación
3. **Rechazar:** Click "Cancelar" en confirmación → No debe eliminar
4. **Error:** Usar token inválido → Debe mostrar error específico
5. **Refresco:** Deslizar hacia abajo → Debe actualizar lista

---

## 📝 Notas Técnicas

### Por qué onIonModalDidPresent en lugar de onIonModalDidEnter
La API de Ionic React cambió el nombre del evento. `onIonModalDidPresent` se ejecuta cuando el modal está completamente presentado y el DOM está listo.

### Por qué stop propagation en botones
Los botones están dentro de un IonItem clickeable, por lo que necesitan `e.stopPropagation()` para evitar que el click del botón abra el repositorio en GitHub.

### Por qué actualizar lista localmente
Actualizar la lista sin refrescar desde el servidor es más rápido y mejora la UX. El servidor ya confirmó el cambio.

---

## ✅ Checklist de Requisitos

- [x] Implementación del método DELETE
- [x] Implementación del método PATCH
- [x] Confirmaciones de acciones destructivas
- [x] Actualización dinámica de la interfaz
- [x] Manejo completo del ciclo CRUD
- [x] Endpoints DELETE /repos/{owner}/{repo}
- [x] Endpoints PATCH /repos/{owner}/{repo}
- [x] Feedback visual (toasts, alerts, spinners)
- [x] Manejo de errores HTTP
- [x] Componente modal para edición
- [x] Validación de formularios

---

## 🎓 Conclusión

El Examen Parcial 2 implementa exitosamente un sistema completo de gestión de repositorios con operaciones avanzadas de lectura, creación, actualización y eliminación. La aplicación ahora es una herramienta funcional para administrar repositorios GitHub de forma segura y eficiente.
