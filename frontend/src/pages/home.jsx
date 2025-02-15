import React from 'react'
import Navbar_home from '../components/homeComponents/navBar_home'
import HeroSection from '../components/homeComponents/heroSection'

const Home = () => {
  return (
    <>
        <Navbar_home />
        <div className="max-w-7xl mx-auto pt-20 px-6">
            <HeroSection />
            </div>
    </>
  )
}

export default Home