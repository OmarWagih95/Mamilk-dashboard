import { NextResponse } from 'next/server';
import { removeToken } from '@/utils/auth';

export async function GET() {
  try {
    // Remove token from cookies
    const response = NextResponse.json({ message: 'Logged out successfully' });
    // removeToken(response);
    removeToken()
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 