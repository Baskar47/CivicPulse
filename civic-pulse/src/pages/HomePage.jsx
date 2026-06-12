import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Stats from '../components/Stats';
import CTA from '../components/CTA';

const HomePage = () => {
  return (
    <div>
      <main>
        <Hero />
        <Features />
        <Stats />
        <CTA />
      </main>
    </div>
  );
};

export default HomePage;
