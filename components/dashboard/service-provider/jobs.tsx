// app/leads/page.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Phone, Tag } from 'lucide-react'

export default function LeadsPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <nav className="space-y-2">
          <Link href="#" className="flex items-center space-x-2 p-2 rounded bg-blue-50 text-blue-600 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <span>Leads</span>
          </Link>
          <Link href="#" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <Tag className="w-5 h-5" />
            <span>Opportunities</span>
            <span className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></span>
          </Link>
        </nav>

        <div className="mt-6 space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <Calendar className="inline-block w-4 h-4 mr-2" />
            <Link href="#" className="text-blue-600 hover:underline">Review your availability</Link> and <Link href="#" className="text-blue-600 hover:underline">tell us when you are busy.</Link>
          </div>
          <div>
            <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
            </svg>
            <Link href="#" className="text-blue-600 hover:underline">Connect your content management tools or calendar to Thumbtack</Link> to streamline workflows.
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold mb-4">Welcome to Thumbtack.</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Leads that exactly match your preferences appear here.</p>

        {/* Example Card */}
        <div className="w-full max-w-sm bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 flex items-center justify-center rounded-full font-semibold">EX</div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">(Example) A customer wants your availability.</span>
          </div>
          <div className="space-y-2 text-left text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4">Start getting leads by finishing account setup.</p>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">Finish setup</button>
      </main>
    </div>
  )
}
