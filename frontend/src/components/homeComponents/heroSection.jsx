"use client"

import { motion } from "framer-motion"
import clsx from "clsx"
import { ChevronDown, Sparkles } from "lucide-react"
const cn = clsx
import UplyftLogo from "../../assets/UPLYFT.svg" // Adjust path as needed

// ElegantShape component for floating background shapes
function ElegantShape({ className, delay = 0, width = 400, height = 100, rotate = 0, gradient = "from-white/[0.08]" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate: rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
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
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]",
          )}
        />
      </motion.div>
    </motion.div>
  )
}

// Badge component for highlighting features
function FeatureBadge({ children, className }) {
  return (
    <div
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        "bg-white/10 text-white/80 backdrop-blur-sm",
        "border border-white/20",
        className,
      )}
    >
      <Sparkles className="w-3 h-3 mr-1.5 text-blue-300" />
      {children}
    </div>
  )
}

// Main HeroGeometric component
export default function HeroGeometric() {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-[0.03]" />

      {/* Floating elegant shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-cyan-500/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">

          {/* Logo */}
          <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible" className="mb-6 mt-8 md:mb-8 md:mt-10">
            <img src={UplyftLogo || "/placeholder.svg"} alt="UPLYFT" className="h-40 md:h-48 w-auto mx-auto" />
          </motion.div>

          {/* Title */}
          <motion.h1
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 md:mb-8 tracking-tight leading-[1.1]"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">Reimagine </span>
            <span className="bg-clip-text font-pacifico text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              Urban Travel
            </span>
            <br />
            <span className="bg-clip-text font-pacifico text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              Experience{" "}
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
              The Difference
            </span>
          </motion.h1>

          {/* Description */}
          <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="visible" className="mb-10">
            {/* <p className="text-base sm:text-lg md:text-xl text-white/60 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-4 mb-4">
              UPLYFT transforms how you navigate cities with AI-powered route optimization
            </p> */}
            <p className="text-sm sm:text-base text-white/40 max-w-xl mx-auto">
              Join thousands of commuters saving up to 40% on travel time and reducing their carbon footprint.
            </p>
          </motion.div>

          {/* Feature highlights */}
          {/* <motion.div
            custom={4}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            <span className="text-xs text-white/40 px-3 py-1 border border-white/10 rounded-full">
              Real-time Updates
            </span>
            <span className="text-xs text-white/40 px-3 py-1 border border-white/10 rounded-full">
              Multi-modal Transport
            </span>
            <span className="text-xs text-white/40 px-3 py-1 border border-white/10 rounded-full">
              Carbon Footprint Tracking
            </span>
            <span className="text-xs text-white/40 px-3 py-1 border border-white/10 rounded-full">
              Smart Notifications
            </span>
          </motion.div> */}

          {/* Buttons */}
          <motion.div
            custom={5}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <a
              href="/dashboard"
              className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/30 text-center overflow-hidden"
            >
              <span className="relative z-10">Start Your Journey</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </a>
            <a
              href="/documentation"
              className="group relative border border-white/20 text-white/90 px-8 py-4 rounded-full font-medium hover:bg-white/5 transition-colors text-center"
            >
              Explore Features
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-400 group-hover:w-1/2 transition-all duration-300 -translate-x-1/2"></span>
              <span className="absolute bottom-0 right-1/2 w-0 h-0.5 bg-blue-400 group-hover:w-1/2 transition-all duration-300 translate-x-1/2"></span>
            </a>
          </motion.div>

          {/* Scroll indicator */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          >
            <span className="text-white/40 text-xs mb-2">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            >
              <ChevronDown className="w-5 h-5 text-white/40" />
            </motion.div>
          </motion.div> */}
        </div>
      </div>

      {/* Foreground gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </div>
  )
}

