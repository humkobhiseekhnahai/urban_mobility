"use client"

import { useState, useEffect } from "react";
import { ChevronRight, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/UPLYFT.svg";
import StarBackground from "./homeComponents/StarBackground";

export const NavBarComponent = () => {
  const [isDeliveryOpen, setDeliveryOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Open delivery dropdown if the current path is "/delivery"
  useEffect(() => {
    if (currentPath === "/delivery") {
      setDeliveryOpen(true);
    }
  }, [currentPath]);

  // Helper: determine if a route is active
  const isActive = (path) => currentPath === path;

  // Helper: return active CSS classes for a menu item
  const getActiveClass = (path) =>
    isActive(path)
      ? "bg-blue-500/10 text-blue-400 font-medium"
      : "text-gray-400 hover:text-gray-200 hover:bg-white/5";

  return (
    <div className="relative bg-neutral-900 w-56 flex-shrink-0 border-r border-neutral-800 shadow-xl flex flex-col min-h-screen">
      {/* Star Background as navbar background (rendered behind the content) */}
      <StarBackground />

      {/* Top Section: Logo & Navigation Menu */}
      <div className="flex-grow relative z-10">
        {/* Logo container */}
        <div
          className="h-20 border-b border-neutral-800 flex justify-center items-center cursor-pointer transition-all hover:bg-neutral-800/30"
          onClick={() => navigate("/")}
        >
          <img
            src={logo || "/placeholder.svg"}
            alt="UPLYFT Logo"
            className="h-12 w-12 object-contain"
          />
        </div>

        {/* Navigation Menu */}
        <div className="py-4 px-2">
          {/* Home */}
          <div
            className={`h-11 w-full flex justify-start items-center space-x-3 text-base font-medium mb-1 px-3 rounded-md cursor-pointer transition-all duration-200 ${getActiveClass("/")}`}
            onClick={() => navigate("/")}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
            {isActive("/") && (
              <div className="w-1 h-6 bg-blue-500 rounded-full absolute right-0 mr-1"></div>
            )}
          </div>

          {/* Documentation */}
          <div
            className={`h-11 w-full flex justify-start items-center space-x-3 text-base font-medium mb-1 px-3 rounded-md cursor-pointer transition-all duration-200 ${getActiveClass("/documentation")}`}
            onClick={() => navigate("/documentation")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5 stroke-current"
              strokeWidth="1.5"
              fill="none"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.5 5.5V22c0 .8-.7 1.5-1.5 1.5H5c-.8 0-1.5-.7-1.5-1.5V2c0-.8.7-1.5 1.5-1.5h10.5l5 5z"
              ></path>
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.5 .5V4c0 .8.7 1.5 1.5 1.5h3.5M7.5 11.5h9M7.5 13.5h9M7.5 15.5h9M7.5 17.5h5"
              ></path>
            </svg>
            <span>Documentation</span>
            {isActive("/documentation") && (
              <div className="w-1 h-6 bg-blue-500 rounded-full absolute right-0 mr-1"></div>
            )}
          </div>

          {/* Dashboard */}
          <div
            className={`h-11 w-full flex justify-start items-center space-x-3 text-base font-medium mb-1 px-3 rounded-md cursor-pointer transition-all duration-200 ${getActiveClass("/dashboard")}`}
            onClick={() => navigate("/dashboard")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-current"
            >
              <path d="M8.5 3h-3a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 0 0-5zm0 4h-3a1.5 1.5 0 0 1 0-3h3a1.5 1.5 0 0 1 0 3zm0 3h-3A2.5 2.5 0 0 0 3 12.5v6A2.5 2.5 0 0 0 5.5 21h3a2.5 2.5 0 0 0 2.5-2.5v-6A2.5 2.5 0 0 0 8.5 10zm1.5 8.5A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-6A1.5 1.5 0 0 1 5.5 11h3a1.5 1.5 0 0 1 1.5 1.5zm8.5-2.5h-3a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 0 0-5zm0 4h-3a1.5 1.5 0 0 1 0-3h3a1.5 1.5 0 0 1 0 3zm0-17h-3A2.5 2.5 0 0 0 13 5.5v6a2.5 2.5 0 0 0 2.5 2.5h3a2.5 2.5 0 0 0 2.5-2.5v-6A2.5 2.5 0 0 0 18.5 3zm1.5 8.5a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-6A1.5 1.5 0 0 1 15.5 4h3A1.5 1.5 0 0 1 20 5.5z"></path>
            </svg>
            <span>Dashboard</span>
            {isActive("/dashboard") && (
              <div className="w-1 h-6 bg-blue-500 rounded-full absolute right-0 mr-1"></div>
            )}
          </div>

          {/* Bus Routes */}
          <div
            className={`h-11 w-full flex justify-start items-center space-x-3 text-base font-medium mb-1 px-3 rounded-md cursor-pointer transition-all duration-200 ${getActiveClass("/public")}`}
            onClick={() => navigate("/public")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              className="w-5 h-5 stroke-current"
              fill="none"
              strokeWidth="2"
            >
              <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M56.38 52H3.11l7.78-30h1.57M31.61 22h21.5l7.78 30"></path>
                <path d="m55.18 29.99-5.04 1.63h-.01M46.39 32.83l-16.42 5.3-3.76 1.21-21.62 6.98h-.01M30.26 42.71l-17.69 5.71M34 41.5l16.43-5.3 2.62-.85M37.55 48.79l-7.29-6.08M46.6 52 34 41.5"></path>
                <path d="M50.14 31.62h-.01l-7.78-6.49M46.39 32.83 33.4 22"></path>
                <circle cx="22" cy="18.67" r="6.67"></circle>
                <path d="M22.69 15.06a3.7 3.7 0 0 1 2.65 2.09M22 25.33v7.78"></path>
              </g>
            </svg>
            <span>Bus Routes</span>
            {isActive("/public") && (
              <div className="w-1 h-6 bg-blue-500 rounded-full absolute right-0 mr-1"></div>
            )}
          </div>

          {/* Delivery Planner with Dropdown */}
          <div className="w-full select-none relative mt-2">
            <div
              className={`h-11 w-full flex justify-between items-center text-base font-medium mb-1 px-3 rounded-md cursor-pointer transition-all duration-200 ${
                isDeliveryOpen || currentPath === "/delivery"
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
              onClick={() => setDeliveryOpen(!isDeliveryOpen)}
            >
              <div className="flex items-center space-x-3">
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
              <motion.div animate={{ rotate: isDeliveryOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </div>

            {/* Animated Dropdown */}
            <AnimatePresence>
              {isDeliveryOpen && (
                <motion.div
                  key="delivery-dropdown"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pl-8 py-2">
                    <div
                      className={`h-10 flex items-center space-x-3 px-3 rounded-md cursor-pointer transition-all duration-200 ${
                        isActive("/delivery")
                          ? "bg-blue-500/10 text-blue-400 font-medium"
                          : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                      }`}
                      onClick={() => navigate("/delivery")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" className="w-4 h-4 fill-current">
                        <g>
                          <path d="M79.753 16.246 53.566 73.381l-7.142-23.806-23.806-7.142 57.135-26.187M96 0 0 44l40 12 12 40L96 0z"></path>
                        </g>
                      </svg>
                      <span className="text-sm">New Route</span>
                      {isActive("/delivery") && (
                        <div className="w-1 h-5 bg-blue-500 rounded-full absolute right-0 mr-1"></div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom section - always visible */}
      <div className="flex-none">
        <div className="border-t border-neutral-800 py-4 px-4">
          <div className="text-xs text-neutral-500 text-center">UPLYFT © {new Date().getFullYear()}</div>
        </div>
      </div>
    </div>
  );
};

export default NavBarComponent;
