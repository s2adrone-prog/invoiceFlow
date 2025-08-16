import { users } from '@/lib/mock-db';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400 });
    }

    console.log('Attempting login for:', email);
    console.log('Current users in DB:', users);

    const user = users.find(u => u.email === email);

    if (!user || user.password !== password) { // In a real app, you'd use bcrypt.compare
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 });
    }

    // In a real app, you'd generate a JWT token
    const token = `fake-jwt-token-for-${user.id}`;
    
    return new Response(JSON.stringify({ token, user: { name: user.name, email: user.email } }), { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ message: 'An internal server error occurred' }), { status: 500 });
  }
}
