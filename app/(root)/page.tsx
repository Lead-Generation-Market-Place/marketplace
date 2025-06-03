
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
    <div>
      <div className="">
       <HeroForm />
       {/* Homepage content start */}
          <Promotion />
          <PopularService/>
          <TopPick />
          <Statistics />
          <Trending />
          <NewService />
          <MobileApps />
        {/* Homepage content end */}
      </div>
    </div>
  )
}

export default page
