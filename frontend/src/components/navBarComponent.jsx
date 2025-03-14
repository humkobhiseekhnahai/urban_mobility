import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/UPLYFT.svg';

export const NavBarComponent = () => {
  const [isDeliveryOpen, setDeliveryOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Check if a path should be expanded in delivery dropdown
  useEffect(() => {
    if (currentPath === '/delivery') {
      setDeliveryOpen(true);
    }
  }, [currentPath]);

  // Determine if a route is active
  const isActive = (path) => {
    return currentPath === path;
  };

  // Get the active class for main menu items
  const getActiveClass = (path) => {
    return isActive(path) 
      ? "bg-white/10 text-white font-semibold" 
      : "text-gray-300 hover:text-white";
  };

  return (
    <div className="bg-white/10 backdrop-blur-md w-56 min-h-screen rounded-lg flex-shrink-0">
      <div className="h-30 border-b-2 border-neutral-700 mx-4 mb-10 flex justify-center items-center">
      <img src={logo} alt="UPLYFT Logo" className="-mt-7 h-30 w-22 object-contain mb-1"/>
      </div>
      

      {/* Home */}
      <div 
        className={`h-12 w-full flex justify-start items-center space-x-2 text-lg font-medium mb-3 pl-4 select-none cursor-pointer transition-colors ${getActiveClass('/')}`}
        onClick={() => navigate('/')}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
        {isActive('/') && (
          <div className="w-1 h-8 bg-blue-400 rounded-full absolute right-0"></div>
        )}
      </div>

      {/* Documentation */}
      <div 
        className={`h-12 w-full flex justify-start items-center space-x-2 text-lg font-medium mb-3 pl-4 select-none cursor-pointer transition-colors ${getActiveClass('/documentation')}`}
        onClick={() => navigate('/documentation')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-5 h-5 stroke-current"
          strokeWidth="1.5"
          fill="currentColor"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.5 5.5V22c0 .8-.7 1.5-1.5 1.5H5c-.8 0-1.5-.7-1.5-1.5V2c0-.8.7-1.5 1.5-1.5h10.5l5 5z"
          ></path>
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.5 .5V4c0 .8.7 1.5 1.5 1.5h3.5M7.5 11.5h9M7.5 13.5h9M7.5 15.5h9M7.5 17.5h5"
          ></path>
        </svg>
        <span>Documentation</span>
        {isActive('/documentation') && (
          <div className="w-1 h-8 bg-blue-400 rounded-full absolute right-0"></div>
        )}
      </div>

      {/* Dashboard */}
      <div 
        className={`h-12 w-full flex justify-start items-center space-x-2 text-lg font-medium mb-3 pl-4 select-none cursor-pointer transition-colors ${getActiveClass('/dashboard')}`}
        onClick={() => navigate('/dashboard')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-current"
        >
          <path d="M8.5 3h-3a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 0 0-5zm0 4h-3a1.5 1.5 0 0 1 0-3h3a1.5 1.5 0 0 1 0 3zm0 3h-3A2.5 2.5 0 0 0 3 12.5v6A2.5 2.5 0 0 0 5.5 21h3a2.5 2.5 0 0 0 2.5-2.5v-6A2.5 2.5 0 0 0 8.5 10zm1.5 8.5A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-6A1.5 1.5 0 0 1 5.5 11h3a1.5 1.5 0 0 1 1.5 1.5zm8.5-2.5h-3a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 0 0-5zm0 4h-3a1.5 1.5 0 0 1 0-3h3a1.5 1.5 0 0 1 0 3zm0-17h-3A2.5 2.5 0 0 0 13 5.5v6a2.5 2.5 0 0 0 2.5 2.5h3a2.5 2.5 0 0 0 2.5-2.5v-6A2.5 2.5 0 0 0 18.5 3zm1.5 8.5a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-6A1.5 1.5 0 0 1 15.5 4h3A1.5 1.5 0 0 1 20 5.5z"></path>
        </svg>
        <span>Dashboard</span>
        {isActive('/dashboard') && (
          <div className="w-1 h-8 bg-blue-400 rounded-full absolute right-0"></div>
        )}
      </div>

      {/* Bus Routes */}
      <div 
        className={`h-12 w-full flex justify-start items-center space-x-2 text-lg font-medium mb-3 pl-4 select-none cursor-pointer transition-colors ${getActiveClass('/public')}`}
        onClick={() => navigate('/public')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          className="w-5 h-5 fill-current"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M56.38 52H3.11l7.78-30h1.57M31.61 22h21.5l7.78 30"></path>
            <path d="m55.18 29.99-5.04 1.63h-.01M46.39 32.83l-16.42 5.3-3.76 1.21-21.62 6.98h-.01M30.26 42.71l-17.69 5.71M34 41.5l16.43-5.3 2.62-.85M37.55 48.79l-7.29-6.08M46.6 52 34 41.5"></path>
            <path d="M50.14 31.62h-.01l-7.78-6.49M46.39 32.83 33.4 22"></path>
            <circle cx="22" cy="18.67" r="6.67"></circle>
            <path d="M22.69 15.06a3.7 3.7 0 0 1 2.65 2.09M22 25.33v7.78"></path>
          </g>
        </svg>
        <span>Bus Routes</span>
        {isActive('/public') && (
          <div className="w-1 h-8 bg-blue-400 rounded-full absolute right-0"></div>
        )}
      </div>

      {/* Delivery Planner with Dropdown (renamed from Tracking) */}
      <div className="w-full select-none relative">
        <div
          className={`h-12 w-full flex justify-between items-center text-lg font-medium mb-3 pl-4 pr-4 cursor-pointer transition-colors ${isDeliveryOpen || currentPath === '/delivery' ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'}`}
          onClick={() => setDeliveryOpen(!isDeliveryOpen)}
        >
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-5 h-5 fill-current"
            >
              <path
                fill="currentColor"
                d="M26,21a5,5,0,0,0-4.9,4H7a4,4,0,0,1,0-8H25A6,6,0,0,0,25,5H10.9a5,5,0,1,0,0,2H25a4,4,0,0,1,2.84,6.83A4,4,0,0,1,25,15H7A6,6,0,1,0,7,27H21.1A5,5,0,1,0,26,21ZM6,9A3,3,0,1,1,9,6,3,3,0,0,1,6,9ZM26,29a3,3,0,1,1,3-3A3,3,0,0,1,26,29Z"
              ></path>
            </svg>
            <span>Deliveries</span>
          </div>
          {isDeliveryOpen ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </div>

        {/* Animated Dropdown */}
        <AnimatePresence>
          {isDeliveryOpen && (
            <motion.div
              key="delivery-dropdown"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="ml-8 space-y-3 text-sm"
            >
              <div className="mb-8 space-y-3">
                <div 
                  className={`cursor-pointer flex items-center space-x-2 ${isActive('/delivery') ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => navigate('/delivery')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 96 96"
                    className="w-5 h-5 fill-current"
                  >
                    <g>
                      <path d="M79.753 16.246 53.566 73.381l-7.142-23.806-23.806-7.142 57.135-26.187M96 0 0 44l40 12 12 40L96 0z"></path>
                    </g>
                  </svg>
                  <span>New Route</span>
                  {isActive('/delivery') && (
                    <div className="w-1 h-6 bg-blue-400 rounded-full absolute right-0"></div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};