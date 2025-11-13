import jwt, { SignOptions } from 'jsonwebtoken';

/**
 * SIMPLE JWT Token Helpers
 * 
 * JWT = JSON Web Token
 * Used to keep users logged in
 */

// Get secrets from environment
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

/**
 * Create Access Token (short-lived: 15 minutes)
 * 
 * Why short? More secure! If stolen, it expires quickly.
 */
export function generateAccessToken(userId: string, email: string): string {
  const payload = { 
    userId,
    email,
    type: 'access'
  };
  
  const options: any = { 
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  };
  
  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Create Refresh Token (long-lived: 7 days)
 * 
 * Used to get new access tokens without logging in again
 */
export function generateRefreshToken(userId: string, email: string): string {
  const payload = { 
    userId,
    email,
    type: 'refresh'
  };
  
  const options: any = { 
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  };
  
  return jwt.sign(payload, JWT_REFRESH_SECRET, options);
}

/**
 * Verify Access Token
 * Returns decoded data if valid, null if invalid
 */
export function verifyAccessToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return { userId: decoded.userId, email: decoded.email };
  } catch {
    return null;
  }
}

/**
 * Verify Refresh Token
 * Returns decoded data if valid, null if invalid
 */
export function verifyRefreshToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as any;
    return { userId: decoded.userId, email: decoded.email };
  } catch {
    return null;
  }
}
