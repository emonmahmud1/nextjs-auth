import { ObjectId } from 'mongodb';

/**
 * User Document in MongoDB
 * 
 * This is how user data looks in the database:
 * - _id: MongoDB auto-generated ID
 * - email: User's email (unique)
 * - password: Hashed password (NEVER store plain password!)
 * - name: User's name
 * - createdAt: When account was created
 */
export interface UserDocument {
  _id?: ObjectId;  // MongoDB ID (optional because auto-generated)
  email: string;
  password: string;  // This will be HASHED, not plain text!
  name: string;
  role?: string;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * User Response (What we send to frontend)
 * IMPORTANT: We NEVER send password to frontend!
 */
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role?: string;
  createdAt?: string;
}

/**
 * Convert MongoDB user to safe response
 * Removes password and converts _id to id
 */
export function userToResponse(user: UserDocument): UserResponse {
  return {
    id: user._id?.toString() || '',
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt?.toISOString(),
  };
}
