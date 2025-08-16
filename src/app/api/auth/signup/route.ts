import { users } from '@/lib/mock-db';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User with this email already exists' }), { status: 400 });
    }

    // In a real app, you would hash the password
    const newUser = { id: Date.now().toString(), email, password, name };
    users.push(newUser);

    console.log('Users after signup:', users);

    return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return new Response(JSON.stringify({ message: 'Error registering user' }), { status: 500 });
  }
}
