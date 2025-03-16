import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import logo from '../../assets/UPLYFT.svg';
import { navItems } from '../../constants';
import { Menu, X } from 'lucide-react';

const Navbar_home = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const controls = useAnimationControls();

  const toggleNavbar = () => setMobileDrawerOpen(!mobileDrawerOpen);

  // Scroll detection for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
    <motion.nav
      className="fixed top-0 left-0 right-0 w-full z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`w-full transition-all duration-500 ${scrolled ? 'bg-black/30 backdrop-blur-xl shadow-lg shadow-black/10' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center py-3">
            <motion.div className="flex items-center flex-shrink-0">
              <motion.img

                className="h-12 -my-4 w-auto md:h-16 lg:h-20"

                src={logo}
                alt="Logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>

            {/* Desktop Navigation */}
            <motion.ul
              className="hidden lg:flex space-x-8"
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
                    className="px-3 py-2 text-gray-200 transition-all duration-300 hover:text-white font-medium relative group"
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
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
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
                className="border border-white/30 text-white py-2 px-6 rounded-full hover:border-white/100 hover:bg-white/10 transition-all duration-300 font-medium text-sm hover:shadow-lg hover:shadow-white/10 hover:transform hover:scale-105"
              >
                Get Started
              </a>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <motion.div
              className="lg:hidden flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button
                onClick={toggleNavbar}
                className="text-white bg-white/20 rounded-full p-2 hover:bg-white/30 transition-all duration-300 hover:shadow-md hover:shadow-white/10"
                aria-label={mobileDrawerOpen ? "Close menu" : "Open menu"}
              >
                {mobileDrawerOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/70 z-10 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleNavbar}
            />

            {/* Redesigned Mobile Drawer with Glass Effect */}
            <motion.div
              className="fixed top-0 right-0 z-20 w-72 h-screen bg-black/50 backdrop-blur-xl p-8 flex flex-col border-l border-white/10"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-between items-center mb-10">
                <img src={logo} alt="Logo" className="h-12 w-auto" />
                <button
                  onClick={toggleNavbar}
                  className="text-white bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors shadow-md shadow-black/20"
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
                    className="border-b border-white/10 pb-4"
                  >
                    <a
                      href={item.href}
                      className="text-white hover:text-white/80 transition-all duration-300 text-lg font-medium flex items-center group"
                      onClick={(e) => {
                        if (item.href.startsWith('#')) {
                          e.preventDefault();
                          const element = document.querySelector(item.href);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                            toggleNavbar();
                          }
                        }
                      }}
                    >
                      <span className="w-1 h-0 bg-white absolute left-0 group-hover:h-6 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                      <span className="ml-1 group-hover:ml-3 transition-all duration-300">{item.label}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              
              <div className="mt-auto pt-8">
                <a
                  href="dashboard"
                  className="block w-full text-center border border-white/30 text-white py-3 px-5 rounded-full hover:border-white/100 bg-white/10 hover:bg-white/20 transition-all duration-300 font-medium hover:shadow-lg hover:shadow-white/5"
                >
                  Get Started
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar_home;