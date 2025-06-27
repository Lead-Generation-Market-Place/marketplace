import ActiveLocation from '@/components/home/ActiveLocation';
import BecomePro from '@/components/home/BecomePro';
import CostEstimation from '@/components/home/CostEstimation';
import HeroForm from '@/components/home/HeroForm';
import MobileApps from '@/components/home/MobileApps';
import PopularService from '@/components/home/PopularService';
import Promotion from '@/components/home/Promotion';
import Reviews from '@/components/home/Reviews';
import TopPick from '@/components/home/TopPick';
import Trending from '@/components/home/Trending';
import YouMayLike from '@/components/home/YouMayLike';
import React from 'react'

const page = () => {
  return (
    <>
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <HeroForm />
      <div className="space-y-8">
        <Promotion />
        <PopularService />
        <YouMayLike/>
      </div>
    </div>
    <MobileApps />
    <TopPick />
    <Trending />
    <CostEstimation/>
    <ActiveLocation/>
    <BecomePro />
    <Reviews />
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      
      
    </div>
    
    </>
  );
};

export default page
