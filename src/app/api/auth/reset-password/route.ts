
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await auth.generatePasswordResetLink(email);

    return NextResponse.json({ message: 'Password reset email sent successfully.' }, { status: 200 });
  } catch (error: any) {
    console.error('Password reset error:', error);
    
    // Provide a more user-friendly error message
    let errorMessage = 'An unexpected error occurred.';
    let statusCode = 500;

    if (error.code === 'auth/user-not-found') {
      // Don't reveal that the user does not exist.
      // Return a generic success message to prevent user enumeration attacks.
      return NextResponse.json({ message: 'Password reset email sent successfully.' }, { status: 200 });
    } else {
        errorMessage = 'Failed to send password reset email. Please try again later.';
    }

    return NextResponse.json({ message: errorMessage }, { status: statusCode });
  }
}
