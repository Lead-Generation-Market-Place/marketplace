import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
interface UserDetails {
  username: string;
  email: string;
}
const UserDetails = ({ user }: { user: { id: string } }) => {
  const [fullUser, setFullUser] = useState<UserDetails | null>(null);
 

  useEffect(() => {
    const fetchUser = async () => {
       const supabase =  createClient();
      const { data, error } = await supabase
        .from('users_profiles') // or 'profiles', whatever your table is
        .select('username, email')
        .eq('id', user.id)
        .single();

      if (data) setFullUser(data);
      if (error) {
        console.error('Error fetching user:', error.message);
        return;
      }
    };
    if (user?.id) fetchUser();
  }, [user?.id]);

  return (
    <div className="flex items-center gap-4">
      {fullUser ? (
        <>
          <div>
            <h2 className="text-lg font-semibold">{fullUser.username}</h2>
            <p className="text-sm text-gray-500">{fullUser.email}</p>
          </div>
        </>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
};

export default UserDetails;
