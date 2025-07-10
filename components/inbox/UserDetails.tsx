import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

interface ServiceProvider {
  id: string;
  founded_year: number;
  employees_count: number;
  business_type: string;
  background_check_status: string;
  guarantee: string;
  is_online_now: boolean;
  last_seen_at: string;
  last_active_at: string;
  total_hires: number;
  last_hire_date: string;
  contact_value: string;
  preferred_contact: string;
  provider_rating_avg: number;
  total_reviews: number;
  business_name: string;
  created_at: string;
}

interface UserDetails {
  id: string;
  username: string;
  email: string;
  profile_picture_url?: string;
  status?: string;
  subscription_type?: string;
  service_providers?: ServiceProvider[];
}

const UserDetails = ({ user }: { user: { id: string } }) => {
  const [fullUser, setFullUser] = useState<UserDetails | null>(null);
  const [publicAvatarUrl, setPublicAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();

      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from('users_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('Error fetching user:', userError.message);
        return;
      }

      // Fetch service provider data
      const { data: providerData, error: providerError } = await supabase
        .from('service_providers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (providerError && providerError.code !== 'PGRST116') {
        console.error('Error fetching provider:', providerError.message);
        return;
      }

      // Get public avatar URL
      if (userData?.profile_picture_url) {
        const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/userprofilepicture/${userData.profile_picture_url}`;
        setPublicAvatarUrl(publicUrl);
      }

      // Merge data
      setFullUser({
        ...userData,
        service_providers: providerData ? [providerData] : [],
      });
    };

    if (user?.id) fetchUser();
  }, [user?.id]);

  if (!fullUser) return <p>Loading user...</p>;

  const provider = fullUser.service_providers?.[0];

  return (
    <div className="space-y-4 text-sm text-gray-800 dark:text-gray-100">
      <div className="flex items-center gap-4">
        {publicAvatarUrl ? (
          <Image
            src={publicAvatarUrl}
            alt={fullUser.username}
            width={64}
            height={64}
            loading="lazy"
            className="w-16 h-16 rounded object-cover border"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xl font-bold">
            {fullUser.username.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold">{fullUser.username}</h2>
          <p className="text-gray-500 text-[12px]">{fullUser.email}</p>
          {fullUser.status && <p>Status: <span className="text-green-500">{fullUser.status}</span></p>}
          {fullUser.subscription_type && (
            <p>Subscription: {fullUser.subscription_type}</p>
          )}
        </div>
      </div>

      {provider && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-1">
          <h3 className="font-bold text-sm mb-2">Business Profile</h3>
          <p><strong>Business:</strong> {provider.business_name}</p>
          <p><strong>Founded:</strong> {provider.founded_year}</p>
          <p><strong>Employees:</strong> {provider.employees_count}</p>
          <p><strong>Type:</strong> {provider.business_type}</p>
          <p><strong>Background Check:</strong> {provider.background_check_status}</p>
          <p><strong>Guarantee:</strong> {provider.guarantee}</p>
          <p><strong>Online Now:</strong> {provider.is_online_now ? 'Yes' : 'No'}</p>
          <p><strong>Total Hires:</strong> {provider.total_hires}</p>
          <p><strong>Rating:</strong> {provider.provider_rating_avg} ({provider.total_reviews} reviews)</p>
          <p><strong>Preferred Contact:</strong> {provider.preferred_contact} ({provider.contact_value})</p>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
