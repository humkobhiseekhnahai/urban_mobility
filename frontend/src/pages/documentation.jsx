import React from 'react';

const Documentation = () => {
  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      content: (
        <>
          <p className="text-gray-100">
            UPLYFT is an AI-driven platform that optimizes urban logistics and city mobility. By intelligently analyzing traffic patterns, delivery routes, and public transport data, it reduces congestion for cities and cuts costs for businesses—creating smarter, greener, and more efficient urban ecosystems.
          </p>
        </>
      )
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      content: (
        <>
          <p className="text-gray-100">Dashboard features</p>
          <pre className="bg-gray-900 text-white p-4 rounded-lg font-mono">
            {`jo bhi daalna ho daal denge`}
          </pre>
        </>
      )
    },
    {
      id: 'delivery',
      title: 'Delivery',
      content: (
        <>
          <p className="text-gray-100">Delivery page features</p>
        </>
      )
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-inherit">
      {/* Left Sidebar - Navigation */}
      <aside className="w-full md:w-1/4 bg-inherit shadow-lg p-6 relative md:sticky md:top-0 h-auto md:h-screen overflow-y-auto">
        <h1 className="text-2xl font-bold tracking-widest text-blue-500 border-b pb-3">UPLYFT</h1>
        <ul className="mt-4 space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a 
                href={`#${section.id}`} 
                className="block p-2 text-gray-100 hover:bg-blue-500 rounded-lg transition"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="w-full md:w-3/4 p-8">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="mb-8 bg-inherit p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-white border-l-4 border-blue-500 pl-4 mb-4">{section.title}</h2>
            <div className="text-gray-100">{section.content}</div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default Documentation;
