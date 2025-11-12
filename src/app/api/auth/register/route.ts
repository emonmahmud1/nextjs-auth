import { NextRequest, NextResponse } from 'next/server';

/**
 * SIMPLE Register API
 * POST /api/auth/register
 */
export async function POST(request: NextRequest) {
  try {
    // Get data from request
    const { name, email, password } = await request.json();

    // Simple check: are they provided?
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields required' },
        { status: 400 }
      );
    }

    // DEMO MODE: Accept any registration
    // In real app, save to database here
    
    // Create tokens
    const token = `token_${Date.now()}`;
    const refreshToken = `refresh_${Date.now()}`;
    
    // Create user object
    const user = {
      id: '1',
      email: email,
      name: name,
      role: 'user'
    };

    // Return success with both tokens
    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: { user, token, refreshToken }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
