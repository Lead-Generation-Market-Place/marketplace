// pages/users.tsx
import { createClient } from '@/utils/supabase/client';

// Define the User type
type User = {
  id: string;
  email: string;
  // Add any other fields you have in your users table
};



export default async function UsersPage() {
  const { data: users, error } = await createClient()
    .from('users')
    .select('*');

  if (error) {
    console.error('Error fetching users:', error.message);
    return (
      <div>
        <h1>Users List</h1>
        <p>Error loading users.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Users List</h1>
      <ul>
        {users && users.map((user: User) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
}
