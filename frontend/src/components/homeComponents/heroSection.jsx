"use client"

import { useRef, useMemo } from "react"
import { motion } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, MeshDistortMaterial, Stars } from "@react-three/drei"
import Navbar_home from "./navBar_home"
import UplyftLogo from "../../assets/UPLYFT.svg"

// Enhanced interactive sphere with distortion effect
const InteractiveSphere = () => {
  const meshRef = useRef()
  const targetRotation = useRef({ x: 0, y: 0 })

  // Create particles around the sphere
  const particles = useMemo(() => {
    return Array.from({ length: 100 }, () => ({
      position: [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15],
      size: Math.random() * 0.05 + 0.05,
    }))
  }, [])

  useFrame(({ mouse, clock }) => {
    if (meshRef.current) {
      // Smooth follow for mouse movement
      targetRotation.current.x = mouse.y * 0.5
      targetRotation.current.y = mouse.x * 0.5
      meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.05
      meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.05

      // Subtle pulsing effect
      const t = clock.getElapsedTime()
      meshRef.current.scale.x = 1 + Math.sin(t * 0.5) * 0.04
      meshRef.current.scale.y = 1 + Math.sin(t * 0.5) * 0.04
      meshRef.current.scale.z = 1 + Math.sin(t * 0.5) * 0.04
    }
  })

  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[5, 64, 64]} />
        <MeshDistortMaterial
          color="#3b82f6"
          attach="material"
          distort={0.3}
          speed={2}
          wireframe
          opacity={0.8}
          transparent
        />
      </mesh>

      {/* Particles around the sphere */}
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Add stars in the background */}
      <Stars radius={50} depth={50} count={1000} factor={4} fade speed={1} />
    </>
  )
}

// Floating element that moves independently
const FloatingElement = ({ position, size, color, speed }) => {
  const meshRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t) * 0.5
      meshRef.current.rotation.x = t * 0.2
      meshRef.current.rotation.z = t * 0.2
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color={color} wireframe opacity={0.4} transparent />
    </mesh>
  )
}

const HeroSection = () => {
  return (
    <>
      <div className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden bg-black">
        {/* Enhanced Three.js Background Animation */}
        <div className="absolute inset-0 z-0">
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 15], fov: 60 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#3b82f6" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#60a5fa" />
            <InteractiveSphere />
            <FloatingElement position={[-8, 4, -5]} size={1.5} color="#3b82f6" speed={0.5} />
            <FloatingElement position={[8, -3, -3]} size={1} color="#93c5fd" speed={0.7} />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          </Canvas>
        </div>

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-[#0f172a]/70 z-[1]"></div>

        {/* Navbar */}
        <div className="fixed top-0 left-0 right-0 z-20">
          <nav className="bg-transparent backdrop-blur-sm bg-[#0f172a]/20">
            <Navbar_home />
          </nav>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto select-none">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Logo with enhanced animation */}
            <motion.div
              className="flex justify-center mb-1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1,
                type: "spring",
                stiffness: 100,
              }}
            >
              <img
                src={UplyftLogo || "/placeholder.svg"}
                alt="UPLYFT"
                className="h-24 md:h-32 w-auto filter drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              />
            </motion.div>

            {/* Enhanced divider */}
            <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent mx-auto my-6"></div>

            <motion.h2
              className="text-xl md:text-2xl font-light tracking-wider text-white max-w-lg mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-[#3b82f6] to-[#93c5fd] bg-clip-text text-transparent font-medium">
                Elevate
              </span>{" "}
              the Urban Experience
            </motion.h2>
          </motion.div>

          <motion.p
            className="text-base md:text-lg mb-12 max-w-md mx-auto leading-relaxed text-[#e2e8f0] font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Navigate cities. Conquer chaos. <span className="text-[#60a5fa] font-normal">Redefine</span> city life.
          </motion.p>

          {/* Enhanced CTA button */}
          <motion.div
            className="flex justify-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <motion.a
              href="/dashboard"
              className="bg-[#3b82f6] text-white py-3 px-10 rounded-full transition-all duration-300 hover:bg-[#2563eb] shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-sm font-medium"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(59, 130, 246, 0.6)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.a>

            <motion.a
              href="/documentation"
              className="bg-transparent border border-[#3b82f6]/50 text-white py-3 px-10 rounded-full transition-all duration-300 hover:bg-[#3b82f6]/10 backdrop-blur-sm"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.a>
          </motion.div>

          {/* Features preview */}
          <motion.div
            className="mt-16 flex justify-center gap-6 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {["Smart Navigation", "Real-time Updates", "City Insights"].map((feature, index) => (
              <motion.div
                key={feature}
                className="flex items-center bg-white/5 backdrop-blur-md px-4 py-2 rounded-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              >
                <div className="w-2 h-2 rounded-full bg-[#3b82f6] mr-2"></div>
                <span className="text-sm font-light">{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Enhanced scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-xs text-white/80 font-light tracking-widest flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            y: [5, 0, 5],
          }}
          transition={{
            opacity: { duration: 1, delay: 1 },
            y: { repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" },
          }}
        >
          <span className="text-[#3b82f6]">SCROLL TO EXPLORE</span>
          <motion.div
            animate={{
              y: [0, 5, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.5,
              ease: "easeInOut",
            }}
            className="w-5 h-5 flex justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#3b82f6]"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

export default HeroSection

