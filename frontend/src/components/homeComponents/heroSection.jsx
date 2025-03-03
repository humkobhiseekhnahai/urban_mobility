import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import Navbar_home from "./navBar_home";

const InteractiveSphere = () => {
  const meshRef = useRef();
  const targetRotation = useRef({ x: 0, y: 0 });

  // Ultra-smooth rotation with enhanced damping
  useFrame(({ mouse }) => {
    if (meshRef.current) {
      // Calculate target rotation based on mouse position
      targetRotation.current.x = mouse.y * 0.5;
      targetRotation.current.y = mouse.x * 0.5;

      // Apply smoother interpolation (lower factor = smoother but slower response)
      meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[5, 32, 32]} />
      <meshStandardMaterial color="#ffffff" wireframe />
    </mesh>
  );
};

const HeroSection = () => {
  return (
    <>

      <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#000000] text-[#ffffff] overflow-hidden">
        {/* Three.js Background Animation */}

        <div className="absolute inset-0 z-0">
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <InteractiveSphere />
            <OrbitControls enableZoom={false} />
          </Canvas>
        </div>

        {/* <!-- Navbar --> */}
        <div class="fixed top-0 left-0 right-0 z-10">
          <nav class="bg-transparent"> <Navbar_home /> </nav>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 select-none">

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4 tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            UPLYFT: Elevate the Urban Experience
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Streamline travel, conquer chaos, and redefine city life.
          </motion.p>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <motion.a
              href="/login"
              className="bg-[#ffffff] text-black py-3 px-8 rounded-md hover:bg-[#e5e5e5] transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.a>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;