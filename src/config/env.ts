/**
 * GitHub Configuration from Environment Variables
 * 
 * Las variables se cargan desde el archivo .env
 * 
 * Para configurar:
 * 1. Copia .env.example a .env
 * 2. Reemplaza YOUR_GITHUB_TOKEN_HERE con tu token real
 * 3. Obtén tu token en: https://github.com/settings/tokens
 * 
 * ⚠️ IMPORTANTE: Nunca subes .env a GitHub (está en .gitignore)
 */

export const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';
export const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'EvillegasG';

export const DEFAULT_REPO_CONFIG = {
  private: false,
  auto_init: true,
  description: '',
};

export const CONFIG_MESSAGES = {
  NO_TOKEN: 'Por favor, configura VITE_GITHUB_TOKEN en tu archivo .env',
  INVALID_TOKEN: 'Token de GitHub no configurado correctamente',
};
