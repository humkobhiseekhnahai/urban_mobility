import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pricingOptions } from '../../constants';
import { useState, useEffect } from 'react';

const Cards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev === pricingOptions.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? pricingOptions.length - 1 : prev - 1
    );
  };

  // Swipe handlers for mobile
  const handleSwipeStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const [startX, setStartX] = useState(0);
  
  const handleSwipeEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    // Require at least 50px swipe to trigger slide change
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  // Unified card variants for all screen sizes - ensuring equal sizing
  const cardVariants = {
    active: {
      scale: isMobile ? 1 : 1.1,
      opacity: 1,
      x: 0,
      z: isMobile ? 0 : 150,
      rotateY: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    },
    inactiveLeft: {
      scale: isMobile ? 0.9 : 0.85,
      opacity: isMobile ? 0 : 0.5,
      x: isMobile ? '-100%' : '-80%',
      z: isMobile ? 0 : -200,
      rotateY: isMobile ? 0 : 50,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    },
    inactiveRight: {
      scale: isMobile ? 0.9 : 0.85,
      opacity: isMobile ? 0 : 0.5,
      x: isMobile ? '100%' : '80%',
      z: isMobile ? 0 : -200,
      rotateY: isMobile ? 0 : -50,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <motion.div
      className="relative overflow-hidden px-4 sm:px-0"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.h2
        className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-center my-8 sm:my-16 md:my-30 tracking-wide font-bold"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <span className="bg-gradient-to-r from-neutral-100 to-neutral-300 text-transparent bg-clip-text">
          Features
        </span>
      </motion.h2>

      {/* Carousel Container */}
      <div 
        className={`relative max-w-5xl mx-auto px-2 sm:px-8 ${!isMobile ? 'perspective-1200' : ''}`}
        onTouchStart={handleSwipeStart}
        onTouchEnd={handleSwipeEnd}
      >
        <div className="relative h-[500px] sm:h-[600px] md:h-[650px]">
          <AnimatePresence initial={false}>
            {pricingOptions.map((option, index) => {
              const position = (index - currentIndex + pricingOptions.length) % pricingOptions.length;
              let variant = 'active';
              if (position === 1) variant = 'inactiveRight';
              if (position === pricingOptions.length - 1) variant = 'inactiveLeft';

              // Only show the active card on mobile to prevent sizing issues
              if (isMobile && variant !== 'active') {
                return null;
              }

              return (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="inactiveRight"
                  animate={variant}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 sm:px-0"
                  style={{ transformStyle: !isMobile ? 'preserve-3d' : 'flat' }}
                >
                  <motion.div
                    className="p-6 sm:p-8 md:p-10 border border-neutral-700 rounded-2xl bg-neutral-900/95 backdrop-blur-sm shadow-2xl w-full"
                    whileHover={index === currentIndex ? {
                      y: -10,
                      boxShadow: '0 20px 40px -10px rgba(255, 255, 255, 0.15)',
                      scale: 1.02
                    } : {}}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <p className="text-2xl sm:text-3xl md:text-4xl mb-6 md:mb-8 text-neutral-100 font-semibold">
                      {option.title}
                      {option.title === 'Pro' && (
                        <motion.span
                          className="bg-gradient-to-r from-neutral-200 to-neutral-400 text-transparent bg-clip-text text-sm sm:text-lg md:text-xl mb-4 ml-2 md:ml-3 block sm:inline"
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          (Best Value)
                        </motion.span>
                      )}
                    </p>
                    <ul className="min-h-[200px] sm:min-h-[220px] md:min-h-[240px]">
                      {option.features.map((feature, fIndex) => (
                        <motion.li
                          key={fIndex}
                          className="mt-4 sm:mt-6 flex items-start sm:items-center text-neutral-300"
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: fIndex * 0.1 }}
                        >
                          <motion.div
                            whileHover={{ rotate: 15, scale: 1.15 }}
                            className="text-neutral-300 flex-shrink-0 mt-1 sm:mt-0"
                          >
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </motion.div>
                          <span className="ml-2 sm:ml-3 text-base sm:text-lg">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <motion.a
                      href="Dashboard"
                      className="inline-flex justify-center items-center text-center w-full h-12 sm:h-14 p-4 sm:p-5 mt-8 sm:mt-12 tracking-tight text-lg sm:text-xl text-neutral-100 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-600 rounded-lg transition duration-200 font-medium"
                      whileHover={index === currentIndex ? {
                        scale: 1.05,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 4px 15px rgba(255, 255, 255, 0.1)'
                      } : {}}
                      whileTap={{ scale: 0.97 }}
                    >
                      Get Started
                    </motion.a>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons - Only visible on desktop */}
        {!isMobile && (
          <>
            <motion.button
              onClick={prevSlide}
              className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 bg-neutral-900/80 p-2 sm:p-3 rounded-full border border-neutral-600 shadow-lg backdrop-blur-sm"
              whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            <motion.button
              onClick={nextSlide}
              className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 bg-neutral-900/80 p-2 sm:p-3 rounded-full border border-neutral-600 shadow-lg backdrop-blur-sm"
              whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </>
        )}

        {/* Mobile swipe indicator - Only visible on mobile */}
        {isMobile && (
          <motion.div 
            className="flex justify-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-neutral-400 text-xs text-center">Swipe to navigate</span>
          </motion.div>
        )}

        {/* Enhanced Dots Navigation */}
        <div className="flex justify-center mt-4 sm:mt-6 gap-2 sm:gap-3">
          {pricingOptions.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full border border-neutral-600 ${
                currentIndex === index ? 'bg-neutral-200' : 'bg-neutral-800'
              }`}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Cards;