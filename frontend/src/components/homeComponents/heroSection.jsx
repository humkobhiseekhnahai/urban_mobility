import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import UplyftLogo from "../../assets/UPLYFT.svg"

const HeroSection = () => {
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-inherit overflow-hidden">
      {/* Background pattern - keeping transparent */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      {/* Main content - split layout */}
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left side - Content */}
        <motion.div 
          className="flex flex-col justify-center z-10 pt-20 lg:pt-0"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <div className="max-w-xl">
            <motion.div 
              className="mb-6 inline-block"
              variants={fadeIn}
            >
              <div className="relative">
                {/* Increased logo size */}
                <img src={UplyftLogo || "/placeholder.svg"} alt="UPLYFT" className="h-28 md:h-32 w-auto" />
                {/* Logo highlight effect */}
                <motion.div 
                  className="absolute -inset-1 bg-blue-500/10 rounded-lg blur-lg"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.7, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                ></motion.div>
              </div>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-gray-300"
              variants={fadeIn}
            >
              Urban <span className="text-blue-600">Mobility</span> Reimagined
            </motion.h1>

            <motion.div 
              className="w-16 h-1 bg-blue-500 mb-8"
              variants={fadeIn}
            ></motion.div>

            <motion.p 
              className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-lg"
              variants={fadeIn}
            >
              Seamless city navigation with intelligent routing and real-time updates. Your essential companion for the modern urban explorer.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mb-16"
              variants={fadeIn}
            >
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/20 text-center"
              >
                Get Started
              </Link>

              <Link
                to="/documentation"
                className="border border-blue-200 text-blue-600 px-8 py-4 rounded-full font-medium hover:bg-blue-50 transition-colors text-center"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Right side - Visual with animation */}
        <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full">
            {/* Abstract shapes with animation - changed to blues and whites */}
            <motion.div 
              className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-blue-200 mix-blend-multiply filter blur-xl opacity-70"
              animate={{ 
                x: [0, 20, 0],
                y: [0, -20, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            ></motion.div>
            <motion.div 
              className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-blue-400 mix-blend-multiply filter blur-xl opacity-70"
              animate={{ 
                x: [0, -20, 0],
                y: [0, 20, 0]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            ></motion.div>
            <motion.div 
              className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-white mix-blend-multiply filter blur-xl opacity-70"
              animate={{ 
                x: [0, 30, 0],
                y: [0, 30, 0]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            ></motion.div>

            {/* App mockup with animation */}
            <motion.div 
              className="relative z-10 w-full h-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div 
                className="w-96 h-96 relative"
                whileHover={{ scale: 1.02, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 20, repeat: Infinity }}
                >
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path
                      fill="#3B82F6"
                      d="M45.7,-76.3C59.3,-69.7,70.3,-57.4,78.9,-43.2C87.5,-29,93.8,-12.9,93.2,2.9C92.7,18.7,85.4,34.2,75.1,47.1C64.8,60,51.6,70.3,37,76.1C22.4,81.9,6.4,83.2,-9.3,81.1C-25,79,-40.4,73.5,-52.9,64.1C-65.4,54.7,-75,41.4,-80.8,26.4C-86.6,11.3,-88.6,-5.5,-85.2,-21.1C-81.8,-36.7,-73,-51.1,-60.8,-59.9C-48.6,-68.7,-33,-71.9,-18.5,-73.8C-4,-75.7,10.4,-76.3,24.4,-76.5C38.4,-76.7,52,-82.9,45.7,-76.3Z"
                      transform="translate(100 100)"
                    />
                  </svg>
                </motion.div>

                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <motion.div 
                    className="w-64 h-64 bg-white rounded-2xl shadow-2xl p-6 rotate-3 transform hover:rotate-0 transition-transform duration-500"
                    whileHover={{ 
                      boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
                      y: -5
                    }}
                  >
                    <div className="w-full h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>

                      <div className="flex-1 bg-gray-50 rounded-lg p-4">
                        <div className="w-full h-4 bg-blue-200 rounded mb-3"></div>
                        <div className="w-3/4 h-4 bg-blue-100 rounded mb-6"></div>

                        <div className="flex gap-2 mb-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <div className="w-full h-3 bg-gray-200 rounded mb-2"></div>
                            <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
                          </div>
                        </div>

                        <div className="flex gap-2 mb-4">
                          <div className="w-10 h-10 bg-blue-400 rounded-full"></div>
                          <div className="flex-1">
                            <div className="w-full h-3 bg-gray-200 rounded mb-2"></div>
                            <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <div className="w-10 h-10 bg-blue-300 rounded-full"></div>
                          <div className="flex-1">
                            <div className="w-full h-3 bg-gray-200 rounded mb-2"></div>
                            <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator with animation */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <span className="text-xs text-gray-500 font-medium tracking-wider">SCROLL</span>
        <motion.div 
          className="w-5 h-10 border-2 border-gray-300 rounded-full flex justify-center p-1"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div 
            className="w-1 h-2 bg-blue-500 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          ></motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HeroSection