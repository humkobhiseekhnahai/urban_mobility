import React, { useState } from 'react';
import logo from '../assets/UPLYFT.svg';

const Documentation = () => {
  // State to track the currently active section
  const [activeSection, setActiveSection] = useState('introduction');

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
          <pre className="bg-gray-800 text-white p-4 rounded-lg font-mono">
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
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-1/5 p-6 h-auto md:h-screen sticky top-0 overflow-y-auto border-r border-gray-700">

        <img src={logo} alt="UPLYFT Logo" className="-mt-7 h-22 w-22 object-contain mb-1"/>
        <ul className="space-y-4">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => setActiveSection(section.id)}
                className={`block text-gray-400 hover:text-white transition ${
                  activeSection === section.id ? 'text-blue-400' : ''
                }`}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <a
            href="#"
            className="block text-gray-400 hover:text-white text-sm transition"
          >
            Contributing to UPLYFT
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full md:w-3/4 p-8">
        {sections.map(
          (section) =>
            activeSection === section.id && (
              <section key={section.id} id={section.id} className="mb-12">
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
                  sections[sections.findIndex((s) => s.id === activeSection) - 1]
                    .id
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
                  sections[sections.findIndex((s) => s.id === activeSection) + 1]
                    .id
                )
              }
              className="text-gray-400 hover:text-white transition"
            >
              Next →
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Documentation;
