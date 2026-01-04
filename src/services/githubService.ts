import axios from 'axios';

// Configure axios instance for GitHub API
const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
  },
});

// User interface for type safety
export interface User {
  login: string;
  id: number;
  avatar_url: string;
  url: string;
  html_url: string;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

// Repository interface for type safety
export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  description: string | null;
  url: string;
  private: boolean;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

/**
 * Fetch repositories for a specific GitHub user
 * GET /users/:username/repos
 * @param username - GitHub username
 * @returns Promise with array of repositories
 */
export const getUserRepositories = async (username: string): Promise<Repository[]> => {
  try {
    const response = await githubApi.get<Repository[]>(`/users/${username}/repos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user repositories:', error);
    throw new Error('Failed to fetch user repositories');
  }
};

/**
 * Fetch user information
 * GET /users/:username
 * @param username - GitHub username
 * @returns Promise with user information
 */
export const getUserInfo = async (username: string): Promise<User> => {
  try {
    const response = await githubApi.get<User>(`/users/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw new Error('Failed to fetch user information');
  }
};

// Interface for creating a new repository
export interface CreateRepositoryRequest {
  name: string;
  description?: string;
  private?: boolean;
  auto_init?: boolean;
}

/**
 * Create a new repository for the authenticated user
 * POST /user/repos
 * @param repoData - Repository data
 * @param token - GitHub personal access token
 * @returns Promise with created repository
 * 
 * NOTE: This requires authentication. You need to provide a GitHub token.
 * Token can be generated at: https://github.com/settings/tokens
 * Scopes required: 'public_repo' or 'repo' (for private repos)
 */
export const createRepository = async (
  repoData: CreateRepositoryRequest,
  token: string
): Promise<Repository> => {
  try {
    // Create a new axios instance with the token
    const authenticatedApi = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const response = await authenticatedApi.post<Repository>('/user/repos', {
      name: repoData.name,
      description: repoData.description || '',
      private: repoData.private || false,
      auto_init: repoData.auto_init !== undefined ? repoData.auto_init : true,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating repository:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const data = error.response.data as any;
      
      if (status === 401) {
        throw new Error('Token inválido. Por favor, verifica tu token de GitHub.');
      } else if (status === 422) {
        throw new Error(data.message || 'Datos inválidos. Verifica el nombre del repositorio.');
      } else if (status === 403) {
        throw new Error('No tienes permisos para crear repositorios.');
      }
    }
    
    throw new Error('Error al crear el repositorio. Por favor, intenta de nuevo.');
  }
};
