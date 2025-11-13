import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDatabase } from '@/lib/mongodb';
import { UserDocument, userToResponse } from '@/models/User';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';

/**
 * REGISTER API with MongoDB
 * POST /api/auth/register
 * 
 * Flow:
 * 1. Get name, email, password from request
 * 2. Check if email already exists in database
 * 3. Hash the password (NEVER store plain password!)
 * 4. Save user to MongoDB
 * 5. Generate JWT tokens
 * 6. Return success with user data and tokens
 */
export async function POST(request: NextRequest) {
  try {
    // Get data from request body
    const { name, email, password } = await request.json();

    // Validation: Check if all fields provided
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields required' },
        { status: 400 }
      );
    }

    // Validation: Check password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const db = await getDatabase();
    const usersCollection = db.collection<UserDocument>('users');

    // Check if email already exists
    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password (10 rounds of bcrypt)
    // Why hash? So if database is stolen, passwords are safe!
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document
    const newUser: UserDocument = {
      email: email.toLowerCase(),
      password: hashedPassword,  // Save HASHED password, not plain text!
      name: name,
      role: 'user',
      createdAt: new Date(),
    };

    // Save to MongoDB
    const result = await usersCollection.insertOne(newUser);
    
    // Get the created user (with _id)
    const createdUser = await usersCollection.findOne({ _id: result.insertedId });
    
    if (!createdUser) {
      return NextResponse.json(
        { success: false, message: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Generate JWT tokens
    const userId = createdUser._id.toString();
    const token = generateAccessToken(userId, createdUser.email);
    const refreshToken = generateRefreshToken(userId, createdUser.email);

    // Convert user to safe response (removes password)
    const userResponse = userToResponse(createdUser);

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: { 
        user: userResponse,
        token,
        refreshToken 
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
