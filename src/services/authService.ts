import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { 
  User, 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse,
  TokenPayload 
} from '@/types/auth';

/**
 * SIMPLE Authentication Service - Just functions, no class!
 */

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Login - Call our API
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include', // Important for cookies!
    });

    const data = await response.json();
    return data; // Just return data, don't save token here

  } catch (error) {
    return {
      success: false,
      message: 'Login failed',
    };
  }
}

/**
 * Register - Call our API
 */
export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include', // Important for cookies!
    });

    const data = await response.json();
    return data; // Just return data, don't save token here

  } catch (error) {
    return {
      success: false,
      message: 'Registration failed',
    };
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(): Promise<boolean> {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include',
    });

    const data = await response.json();
    
    if (data.success && data.data.token) {
      setToken(data.data.token);
      return true;
    }
    
    return false;

  } catch (error) {
    return false;
  }
}

/**
 * Logout
 */
export async function logout(): Promise<void> {
  // Call logout API to invalidate tokens on server
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout API error:', error);
  }
  
  // Clear local tokens
  removeToken();
  removeRefreshToken();
}

/**
 * Get current user from token
 */
export async function getCurrentUser(): Promise<User> {
  const token = getToken();
  if (!token) {
    throw new Error('No token');
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.email.split('@')[0],
    };
  } catch {
    throw new Error('Invalid token');
  }
}

/**
 * Save token to localStorage
 */
export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * Get token from localStorage
 */
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * Remove token
 */
export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Save refresh token to localStorage
 */
export function setRefreshToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
}

/**
 * Remove refresh token
 */
export function removeRefreshToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

/**
 * Check if token expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
}

/**
 * ============================================
 * AXIOS SETUP WITH INTERCEPTORS
 * ============================================
 * This automatically adds token to ALL requests!
 */

// Create axios instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR - Automatically add token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Handle errors and auto-refresh token
apiClient.interceptors.response.use(
  (response) => response, // If success, just return
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry original request with new token
        const token = getToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);
