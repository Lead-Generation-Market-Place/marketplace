import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
    <h1 className="text-5xl text-white font-bold mb-8 animate-pulse">
        Coming Soon
    </h1>
    <p className="text-white text-lg mb-8">
        We are working hard to bring you something amazing. Stay tuned!
    </p>
    <Link className='text-gray-900 bg-white/80 px-4 py-2 m-2 rounded-[4px]' href="/about">About</Link>
    <Link className='text-gray-900 bg-white/80 px-4 py-2 m-2 rounded-[4px]' href="/dashboard">Dashboard</Link>

    <Link className='text-gray-900 bg-white/80 px-4 py-2 m-2 rounded-[4px]' href="/auth/login">login</Link>

  </div>
  )
}

export default page
