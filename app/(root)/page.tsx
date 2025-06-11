
import HeroForm from '@/components/home/HeroForm';
import MobileApps from '@/components/home/MobileApps';
import NewService from '@/components/home/NewService';
import PopularService from '@/components/home/PopularService';
import Promotion from '@/components/home/Promotion';
import Statistics from '@/components/home/Statistics';
import TopPick from '@/components/home/TopPick';
import Trending from '@/components/home/Trending';
import React from 'react'

const page = () => {
  return (
      <div className="">
       <HeroForm />
       <div className="w-full
        max-w-full
        smmax-w-screen-sm
        md:m:ax-w-screen-md
        lg:max-w-screen-lg
        xl:max-w-screen-xl
        2xl:max-w-6xl
        mx-auto
        px-4
        py-6
        bg-white
        dark:bg-gray-900
        text-gray-900
        dark:text-white
        transition-colors
        duration-300">
       <Promotion />
       <PopularService/> 
       <TopPick />
       <Statistics />
       <NewService />
       <Trending />
       <MobileApps />
       </div>
      </div>
  )
}

export default page
