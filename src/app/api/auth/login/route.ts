import { NextRequest, NextResponse } from 'next/server';

/**
 * SIMPLE Login API
 * POST /api/auth/login
 */
export async function POST(request: NextRequest) {
  try {
    // Get email and password from request
    const { email, password } = await request.json();

    // Simple check: are they provided?
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password required' },
        { status: 400 }
      );
    }

    // DEMO MODE: Accept any login
    // In real app, check database here
    
    // Create tokens
    const token = `token_${Date.now()}`;
    const refreshToken = `refresh_${Date.now()}`;
    
    // Create user object
    const user = {
      id: '1',
      email: email,
      name: email.split('@')[0],
      role: 'user'
    };

    // Return success with both tokens
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: { user, token, refreshToken }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
