import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { BadgeAlert, BadgeCheck, Building2, CalendarRange, ChartColumnStacked, ListTodo, ShieldCheck, Star, UserRoundCheck, Users } from 'lucide-react';


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
interface UserDetailsProps {
  user: { id: string };
  isOnline: boolean;
}

const UserDetails = ({ user, isOnline }: UserDetailsProps) => {
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
  // static review design
  const rating = 4.6;
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const totalStars = 5;
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
            className="w-20 h-20 rounded-full object-cover ring-2 ring-offset-2 ring-offset-slate-300 dark:ring-offset-slate-900"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xl font-bold">
            {fullUser.username.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold">
            {provider?.business_name || fullUser.username}
          </h2>
          {/* reviews */}
            <div className="flex items-center mt-1">
              {[...Array(filledStars)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-green-500 fill-green-500" />
              ))}
              {hasHalfStar && (
                <Star className="w-5 h-5 text-green-500 fill-green-300" />
              )}
              {[...Array(totalStars - filledStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
                <Star key={i + filledStars + 1} className="w-4 h-4 text-green-300" />
              ))}
              <span className="ml-2 text-green-600 font-medium">{rating.toFixed(1)}</span>
            </div>

          {isOnline && (
            <div className="flex items-center gap-1 mt-2">
              <p className="inline-block w-3 h-3 rounded-full bg-green-500 animate-pulse"></p>
              <p className="text-xs text-green-500">Online Now</p>
            </div>
          )}
          
        </div>
      </div>

      {provider && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-1">
          <h3 className="font-bold text-sm mb-2">Business Profile</h3>
          <hr />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-700 flex flex-row gap-2 items-center">
              <UserRoundCheck className='inline-block w-4 h-4'/>
              <span>Total Hires</span>
            </p>
            <p className="pl-6 text-xs text-gray-900">{provider.total_hires}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-700 flex flex-row gap-2 items-center">
              <CalendarRange className='inline-block w-4 h-4'/>
              <span>Last Hire Date</span>
            </p>
            <p className="pl-6 text-xs text-gray-900">
               {new Date(provider.last_hire_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-700 flex flex-row gap-2 items-center">
              <Building2 className='inline-block w-4 h-4'/>
              <span>Founded year</span>
            </p>
            <p className="pl-6 text-xs text-gray-900">{provider.founded_year}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-700 flex flex-row gap-2 items-center">
              <Users className='inline-block w-4 h-4'/>
              Number of Employees
            </p>
            <p className="pl-6 text-xs text-gray-900">{provider.employees_count}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-700 flex flex-row gap-2 items-center">
              <ChartColumnStacked className='inline-block w-4 h-4'/>
              <span>Business Type</span>
            </p>
            <p className="pl-6 text-xs text-gray-900">{provider.business_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-700 flex flex-row gap-2 items-center">
              <ListTodo className='inline-block w-4 h-4'/>
              <span>Background Check</span>
              </p>
            <p className="pl-6 text-xs text-gray-900">
              {provider.background_check_status?
              (<span className='text-green-500'>Verified</span>):
              (<span className='text-orange-400'>Not Verified</span>)
            }</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-700 flex flex-row gap-2 items-center">
              <ShieldCheck className='inline-block w-4 h-4'/>
              <span>Guarantee</span>
              </p>
            <p className="pl-6 text-xs text-gray-900">
              {provider.guarantee?(
                <BadgeCheck className='w-4 h-4 text-sky-500'/>
              ):(
                <BadgeAlert className='w-4 h-4 text-gray-800'/>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
