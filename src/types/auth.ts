// Authentication related types

/**
 * User object structure
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  createdAt?: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration credentials
 */
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Authentication response from API
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
    refreshToken?: string;
  };
  error?: string;
}

/**
 * Authentication context state
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

/**
 * Token payload structure (decoded JWT)
 */
export interface TokenPayload {
  userId: string;
  email: string;
  exp: number;
  iat: number;
}
