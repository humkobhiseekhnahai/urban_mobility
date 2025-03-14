//delivery page
import { useState } from 'react';
import { NavBarComponent } from '../components/navBarComponent';
import { Delivery_new } from '../components/deliveryComponents/delivery_main';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

function Delivery() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-neutral-900">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block fixed top-0 left-0 h-full w-56 bg-neutral-900 z-40">
        <NavBarComponent />
      </div>

      {/* Burger menu for smaller screens */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="fixed top-4 right-4 z-50 p-2 rounded-md bg-neutral-800 text-white"
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Animated Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <motion.div
                initial={{ x: -256 }}
                animate={{ x: 0 }}
                exit={{ x: -256 }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed top-0 left-0 h-full w-64 bg-neutral-900 z-50 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <NavBarComponent />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="absolute top-4 right-4 text-white"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full md:ml-56">
        <Delivery_new />
      </div>
    </div>
  );
}

export default Delivery;
