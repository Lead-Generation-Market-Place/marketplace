'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '../(dashboard)/layout/AppHeader'
import AppSidebar from '../(dashboard)/layout/AppSidebar'
import Backdrop from '@/app/(dashboard)/layout/Backdrop'
import { useSidebar } from '@/app/(dashboard)/context/SidebarContext'
import { createClient } from '@/utils/supabase/client'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Check for authentication
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
      } else {
        setIsAuthenticated(true)
      }
    }

    checkAuth()
  }, [router, supabase])

  // While checking session, render nothing or a loader
  if (isAuthenticated === null) {
    return <div className="text-center p-10">Checking authentication...</div>
  }

  // Sidebar margin logic
  const mainContentMargin = isMobileOpen
    ? 'ml-0'
    : isExpanded || isHovered
    ? 'lg:ml-[290px]'
    : 'lg:ml-[90px]'

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-[1440px] md:p-6 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
          {children}
        </div>
      </div>
    </div>
  )
}
