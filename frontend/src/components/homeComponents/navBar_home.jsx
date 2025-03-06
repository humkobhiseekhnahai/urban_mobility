import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import logo from '../../assets/UPLYFT.svg';
import { navItems } from '../../constants';
import { Menu, X } from 'lucide-react';

const Navbar_home = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const controls = useAnimationControls();

  const toggleNavbar = () => setMobileDrawerOpen(!mobileDrawerOpen);

  // Scroll detection to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Only hide navbar on scroll if the mobile drawer is closed
      if (!mobileDrawerOpen && currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, mobileDrawerOpen]);

  // Animation for navbar visibility
  useEffect(() => {
    if (isVisible || mobileDrawerOpen) {
      controls.start({
        y: 0,
        transition: { type: 'spring', stiffness: 100, damping: 20 },
      });
    } else {
      controls.start({
        y: -100,
        transition: { type: 'spring', stiffness: 100, damping: 20 },
      });
    }
  }, [isVisible, mobileDrawerOpen, controls]);

  // When mobile drawer opens, make navbar visible
  useEffect(() => {
    if (mobileDrawerOpen) {
      setIsVisible(true);
    }
  }, [mobileDrawerOpen]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileDrawerOpen]);

  return (
    <AnimatePresence>
      {(isVisible || mobileDrawerOpen) && (
        <motion.nav
          className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
          initial={{ y: -100 }}
          animate={controls}
          exit={{ y: -100 }}
        >
          <div className="flex justify-center mx-2 md:mx-10">
            <div className="container px-2 md:px-4 relative lg:text-base bg-white/10 backdrop-blur-3xl drop-shadow-xl rounded-xl md:rounded-4xl mt-2">
              <div className="flex justify-between items-center py-3">
                <motion.div className="flex items-center flex-shrink-0">
                  <motion.img
                    className="h-10 w-10 md:h-15 md:w-15"
                    src={logo}
                    alt="Logo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>

                {/* Desktop Navigation */}
                <motion.ul
                  className="hidden lg:flex ml-14 space-x-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {navItems.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 + 0.2 }}
                    >
                      <a
  href={item.href}
  className="px-3 py-1 text-gray-300 transition-colors duration-300 hover:text-white font-medium"
  onClick={(e) => {
    if (item.href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }}
>
  {item.label}
</a>

                    </motion.li>
                  ))}
                </motion.ul>

                {/* Desktop Get Started Button */}
                <motion.div
                  className="hidden lg:flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <a
                    href="dashboard"
                    className="border border-white/30 text-white py-2 px-5 rounded-full hover:border-white/100 hover:bg-white/10 transition-all duration-300 font-medium text-sm"
                  >
                    Get Started
                  </a>
                </motion.div>

                {/* Mobile Menu Toggle with improved contrast */}
                <motion.div
                  className="lg:hidden flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <button
                    onClick={toggleNavbar}
                    className="text-white bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors"
                    aria-label={mobileDrawerOpen ? "Close menu" : "Open menu"}
                  >
                    {mobileDrawerOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
                </motion.div>
              </div>

              {/* Mobile Drawer */}
              <AnimatePresence>
                {mobileDrawerOpen && (
                  <>
                    {/* Overlay */}
                    <motion.div
                      className="fixed inset-0 bg-black/60 z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={toggleNavbar}
                    />

                    {/* Redesigned Mobile Drawer */}
                    <motion.div
                      className="fixed top-0 right-0 z-20 w-64 h-screen bg-black/80 backdrop-blur-xl p-6 flex flex-col"
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                      <div className="flex justify-between items-center mb-8">
                        <img src={logo} alt="Logo" className="h-8 w-8" />
                        <button
                          onClick={toggleNavbar}
                          className="text-white bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors"
                          aria-label="Close menu"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      
                      <ul className="space-y-6">
                        {navItems.map((item, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-white/10 pb-3"
                          >
                            <a
                              href={item.href}
                              className="text-white hover:text-white/80 transition-colors text-lg font-medium flex items-center"
                            >
                              {item.label}
                            </a>
                          </motion.li>
                        ))}
                      </ul>
                      
                      <div className="mt-auto pt-6">
                        <a
                          href="dashboard"
                          className="block w-full text-center border border-white/30 text-white py-3 px-5 rounded-full hover:border-white/100 bg-white/10 hover:bg-white/20 transition-all duration-300 font-medium"
                        >
                          Get Started
                        </a>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navbar_home;