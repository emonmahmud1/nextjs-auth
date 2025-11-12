import { NextRequest, NextResponse } from 'next/server';

/**
 * Refresh Token API
 * POST /api/auth/refresh
 */
export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'Refresh token required' },
        { status: 400 }
      );
    }

    // DEMO MODE: Just generate new token
    // In real app: Verify refresh token in database
    
    const newToken = `token_${Date.now()}`;

    return NextResponse.json({
      success: true,
      message: 'Token refreshed',
      data: { token: newToken }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
