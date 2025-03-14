import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import logo from '../assets/UPLYFT.svg';
import { useNavigate } from 'react-router-dom';

const Documentation = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('introduction');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      content: (
        <>
          <p>
            UPLYFT is an AI-driven platform that optimizes urban logistics and city mobility. By intelligently analyzing traffic patterns, delivery routes, and public transport data, it reduces congestion for cities and cuts costs for businesses—creating smarter, greener, and more efficient urban ecosystems.
          </p>
        </>
      ),
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      content: (
        <>
          <p>Dashboard features</p>
          <pre className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto">
            {`jo bhi daalna ho daal denge`}
          </pre>
        </>
      ),
    },
    {
      id: 'delivery',
      title: 'Delivery',
      content: (
        <>
          <p>Delivery page features</p>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Mobile Header with Menu Toggle and Home Button */}
      <div className="md:hidden flex justify-between items-center p-4 border-b border-gray-700">
        <div className="flex items-center">
          <img src={logo} alt="UPLYFT Logo" className="h-10 w-auto" />
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded-lg transition"
          >
            <Icon icon="mdi-light:home" className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            <Icon icon={sidebarOpen ? "mdi:close" : "mdi:menu"} className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col md:flex-row relative">
        {/* Sidebar Navigation - Hidden on mobile unless toggled */}
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-1/5 p-6 h-auto md:h-screen md:sticky top-0 overflow-y-auto border-r border-gray-700 bg-black z-10`}>
          <div className="hidden md:block">
            <img src={logo} alt="UPLYFT Logo" className="-mt-7 h-22 w-22 object-contain mb-1" />
          </div>

          <ul className="space-y-4 mt-4 md:mt-0">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => {
                    setActiveSection(section.id);
                    setSidebarOpen(false);
                  }}
                  className={`block w-full text-left text-gray-400 hover:text-white transition ${
                    activeSection === section.id ? 'text-blue-400' : ''
                  }`}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <a href="#" className="block text-gray-400 hover:text-white text-sm transition">
              Contributing to UPLYFT
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-4/5 p-4 md:p-8 relative">
          {/* Desktop Home Button - Top Right */}
          <div className="hidden md:block absolute top-4 right-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg shadow transition"
            >
              <Icon icon="mdi-light:home" className="w-5 h-5 mr-1" />
              <span>Home</span>
            </button>
          </div>

          {sections.map(
            (section) =>
              activeSection === section.id && (
                <section key={section.id} id={section.id} className="mb-12 md:mt-8">
                  <h2 className="text-xl font-bold mb-4">{section.title}</h2>
                  <div className="text-gray-400">{section.content}</div>
                </section>
              )
          )}

          {/* Bottom Navigation */}
          <div className="flex justify-between items-center mt-12 border-t border-gray-700 pt-6">
            {sections.findIndex((s) => s.id === activeSection) > 0 && (
              <button
                onClick={() =>
                  setActiveSection(
                    sections[sections.findIndex((s) => s.id === activeSection) - 1].id
                  )
                }
                className="text-gray-400 hover:text-white transition"
              >
                ← Previous
              </button>
            )}
            {sections.findIndex((s) => s.id === activeSection) <
              sections.length - 1 && (
              <button
                onClick={() =>
                  setActiveSection(
                    sections[sections.findIndex((s) => s.id === activeSection) + 1].id
                  )
                }
                className="text-gray-400 hover:text-white transition ml-auto"
              >
                Next →
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Documentation;
