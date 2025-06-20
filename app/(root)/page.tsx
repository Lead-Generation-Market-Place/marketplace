import ActiveLocation from '@/components/home/ActiveLocation';
import CostEstimation from '@/components/home/CostEstimation';
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
    <>
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <HeroForm />
      <div className="space-y-8">
        <Promotion />
        <PopularService />
        
        {/* 
        
        
        
        
       <NewService />
         */}
      </div>
    </div>
    <MobileApps />
    <TopPick />
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
    <Trending />
    </div>
    <CostEstimation/>
    <Statistics />
    <NewService />
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <ActiveLocation/>
    </div>
    
    </>
  );
};

export default page
