import React from 'react';
import DisplayProductSection from './components/DisplayProductSection';
import HeroSection from './components/HeroSection';

type Props = {};

const HomePageView = (props: Props) => {
  return (
    <div className="w-full px-4 md:px-12 lg:px-24 space-y-6">
      <HeroSection />
      <DisplayProductSection />
    </div>
  );
};

export default HomePageView;
