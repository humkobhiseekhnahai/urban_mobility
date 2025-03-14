import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import * as THREE from 'three';
import logo from '../../assets/UPLYFT.svg';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(location.state?.error || '');
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const frameIdRef = useRef(null);

  // Three.js setup
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Clean up any existing renderer to avoid context conflicts
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }
    
    // Initialize scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Create renderer with preserveDrawingBuffer to avoid conflicts
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    
    // Store renderer reference for cleanup
    rendererRef.current = renderer;
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      // Position
      posArray[i] = (Math.random() - 0.5) * 10;
      
      // Colors - blue theme
      if (i % 3 === 0) {
        colorArray[i] = Math.random() * 0.2; // R
      } else if (i % 3 === 1) {
        colorArray[i] = Math.random() * 0.5 + 0.3; // G
      } else {
        colorArray[i] = Math.random() * 0.5 + 0.5; // B
      }
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.01,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Position camera
    camera.position.z = 3;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0x4169e1, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Store scene reference
    sceneRef.current = { scene, camera, particlesMesh };
    
    // Mouse movement variables
    let mouseX = 0;
    let mouseY = 0;
    
    // Mouse movement handler
    const onMouseMove = (event) => {
      mouseX = event.clientX - window.innerWidth / 2;
      mouseY = event.clientY - window.innerHeight / 2;
    };
    
    // Add event listener
    document.addEventListener('mousemove', onMouseMove);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation function
    const animate = () => {
      if (!sceneRef.current || !rendererRef.current) return;
      
      const { particlesMesh } = sceneRef.current;
      
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0005;
      
      // Mouse interaction
      particlesMesh.rotation.x += (mouseY * 0.00003);
      particlesMesh.rotation.y += (mouseX * 0.00003);
      
      // Make sure we're using the correct context
      renderer.render(scene, camera);
      
      // Store frame ID for cleanup
      frameIdRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
      // Cancel animation frame
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onMouseMove);
      
      // Dispose of Three.js resources
      if (sceneRef.current) {
        particlesGeometry.dispose();
        particlesMaterial.dispose();
      }
      
      // Dispose of renderer
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      
      // Clear scene reference
      sceneRef.current = null;
    };
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('authToken', data.token);

      const roleCheck = await fetch('http://localhost:3000/auth/check-role', {
        headers: { Authorization: `Bearer ${data.token}` }
      });

      if (roleCheck.ok) {
        const { roleSelected } = await roleCheck.json();
        navigate(roleSelected ? '/dashboard' : '/role-select');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      localStorage.setItem('authToken', token);
      navigate('/role-select');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black overflow-hidden relative">
      {/* Three.js Canvas */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full z-0"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70 z-10"></div>
      
      {/* Home Button - Fixed position for all screen sizes */}
      <motion.button
        onClick={() => navigate('/')}
        className="fixed top-4 right-4 z-50 flex items-center bg-gray-800/80 hover:bg-gray-700 text-white px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700/50 transition duration-200"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon icon="mdi:home" className="w-5 h-5" />
        <span className="ml-1 hidden sm:inline">Home</span>
      </motion.button>

      <div className="min-h-screen flex items-center justify-center relative z-20">
        {/* Login form section */}
        <motion.div 
          className="w-full max-w-md px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="w-full space-y-6 p-8 rounded-2xl backdrop-blur-xl bg-gray-900/50 border border-gray-700/50 shadow-2xl"
            whileHover={{ boxShadow: "0 0 25px rgba(59, 130, 246, 0.3)" }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="flex justify-center mb-2"
              variants={itemVariants}
            >
              <img src={logo} alt="Logo" className="w-22 h-22" />
            </motion.div>

            <motion.div className="space-y-2" variants={itemVariants}>
              <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
                Welcome Back
              </h2>
              <p className="text-gray-400 text-center text-sm">
                Please enter your details
              </p>
            </motion.div>

            {error && (
              <motion.div 
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-red-400 text-sm text-center">{error}</p>
              </motion.div>
            )}

            <motion.form 
              className="space-y-5" 
              onSubmit={handleSubmit}
              variants={itemVariants}
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <motion.input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 text-sm rounded-lg bg-gray-800/70 border border-gray-700/70 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 transition duration-200"
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              <motion.div className="space-y-2" variants={itemVariants}>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-400 hover:text-blue-300 transition"
                  >
                    Forgot password?
                  </Link>
                </div>
                <motion.input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 text-sm rounded-lg bg-gray-800/70 border border-gray-700/70 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 transition duration-200"
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium text-sm transition duration-200 ${
                  isLoading
                    ? 'bg-blue-600/50 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                }`}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                variants={itemVariants}
              >
                {isLoading ? 'Logging In...' : 'Sign in'}
              </motion.button>
            </motion.form>

            <motion.div className="mt-6" variants={itemVariants}>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700/50"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 text-gray-400 text-sm bg-gray-900/80">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="flex justify-center items-center mt-4">
                <motion.button
                  onClick={handleGoogleLogin}
                  className="p-3 rounded-full bg-gray-800/70 hover:bg-gray-700/70 border border-gray-700/50 transition duration-200"
                  aria-label="Sign in with Google"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 48 48"
                    className="w-5 h-5"
                  >
                    <path
                      fill="#fbc02d"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8
                     c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                     C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20
                     C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                    <path
                      fill="#e53935"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12
                     c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4
                     C16.318,4,9.656,8.337,6.306,14.691z"
                    />
                    <path
                      fill="#4caf50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238
                     C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025
                     C9.505,39.556,16.227,44,24,44z"
                    />
                    <path
                      fill="#1565c0"
                      d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
                     c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238
                     C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                  </svg>
                </motion.button>
              </div>
            </motion.div>

            <motion.p 
              className="mt-6 text-center text-gray-400 text-sm"
              variants={itemVariants}
            >
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up
              </Link>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
