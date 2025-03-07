import React from 'react';
import Navbar_home from '../components/homeComponents/navBar_home';
import HeroSection from '../components/homeComponents/heroSection';
import Features from '../components/homeComponents/features';
import Cards from '../components/homeComponents/cards';
import Testimonials from '../components/homeComponents/testimonials';
import Footer from '../components/homeComponents/footer';
import StarBackground from '../components/homeComponents/StarBackground';
import AboutUs from '../components/homeComponents/aboutUs';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <StarBackground />
      <Navbar_home />
      <div id="home">
        <HeroSection />
      </div>
      
        <Features />
        <div id="features">
        <Cards />
      </div>
      <Testimonials />
      <div id="about">
        <AboutUs />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
