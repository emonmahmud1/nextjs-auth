import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateAccessToken } from '@/lib/jwt';

/**
 * REFRESH TOKEN API
 * POST /api/auth/refresh
 * 
 * Flow:
 * 1. Get refresh token from request
 * 2. Verify refresh token is valid
 * 3. Generate new access token
 * 4. Return new access token
 */
export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();

    // Check if refresh token provided
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'Refresh token required' },
        { status: 400 }
      );
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    // Generate new access token
    const newToken = generateAccessToken(decoded.userId, decoded.email);

    // Return new token
    return NextResponse.json({
      success: true,
      message: 'Token refreshed',
      data: { token: newToken }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}