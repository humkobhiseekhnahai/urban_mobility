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
      <StarBackground /> {/* Fixed position, full-screen, z-index: -10 */}
      {/* <Navbar_home /> */}
      <HeroSection />
      <Features />
      <Cards />
      <Testimonials />
      <AboutUs />
      <Footer />
    </div>
  );
};

export default HomePage;