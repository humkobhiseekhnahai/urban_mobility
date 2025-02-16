import React from 'react'
import Navbar_home from '../components/homeComponents/navBar_home'
import HeroSection from '../components/homeComponents/heroSection'
import Features from '../components/homeComponents/features'
import Footer from '../components/homeComponents/footer'

const Home = () => {
  return (
    <>
        <Navbar_home />
        <div className="max-w-7xl mx-auto pt-20 px-6">
            <HeroSection />
            <Features />
            <Footer />
            </div>
    </>
  )
}

export default Home