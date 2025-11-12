import { jwtDecode } from 'jwt-decode';
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
    
    // Save tokens if login successful
    if (data.success && data.data) {
      if (data.data.token) setToken(data.data.token);
      if (data.data.refreshToken) setRefreshToken(data.data.refreshToken);
    }
    
    return data;

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
    
    // Save tokens if registration successful
    if (data.success && data.data) {
      if (data.data.token) setToken(data.data.token);
      if (data.data.refreshToken) setRefreshToken(data.data.refreshToken);
    }
    
    return data;

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
 * Make authenticated API call
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });
}
