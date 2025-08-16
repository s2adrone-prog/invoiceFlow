// In a real app, this would be a proper database connection.
// For this prototype, we're using an in-memory array that persists
// across API requests for the lifetime of the server instance.

export const users = [
    // Default user for easy testing
    { id: '1', email: 'm@example.com', password: 'password', name: 'Mock User' }
];
