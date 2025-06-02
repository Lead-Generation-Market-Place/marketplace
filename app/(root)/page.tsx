
import HeroForm from '@/components/home/HeroForm';
import MobileApps from '@/components/home/MobileApps';
import PopularService from '@/components/home/PopularService';
import React from 'react'

const page = () => {
  return (
    <div>
      <div className="">
       <HeroForm />
       <PopularService/>
       <MobileApps />
      </div>
    </div>
  )
}

export default page
