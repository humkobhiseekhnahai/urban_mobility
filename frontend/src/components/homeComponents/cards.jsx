
import { CheckCircle2, Sparkles } from 'lucide-react';
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


  // Elegant shape component for floating background elements
  const ElegantShape = ({ className, delay = 0, width = 400, height = 100, rotate = 0, gradient = "from-indigo-500/[0.15]" }) => (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate: rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={`
            absolute inset-0 rounded-full
            bg-gradient-to-r to-transparent
            ${gradient}
            backdrop-blur-[2px] border-2 border-white/[0.15]
            shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]
            after:absolute after:inset-0 after:rounded-full
            after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]
          `}
        />
      </motion.div>
    </motion.div>
  );


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


  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.3 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <motion.div
      className="relative overflow-hidden px-4 sm:px-0 py-16 md:py-24"

      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-[0.03]" />
      
      {/* Floating elegant shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={400}
          height={100}
          rotate={12}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={350}
          height={90}
          rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={250}
          height={70}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
      </div>

      <div className="relative z-10">
        <motion.h2
          custom={1}
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl sm:text-5xl md:text-6xl text-center mb-12 md:mb-16 tracking-tight font-bold"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
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
                      className="p-6 sm:p-8 md:p-10 rounded-2xl w-full overflow-hidden relative"
                      whileHover={index === currentIndex ? {
                        y: -10,
                        boxShadow: '0 20px 40px -10px rgba(255, 255, 255, 0.15)',
                        scale: 1.02
                      } : {}}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      {/* Card background with gradient and glass effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#030303]/90 to-[#030303]/70 backdrop-blur-md border border-white/10 rounded-2xl" />
                      
                      {/* Card content */}
                      <div className="relative z-10">
                        <div className="flex items-center mb-6 md:mb-8">
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="mr-3 p-2 rounded-full bg-gradient-to-br from-indigo-500/20 to-rose-500/20 border border-white/10"
                          >
                            <Sparkles className="w-5 h-5 text-indigo-300" />
                          </motion.div>
                          <p className="text-2xl sm:text-3xl md:text-4xl text-white font-semibold tracking-tight">
                            {option.title}
                            {option.title === 'Pro' && (
                              <motion.span
                                className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-rose-300 text-sm sm:text-lg md:text-xl mb-4 ml-2 md:ml-3 block sm:inline"
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                (Best Value)
                              </motion.span>
                            )}
                          </p>
                        </div>
                        
                        <ul className="min-h-[200px] sm:min-h-[220px] md:min-h-[240px] space-y-4">
                          {option.features.map((feature, fIndex) => (
                            <motion.li
                              key={fIndex}
                              className="flex items-start text-white/80"
                              initial={{ opacity: 0, x: -15 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: fIndex * 0.1 }}
                            >
                              <motion.div
                                whileHover={{ rotate: 15, scale: 1.15 }}
                                className="text-indigo-300 flex-shrink-0 mt-1"
                              >
                                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              </motion.div>
                              <span className="ml-3 text-base sm:text-lg">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                        
                        <motion.a
                          href="Dashboard"
                          className="group relative inline-flex justify-center items-center w-full h-12 sm:h-14 p-4 sm:p-5 mt-8 sm:mt-12 text-lg sm:text-xl text-white font-medium rounded-lg overflow-hidden"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {/* Button background */}
                          <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90"></span>
                          <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                          
                          {/* Button text */}
                          <span className="relative z-10">Get Started</span>
                        </motion.a>
                      </div>
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
                className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 bg-[#030303]/80 p-2 sm:p-3 rounded-full border border-white/10 shadow-lg backdrop-blur-sm"
                whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>

              <motion.button
                onClick={nextSlide}
                className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 bg-[#030303]/80 p-2 sm:p-3 rounded-full border border-white/10 shadow-lg backdrop-blur-sm"
                whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <span className="text-white/40 text-xs text-center">Swipe to navigate</span>
            </motion.div>
          )}

          {/* Enhanced Dots Navigation */}
          <div className="flex justify-center mt-6 sm:mt-8 gap-2 sm:gap-3">
            {pricingOptions.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full border ${
                  currentIndex === index 
                    ? 'border-indigo-300 bg-gradient-to-r from-indigo-400 to-blue-400' 
                    : 'border-white/20 bg-[#030303]'
                }`}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Foreground gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
=
    </motion.div>
  );
};

export default Cards;

