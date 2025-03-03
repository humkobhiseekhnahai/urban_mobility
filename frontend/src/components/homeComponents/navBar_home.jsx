import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import logo from '../../assets/UPLYFT.svg';
import { navItems } from '../../constants';
import { Menu, X } from 'lucide-react';

const Navbar_home = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // State to track navbar visibility
  const [lastScrollY, setLastScrollY] = useState(0); // State to track last scroll position
  const controls = useAnimationControls();

  const toggleNavbar = () => setMobileDrawerOpen(!mobileDrawerOpen);

  // Scroll detection logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down and past a threshold (50px)
        setIsVisible(false);
      } else {
        // Scrolling up or near the top
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup
  }, [lastScrollY]);

  // Animation control based on visibility
  useEffect(() => {
    if (isVisible) {
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
  }, [isVisible, controls]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
          initial={{ y: -100 }}
          animate={controls}
          exit={{ y: -100 }}
        >
          <div className="container px-4 mx-auto relative lg:text-base bg-white/10 backdrop-blur-3xl drop-shadow-xl rounded-4xl mt-2">
            <div className="flex justify-between items-center">
              <motion.div className="flex items-center flex-shrink-0">
                <motion.img
                  className="h-15 w-15"
                  src={logo}
                  alt="Logo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>

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
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>

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

              <motion.div
                className="lg:hidden flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <button
                  onClick={toggleNavbar}
                  className="text-gray-300 hover:text-white transition-colors p-2"
                >
                  {mobileDrawerOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </motion.div>
            </div>

            <AnimatePresence>
              {mobileDrawerOpen && (
                <>
                  <motion.div
                    className="fixed inset-0 bg-black/60 z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={toggleNavbar}
                  />
                  <motion.div
                    className="fixed top-0 right-0 z-20 bg-black/90 backdrop-blur-2xl w-64 h-full p-6 flex flex-col border-l border-white/10"
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <button
                      onClick={toggleNavbar}
                      className="self-end mb-6 text-gray-300 hover:text-white"
                    >
                      <X size={24} />
                    </button>
                    <ul className="flex-1">
                      {navItems.map((item, index) => (
                        <motion.li
                          key={index}
                          className="border-b border-white/10 py-4"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <a
                            href={item.href}
                            className="text-gray-300 hover:text-white transition-colors text-lg"
                          >
                            {item.label}
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <a
                        href="signup"
                        className="border border-white/30 text-white py-2.5 px-5 rounded-full hover:border-white/100 hover:bg-white/10 transition-all duration-300 font-medium text-sm block text-center"
                      >
                        Get Started
                      </a>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navbar_home;