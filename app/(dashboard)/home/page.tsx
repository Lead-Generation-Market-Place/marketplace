'use client';
import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

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

  useEffect(() => {
    async function fetchUserAndProfile() {
      const supabase = createClient();

      // Get Authenticated User
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.log('User not logged in.');
        return;
      }

      setUser(userData.user);

      // Now fetch the user's profile from your `user_profiles` table
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
    }

    fetchUserAndProfile();
  }, []);

  return (
    <div>
      <h2>User Auth Info</h2>
      {user ? (
        <ul>
          <li><strong>Email:</strong> {user.email}</li>
          <li><strong>User ID:</strong> {user.id}</li>
        </ul>
      ) : (
        <p>Loading user...</p>
      )}

      <h2>User Profile Info</h2>
      {profile ? (
        <ul>
          <li><strong>Username:</strong> {profile.username}</li>
          {/* Add more fields based on your schema */}
        </ul>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}
