import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const StarBackground = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generateStars = () => {
      const starCount = 150; // Increased number of stars
      const newStars = [];
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1, // Increased max size
          opacity: Math.random() * 0.7 + 0.3, // Increased opacity range
          duration: Math.random() * 4 + 3,
          delay: Math.random() * 2
        });
      }
      setStars(newStars);
    };
    generateStars();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: '0 0 25px rgba(255, 255, 255, 0.8)' // Add subtle glow
          }}
          initial={{
            opacity: 0,
            scale: 0.5
          }}
          animate={{
            opacity: [0, star.opacity, 0], // Pulsing effect
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            delay: star.delay,
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      {/* Add larger twinkling stars */}
      {stars.slice(0, 15).map((star) => (
        <motion.div
          key={`large-${star.id}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size * 2}px`,
            height: `${star.size * 2}px`,
            filter: 'blur(1px)'
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            delay: star.delay * 2,
            duration: star.duration * 0.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default StarBackground;
