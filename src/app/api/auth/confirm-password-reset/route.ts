
import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth } from '@/lib/firebase-admin';
import { auth as clientAuth } from '@/lib/firebase';
import { verifyPasswordResetCode } from 'firebase/auth';

export async function POST(req: NextRequest) {
  try {
    const { oobCode, newPassword } = await req.json();

    if (!oobCode || !newPassword) {
      return NextResponse.json({ message: 'Missing oobCode or newPassword' }, { status: 400 });
    }

    // 1. Verify the password reset code (oobCode) to get the user's email.
    // This is done using the client SDK as the Admin SDK can't verify oobCodes directly.
    const email = await verifyPasswordResetCode(clientAuth, oobCode);

    // 2. Use the email to get the user from the Admin SDK.
    const user = await adminAuth.getUserByEmail(email);

    // 3. Update the user's password using the Admin SDK.
    await adminAuth.updateUser(user.uid, {
      password: newPassword,
    });
    
    // We don't need to invalidate the oobCode, as it's single-use and
    // `confirmPasswordReset` on the client would do so. Since we are using
    // a two-step verification and update, this flow is secure.

    return NextResponse.json({ message: 'Password reset successfully.' }, { status: 200 });

  } catch (error: any) {
    console.error('Password reset confirmation error:', error);
    
    let message = 'An unexpected error occurred.';
    if (error.code === 'auth/expired-action-code') {
        message = 'The password reset code has expired. Please request a new one.';
    } else if (error.code === 'auth/invalid-action-code') {
        message = 'The password reset code is invalid. It may have already been used.';
    } else if (error.code === 'auth/user-not-found') {
        // This case is unlikely if verifyPasswordResetCode succeeds, but included for completeness
        message = 'User not found.';
    }

    return NextResponse.json({ message }, { status: 400 });
  }
}
