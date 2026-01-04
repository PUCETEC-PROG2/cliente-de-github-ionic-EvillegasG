/**
 * GitHub Configuration Example
 * 
 * INSTRUCCIONES:
 * 1. Copia este archivo a githubConfig.ts
 * 2. Reemplaza 'YOUR_TOKEN_HERE' con tu token real de GitHub
 * 3. NO subas githubConfig.ts a GitHub (está en .gitignore)
 * 
 * Para crear un token de GitHub:
 * 1. Ve a: https://github.com/settings/tokens
 * 2. Click en "Generate new token"
 * 3. Selecciona scope: public_repo (para repositorios públicos) o repo (para privados)
 * 4. Copia el token y pégalo abajo en GITHUB_TOKEN
 * 
 * ⚠️ IMPORTANTE: Nunca compartas este token
 * Si se expone, puedes revocarlo en https://github.com/settings/tokens
 */

// Reemplaza esto con tu token de GitHub
export const GITHUB_TOKEN = 'YOUR_TOKEN_HERE';

// Tu nombre de usuario en GitHub
export const GITHUB_USERNAME = 'EvillegasG';

// Configuración de repositorio por defecto
export const DEFAULT_REPO_CONFIG = {
  private: false,
  auto_init: true,
  description: '',
};

// Mensajes de configuración
export const CONFIG_MESSAGES = {
  NO_TOKEN: 'Por favor, configura tu token de GitHub en src/config/githubConfig.ts',
  INVALID_TOKEN: 'Token de GitHub no configurado correctamente',
};
