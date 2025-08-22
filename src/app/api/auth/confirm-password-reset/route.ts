
import { type NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth, isAdminAppInitialized } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  if (!isAdminAppInitialized() || !adminAuth) {
    console.error("Firebase Admin SDK is not initialized. Check your environment variables.");
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const { oobCode, newPassword } = await req.json();

    if (!oobCode || !newPassword) {
      return NextResponse.json({ message: 'Missing oobCode or newPassword' }, { status: 400 });
    }

    // 1. Verify the code and get the email.
    // This requires the Admin SDK to verify the OOB code from the client.
    const email = await adminAuth.verifyPasswordResetCode(oobCode);
    
    // 2. Get user by email via Admin SDK
    const user = await adminAuth.getUserByEmail(email);

    // 3. Update the password via Admin SDK.
    await adminAuth.updateUser(user.uid, {
      password: newPassword,
    });
    
    // 4. Revoke refresh tokens as a security best practice.
    await adminAuth.revokeRefreshTokens(user.uid);
    
    return NextResponse.json({ message: 'Password reset successfully.' }, { status: 200 });

  } catch (error: any) {
    console.error('Password reset confirmation error:', error);
    
    let message = 'An unexpected error occurred.';
    let status = 400;

    // Use error codes from firebase-admin, which may differ slightly from client SDK
    switch (error.code) {
      case 'auth/expired-action-code':
        message = 'The password reset code has expired. Please request a new one.';
        break;
      case 'auth/invalid-action-code':
        message = 'The password reset code is invalid. It may have already been used.';
        break;
      case 'auth/user-not-found':
        message = 'User not found.';
        break;
      case 'auth/weak-password':
        message = 'The new password is too weak.';
        break;
      default:
        message = "Could not reset password. Please try again.";
        status = 500;
        break;
    }

    return NextResponse.json({ message }, { status });
  }
}
