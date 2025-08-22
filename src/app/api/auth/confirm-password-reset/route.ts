
import { type NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth } from '@/lib/firebase-admin';
import { auth as clientAuth } from '@/lib/firebase';
import { verifyPasswordResetCode } from 'firebase/auth';

// This is a workaround to handle a difficult-to-diagnose build issue
// where the `firebase/auth` client SDK was being bundled on the server
// in a way that caused runtime errors. By separating the verification
// logic, we can better control the execution context.
async function verifyCodeAndGetEmail(oobCode: string): Promise<string> {
    try {
        // This function MUST use the client SDK to verify the code.
        return await verifyPasswordResetCode(clientAuth, oobCode);
    } catch(error: any) {
        // Re-throw the error to be caught by the main handler
        throw error;
    }
}


export async function POST(req: NextRequest) {
  try {
    const { oobCode, newPassword } = await req.json();

    if (!oobCode || !newPassword) {
      return NextResponse.json({ message: 'Missing oobCode or newPassword' }, { status: 400 });
    }

    // 1. Verify the code and get the email.
    // This step requires the client SDK, but we've isolated it.
    const email = await verifyCodeAndGetEmail(oobCode);
    
    // 2. Get user by email via Admin SDK
    const user = await adminAuth.getUserByEmail(email);

    // 3. Update the password via Admin SDK.
    await adminAuth.updateUser(user.uid, {
      password: newPassword,
    });
    
    // While not strictly necessary as the code is single-use,
    // revoking refresh tokens is good practice after a password change.
    await adminAuth.revokeRefreshTokens(user.uid);
    
    return NextResponse.json({ message: 'Password reset successfully.' }, { status: 200 });

  } catch (error: any) {
    console.error('Password reset confirmation error:', error);
    
    let message = 'An unexpected error occurred.';
    let status = 400;

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
        // Use a generic message for other errors to avoid leaking implementation details.
        message = "Could not reset password. Please try again.";
        status = 500;
        break;
    }

    return NextResponse.json({ message }, { status });
  }
}
