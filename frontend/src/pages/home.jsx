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
      <div id="home" className="scroll-mt-20">
        <HeroSection />
      </div>
      <div id="features" className="scroll-mt-60 mb-10">
        <Features />
      </div>
      <Cards />
      <Testimonials />
      <div id="about" className="scroll-mt-20">
        <AboutUs />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
