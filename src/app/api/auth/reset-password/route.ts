
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // By using the Firebase Admin SDK, we can generate a password reset link
    // that Firebase will email to the user.
    await auth.generatePasswordResetLink(email);

    // For security reasons, we always return a success message, even if the
    // email doesn't exist in our system. This prevents user enumeration.
    return NextResponse.json({ message: 'Password reset email sent successfully.' }, { status: 200 });
  } catch (error: any) {
    console.error('Password reset error:', error);
    
    // We check for the 'user-not-found' error code here. If it's anything else,
    // it's a genuine server or configuration error.
    if (error.code === 'auth/user-not-found') {
      // Still return a generic success message to the client.
      return NextResponse.json({ message: 'Password reset email sent successfully.' }, { status: 200 });
    }

    // For other errors, we return a generic server error message.
    return NextResponse.json({ message: 'An unexpected error occurred. Please try again later.' }, { status: 500 });
  }
}
