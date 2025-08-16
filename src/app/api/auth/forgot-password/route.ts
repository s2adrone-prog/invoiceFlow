import { users } from '@/lib/mock-db';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
    }

    const userExists = users.some(u => u.email === email);

    if (userExists) {
        // In a real application, you would generate a reset token, save it to the database,
        // and send an email with a reset link to the user.
        console.log(`Password reset requested for ${email}. In a real app, an email would be sent.`);
    } else {
        // Even if the user doesn't exist, we send a success response to prevent user enumeration.
        console.log(`Password reset requested for non-existent user ${email}.`);
    }

    return new Response(JSON.stringify({ message: 'If a user with that email exists, a password reset link has been sent.' }), { status: 200 });

  } catch (error) {
    console.error('Forgot password error:', error);
    return new Response(JSON.stringify({ message: 'An internal server error occurred' }), { status: 500 });
  }
}
