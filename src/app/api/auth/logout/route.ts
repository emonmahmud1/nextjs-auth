import { NextRequest, NextResponse } from 'next/server';

/**
 * Logout API
 * POST /api/auth/logout
 */
export async function POST(request: NextRequest) {
  try {
    // DEMO MODE: Just return success
    // In real app: Invalidate refresh token in database
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
