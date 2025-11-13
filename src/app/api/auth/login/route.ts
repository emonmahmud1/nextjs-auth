import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDatabase } from '@/lib/mongodb';
import { UserDocument, userToResponse } from '@/models/User';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';

/**
 * LOGIN API with MongoDB
 * POST /api/auth/login
 * 
 * Flow:
 * 1. Get email and password from request
 * 2. Find user in database by email
 * 3. Compare password with hashed password
 * 4. Generate JWT tokens
 * 5. Return success with user data and tokens
 */
export async function POST(request: NextRequest) {
  try {
    // Get email and password from request body
    const { email, password } = await request.json();

    // Validation: Check if fields provided
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const db = await getDatabase();
    const usersCollection = db.collection<UserDocument>('users');

    // Find user by email
    const user = await usersCollection.findOne({ email: email.toLowerCase() });
    
    // If user not found
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare password with hashed password
    // bcrypt.compare() automatically knows how to compare hashed passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    // If password doesn't match
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT tokens
    const userId = user._id.toString();
    const token = generateAccessToken(userId, user.email);
    const refreshToken = generateRefreshToken(userId, user.email);

    // Convert user to safe response (removes password)
    const userResponse = userToResponse(user);

    // Return success with tokens
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: { 
        user: userResponse,
        token,
        refreshToken 
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}