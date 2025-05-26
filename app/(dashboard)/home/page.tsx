'use client';

import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

type UserProfile = {
  id: string;
  user_id: string;
  full_name: string;
  username: string;
  bio: string;
  // Add more fields based on your schema
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserAndProfile() {
      const supabase = createClient();

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.log('User not logged in.');
        setLoading(false);
        return;
      }

      setUser(userData.user);

      const { data: profileData, error: profileError } = await supabase
        .from('users_profiles')
        .select('*')
        .eq('id', userData.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setProfile(profileData);
      }

      setLoading(false);
    }

    fetchUserAndProfile();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">User Auth Info</h2>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
        ) : user ? (
          <ul className="space-y-1">
            <li><strong>Email:</strong> {user.email}</li>
            <li><strong>User ID:</strong> {user.id}</li>
          </ul>
        ) : (
          <p>User not found.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">User Profile Info</h2>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        ) : profile ? (
          <ul className="space-y-1">
            <li><strong>Username:</strong> {profile.username}</li>
            <li><strong>Full Name:</strong> {profile.full_name}</li>
            <li><strong>Bio:</strong> {profile.bio}</li>
          </ul>
        ) : (
          <p>Profile not found.</p>
        )}
      </div>
    </div>
  );
}
