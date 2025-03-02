
import { useState, useEffect } from "react"

// eslint-disable-next-line react/prop-types
const TruckLoadingBar = ({ percentage }) => {
  const [currentPercentage, setCurrentPercentage] = useState(0)

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPercentage < percentage) {
        setCurrentPercentage((prev) => Math.min(prev + 1, percentage))
      }
    }, 20)

    return () => clearTimeout(timer)
  }, [currentPercentage, percentage])

  // Ensure percentage is within valid range
  const validPercentage = Math.max(0, Math.min(100, percentage))

  if(!validPercentage){
    return(
      <div className="text-white text-xl">
        Not a valid percentage
      </div>
    )
    
  }

  return (
    <div className="w-full h-full">
      <svg
        viewBox="0 0 800 300"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Shadow beneath truck */}
        <ellipse cx="400" cy="250" rx="350" ry="10" fill="#00000022" />
        {/* Truck Chassis */}
        <rect x="50" y="220" width="680" height="20" rx="2" fill="#222" />
        {/* Truck Cabin - more realistic shape */}
        <path d="M50,220 L50,150 L70,100 L160,100 L180,150 L180,220 Z" fill="#333" stroke="#111" strokeWidth="1.5" />
        {/* Front Windshield - angled realistically */}
        <path d="M70,100 L70,150 L50,150 L70,100" fill="#ddd" stroke="#111" strokeWidth="1" opacity="0.9" />
        {/* Side window - more realistic shape */}
        <path d="M90,120 L150,120 L150,170 L90,170 Z" fill="#ddd" stroke="#111" strokeWidth="1" opacity="0.8" />
        {/* Headlights - more realistic */}
        <ellipse cx="60" cy="160" rx="8" ry="6" fill="#f8f8f8" stroke="#111" strokeWidth="0.5" />
        <ellipse cx="60" cy="160" rx="6" ry="4" fill="#fff" stroke="#111" strokeWidth="0.5" />
        {/* Grill - more detailed */}
        <rect x="52" y="170" width="28" height="15" rx="2" fill="#111" stroke="#000" strokeWidth="0.5" />
        <line x1="56" y1="170" x2="56" y2="185" stroke="#333" strokeWidth="0.5" />
        <line x1="60" y1="170" x2="60" y2="185" stroke="#333" strokeWidth="0.5" />
        <line x1="64" y1="170" x2="64" y2="185" stroke="#333" strokeWidth="0.5" />
        <line x1="68" y1="170" x2="68" y2="185" stroke="#333" strokeWidth="0.5" />
        <line x1="72" y1="170" x2="72" y2="185" stroke="#333" strokeWidth="0.5" />
        <line x1="76" y1="170" x2="76" y2="185" stroke="#333" strokeWidth="0.5" />
        {/* Door with details */}
        <rect x="100" y="150" width="60" height="70" rx="2" fill="#2a2a2a" stroke="#111" strokeWidth="1" />
        <line x1="100" y1="155" x2="160" y2="155" stroke="#111" strokeWidth="0.5" />
        <circle cx="150" cy="185" r="4" fill="#111" stroke="#000" strokeWidth="0.5" /> {/* Door handle */}
        {/* Container Connection */}
        <rect x="180" y="160" width="10" height="60" fill="#222" />
        {/* Storage Container Outline - more realistic */}
        <rect x="190" y="110" width="540" height="110" rx="3" fill="#444" stroke="#111" strokeWidth="1.5" />
        <rect x="190" y="110" width="540" height="15" rx="3" fill="#333" stroke="#111" strokeWidth="0.5" />
        {/* Container Details - more realistic */}
        <line x1="250" y1="110" x2="250" y2="220" stroke="#222" strokeWidth="1" />
        <line x1="350" y1="110" x2="350" y2="220" stroke="#222" strokeWidth="1" />
        <line x1="450" y1="110" x2="450" y2="220" stroke="#222" strokeWidth="1" />
        <line x1="550" y1="110" x2="550" y2="220" stroke="#222" strokeWidth="1" />
        <line x1="650" y1="110" x2="650" y2="220" stroke="#222" strokeWidth="1" />
        {/* Horizontal container details */}
        <line x1="190" y1="140" x2="730" y2="140" stroke="#222" strokeWidth="1" />
        <line x1="190" y1="170" x2="730" y2="170" stroke="#222" strokeWidth="1" />
        <line x1="190" y1="200" x2="730" y2="200" stroke="#222" strokeWidth="1" />
        {/* Loading Bar Container */}
        <rect x="210" y="135" width="500" height="60" rx="3" fill="#222" stroke="#111" strokeWidth="1.5" />
        {/* Loading Bar Fill */}
        <rect
          x="210"
          y="135"
          width={5 * currentPercentage}
          height="60"
          rx="3"
          fill="#888"
          className="transition-all duration-300 ease-in-out"
        />
        {/* Percentage Text */}
        <text
          x="460"
          y="165"
          fontSize="32"
          fontWeight="bold"
          fill="white"
          textAnchor="middle"
          dominantBaseline="middle"
          stroke="#111"
          strokeWidth="0.5"
        >
          {currentPercentage}%
        </text>
        {/* Wheels - more realistic */}
        {[120, 350, 450, 650].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy="220" r="28" fill="#111" />
            <circle cx={x} cy="220" r="22" fill="#222" />
            <circle cx={x} cy="220" r="18" fill="#333" />
            <circle cx={x} cy="220" r="14" fill="#444" />
            <circle cx={x} cy="220" r="4" fill="#111" />
            <circle cx={x} cy="220" r="2" fill="#666" />

            {/* Wheel details - more realistic */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, j) => (
              <line
                key={j}
                x1={x + 8 * Math.cos((angle * Math.PI) / 180)}
                y1={220 + 8 * Math.sin((angle * Math.PI) / 180)}
                x2={x + 18 * Math.cos((angle * Math.PI) / 180)}
                y2={220 + 18 * Math.sin((angle * Math.PI) / 180)}
                stroke="#111"
                strokeWidth="1"
              />
            ))}

            {/* Wheel rim highlights */}
            <path d={`M${x - 18},${220} A18,18 0 0,1 ${x},${220 - 18}`} stroke="#555" strokeWidth="1.5" fill="none" />
          </g>
        ))}
        {/* Bumper */}
        <rect x="40" y="200" width="20" height="10" rx="2" fill="#222" stroke="#111" strokeWidth="0.5" />
        {/* Exhaust pipe */}
        <rect x="45" y="210" width="5" height="10" rx="1" fill="#111" />
        {/* License plate */}
        <rect x="60" y="200" width="20" height="10" rx="1" fill="#ddd" stroke="#111" strokeWidth="0.5" />
        {/* Rear lights */}
        <rect x="170" y="200" width="8" height="5" rx="1" fill="#444" stroke="#111" strokeWidth="0.5" />
        {/* Side mirrors */}
        <path d="M60,150 L40,160 L40,170 L60,165 Z" fill="#222" stroke="#111" strokeWidth="0.5" />
      </svg>
    </div>
  )
}

export default TruckLoadingBar

