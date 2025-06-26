'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Backdrop from '@/app/(dashboard)/layout/Backdrop'
import { useSidebar } from '@/app/(dashboard)/context/SidebarContext'
import { createClient } from '@/utils/supabase/client'
import LoadingScreen from './layout/FullScreenLoader'
import { User } from '@supabase/supabase-js'
import { Toaster } from "@/components/ui/sonner"


// Lazy load AppSidebar and AppHeader
const AppSidebar = dynamic(() => import('./layout/AppSidebar'), {
  ssr: false,
  loading: () => <></>, // we control loading status manually
})
const AppHeader = dynamic(() => import('./layout/AppHeader'), {
  ssr: false,
  loading: () => <></>,
})

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar()

  const [status, setStatus] = useState('Initializing...')
  const [authReady, setAuthReady] = useState(false)
  const [sidebarData, setSidebarData] = useState<{ isServiceProvider: boolean }>({
    isServiceProvider: false,
  })
  const [headerData, setHeaderData] = useState<{
    user: User | null
    isServiceProvider: boolean
    profile: {
      id: string;
      user_id: string;
      full_name: string;
      username: string;
      bio: string;
    } | null
  }>({
    user: null,
    isServiceProvider: false,
    profile: null,
  })
  const [dataReady, setDataReady] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  // Authentication check
  useEffect(() => {
    setStatus('Authenticating user...')
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
      } else {
        setAuthReady(true)
      }
    }

    checkAuth()
  }, [router, supabase])

  // Fetch all required data for sidebar and header
  useEffect(() => {
    if (!authReady) return
    setStatus('Loading...')
    const fetchData = async () => {
      // Fetch user and service provider status
      const { data: { user } } = await supabase.auth.getUser();
      let isServiceProvider = false;
      let profile = null;
      if (user) {
        const { data: serviceProvider, error } = await supabase
          .from("service_providers")
          .select("*")
          .eq("user_id", user.id)
          .single();
        isServiceProvider = !!serviceProvider && !error;
        // Fetch user profile
        const { data: profileData } = await supabase
          .from("users_profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        profile = profileData || null;
      }
      setSidebarData({ isServiceProvider });
      setHeaderData({ user, isServiceProvider, profile });
      setDataReady(true);
    };
    fetchData();
  }, [authReady])

  if (!authReady || !dataReady) return <LoadingScreen status={status} />

  const mainContentMargin = isMobileOpen
    ? 'ml-0'
    : isExpanded || isHovered
    ? 'lg:ml-[290px]'
    : 'lg:ml-[90px]'

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar isServiceProvider={sidebarData.isServiceProvider} />
      <Backdrop />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
        <AppHeader user={headerData.user} profile={headerData.profile} />
        <div className="p-4 mx-auto max-w-[1440px] md:p-6 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
          {children}
                  <Toaster />

        </div>
      </div>
    </div>
  )
}
