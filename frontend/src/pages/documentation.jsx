import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import logo from '../assets/UPLYFT.svg';
import { useNavigate } from 'react-router-dom';

const Documentation = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('introduction');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainContentRef = useRef(null);

  // Sections with enhanced content
  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      content: (
        <>
          <h3 className="text-xl font-semibold text-blue-400 mb-4">What is UPLYFT?</h3>
          <p className="mb-6 leading-relaxed">
            UPLYFT is an AI-powered platform designed to transform urban logistics and public transport management. It leverages real-time data, smart algorithms, and predictive analytics to create a seamless, efficient, and eco-friendly transportation ecosystem. Whether it's optimizing delivery routes, reducing congestion, or enhancing public transit efficiency, UPLYFT provides a comprehensive solution for urban mobility challenges.
          </p>
          
          <h3 className="text-xl font-semibold text-blue-400 mb-4">Understanding the Problem: Why Do We Need UPLYFT?</h3>
          <p className="mb-6 leading-relaxed">
            Modern cities face several transportation challenges, including traffic congestion, inefficient delivery routes, and suboptimal public transport systems. These issues lead to wasted time, increased fuel consumption, environmental pollution, and economic losses. UPLYFT is designed to tackle these problems by offering a data-driven, AI-powered solution that optimizes urban mobility.
          </p>
          
          <h3 className="text-xl font-semibold text-blue-400 mb-4">How UPLYFT Works</h3>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 1: Real-Time Data Collection</h4>
            <p className="mb-3 leading-relaxed">
              UPLYFT continuously gathers real-time data from multiple sources, including traffic reports, weather updates, road closures, and GPS tracking of delivery vehicles and public transport. This data serves as the foundation for route optimization and predictive analytics.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • Collects live traffic patterns and congestion data<br/>
              • Monitors road closures, weather conditions, and incidents<br/>
              • Tracks delivery vehicles and public transport movement in real time
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 2: Intelligent Route Optimization</h4>
            <p className="mb-3 leading-relaxed">
              Using AI algorithms, UPLYFT processes the collected data to generate the most efficient routes for deliveries and public transport. The system continuously adapts to changing road conditions and suggests alternate routes to reduce delays.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • Calculates the fastest and most fuel-efficient routes<br/>
              • Dynamically reroutes based on traffic congestion<br/>
              • Ensures timely deliveries and smoother bus operations
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 3: Delivery Route Management</h4>
            <p className="mb-3 leading-relaxed">
              For delivery partners, UPLYFT optimizes package distribution and vehicle load balancing. By entering a warehouse address and delivery stops, the system intelligently assigns cargo to available vehicles and suggests an optimal loading sequence.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • Enter warehouse address and delivery stops<br/>
              • View interactive map with real-time location markers<br/>
              • Optimize cargo loading sequence for efficiency<br/>
              • Select vehicle details and number of trucks required
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 4: Public Transport Optimization</h4>
            <p className="mb-3 leading-relaxed">
              For bus operators, UPLYFT provides tools to improve bus routes, schedules, and passenger load balancing. Operators can create new routes, modify existing ones, and use demand analytics to improve fleet efficiency.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • View existing bus routes with origin, destination, and stops<br/>
              • Create new routes by selecting start and end points<br/>
              • Adjust bus schedules to match peak-hour demand<br/>
              • Optimize bus stop sequences based on real-time analytics
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 5: Eco-Friendly Operations</h4>
            <p className="mb-3 leading-relaxed">
              UPLYFT prioritizes environmental sustainability through its ECO Mode. This feature suggests routes that minimize fuel consumption and carbon emissions, making urban mobility more sustainable.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • Recommends fuel-efficient routes<br/>
              • Reduces carbon footprint of delivery vehicles and buses<br/>
              • Balances speed and sustainability for optimal efficiency
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-blue-400 mb-4">Who Can Benefit from UPLYFT?</h3>
          <p className="mb-3 leading-relaxed">
            UPLYFT is designed for three key user groups, each of whom benefits from its intelligent mobility solutions:
          </p>
          <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
            <span className="text-blue-400 font-bold">1. USER:</span><br/>
            • Get real-time public transport updates<br/>
            • Receive optimized transit routes<br/>
            • Reduce commute time and travel hassle<br/>
            <br/>
            <span className="text-blue-400 font-bold">2. DELIVERY PARTNER:</span><br/>
            • Use AI-powered route planning for deliveries<br/>
            • Optimize vehicle load distribution<br/>
            • Save time, fuel, and costs<br/>
            <br/>
            <span className="text-blue-400 font-bold">3. BUS OPERATOR:</span><br/>
            • Improve public transport efficiency with analytics<br/>
            • Balance passenger loads and reduce delays<br/>
            • Optimize bus routes and increase operational efficiency
          </div>
          
          <p className="mb-6 leading-relaxed">
            UPLYFT is the key to a smarter, more connected urban ecosystem. By integrating AI with real-time data, it ensures seamless, efficient, and eco-friendly mobility solutions for cities worldwide.
          </p>
        </>
      ),
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      content: (
        <>
          <h3 className="text-xl font-semibold text-blue-400 mb-4">Understanding the UPLYFT Dashboard</h3>
          <p className="mb-6 leading-relaxed">
            The UPLYFT Dashboard is an advanced interface that provides real-time insights into urban transportation, delivery logistics, and traffic conditions. It is accessible to all three user types—Users, Delivery Partners, and Bus Operators—allowing each to efficiently navigate and optimize their operations. Below is a step-by-step breakdown of how to use the dashboard and its key features.
          </p>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 1: Accessing the Dashboard</h4>
            <p className="mb-3 leading-relaxed">
              Once logged into UPLYFT, navigate to the Dashboard section. The interface is designed to be intuitive, providing an overview of live transportation data, real-time analytics, and interactive tools to assist users in decision-making.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • Log in to your UPLYFT account<br/>
              • Navigate to the Dashboard tab in the main menu<br/>
              • Access real-time transportation insights instantly
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 2: Viewing Bus Details</h4>
            <p className="mb-3 leading-relaxed">
              The dashboard provides a detailed view of all buses currently operating in Bangalore. Users can track active buses, check schedules, and see operational statuses in real time.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • View all active buses running in Bangalore<br/>
              • Check routes, schedules, and expected arrival times<br/>
              • Monitor real-time bus locations and movement
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 3: Using Filters to Select Specific Days</h4>
            <p className="mb-3 leading-relaxed">
              The filtering feature allows users to analyze bus operations on specific days. This is particularly useful for tracking historical trends and planning future journeys.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • Select a specific date from the filter menu<br/>
              • View bus availability and scheduling for that day<br/>
              • Compare past and present data for planning
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 4: Exploring the Interactive Map</h4>
            <p className="mb-3 leading-relaxed">
              A dynamic, interactive map displays all bus routes with clearly marked stops. Users can zoom in and out to view route details, making it easier to plan their journey or delivery.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • View all bus routes with stops marked on the map<br/>
              • Click on a route to see detailed travel information<br/>
              • Use zoom and pan features for enhanced navigation
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 5: Understanding the Traffic Heat Map</h4>
            <p className="mb-3 leading-relaxed">
              The traffic heat map visually represents congestion levels across the city in real time. This is crucial for delivery partners and bus operators looking to avoid high-traffic areas.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • Identify high-traffic areas using color-coded heat maps<br/>
              • Plan routes that avoid congested roads<br/>
              • Use live traffic data for smarter navigation
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 6: Checking Real-Time Weather Updates</h4>
            <p className="mb-3 leading-relaxed">
              Weather conditions can impact travel times and road safety. The dashboard integrates real-time weather data to help users adjust their plans accordingly.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • Get current weather conditions affecting transport<br/>
              • Receive alerts on extreme weather that may impact routes<br/>
              • Adjust travel plans based on real-time weather updates
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 7: Receiving Live Traffic Incident Alerts</h4>
            <p className="mb-3 leading-relaxed">
              The dashboard provides live updates on accidents, roadblocks, and other disruptions, allowing users to reroute and avoid delays.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • Stay informed on accidents, road closures, and diversions<br/>
              • Receive instant alerts for high-impact incidents<br/>
              • Get alternative route suggestions to save time
            </div>
          </div>
          
          <p className="mb-6 leading-relaxed">
            The UPLYFT Dashboard serves as a central hub for users to make informed decisions regarding urban mobility. Whether tracking a bus, optimizing a delivery route, or avoiding congestion, the dashboard provides all the tools necessary for efficient urban transportation.
          </p>
        </>
      ),
    },
    {
      id: 'delivery',
      title: 'Delivery',
      content: (
        <>
          <h3 className="text-xl font-semibold text-blue-400 mb-4">Delivery Route Optimization</h3>
          <p className="mb-6 leading-relaxed">
            The Delivery page is an essential tool designed exclusively for Delivery Partners. It provides an efficient way to plan, optimize, and track deliveries, ensuring cost-effective and eco-friendly logistics. By leveraging real-time data and AI-driven route optimization, delivery partners can reduce fuel costs, save time, and improve overall efficiency.
          </p>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 1: Input Warehouse Address</h4>
            <p className="mb-3 leading-relaxed">
              To begin the delivery planning process, the first step is to input the warehouse address. The system allows inputs in two formats: coordinates or a standard physical address. As soon as you enter the address, a marker will be displayed on the interactive map, allowing you to visually confirm the location.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • Enter the warehouse location using either:<br/>
              • Latitude/Longitude coordinates (e.g., 12.9716° N, 77.5946° E)<br/>
              • Standard address format (e.g., 123 Main Street, Bangalore)<br/>
              • A marker will appear on the interactive map to confirm the location
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 2: Add Delivery Stops</h4>
            <p className="mb-3 leading-relaxed">
              Once the warehouse is set, the next step is to input all delivery stops. Along with the address or coordinates of each stop, you must specify the weight of goods to be delivered at that location. This ensures the system can balance the vehicle load efficiently.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • Input multiple stops with:<br/>
              • Address or GPS coordinates for each delivery location<br/>
              • Weight of cargo at each stop (in kg)<br/>
              • Each stop will be marked on the interactive map with a unique identifier<br/>
              • System updates the total inventory weight automatically as you add stops
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 3: Input Vehicle Details</h4>
            <p className="mb-3 leading-relaxed">
              To optimize delivery routes effectively, the system requires details about the delivery vehicles. This includes the sample weight capacity of a vehicle and the total number of vehicles available for delivery. These inputs allow the system to calculate the best possible weight distribution across all vehicles.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • Enter:<br/>
              • Sample vehicle weight capacity (maximum load in kg)<br/>
              • Total number of vehicles available for this delivery batch<br/>
              • System calculates the optimal distribution of weight across vehicles to minimize trips
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 4: Route Optimization</h4>
            <p className="mb-3 leading-relaxed">
              Once all required data is entered, clicking on the "Optimize" button will trigger the backend process. The AI-powered algorithm will analyze traffic conditions, road closures, and delivery constraints to generate the most efficient delivery routes. The optimized routes will be displayed dynamically on the interactive map, showing the weight distribution across each truck and the stop sequence.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • Clicking 'Optimize' will:<br/>
              • Process route calculations using AI algorithms<br/>
              • Distribute cargo weight optimally across vehicles<br/>
              • Display results dynamically on the interactive map with color-coded routes<br/>
              • Show each truck's weight, stop sequence, and expected delivery times<br/>
              • Provide estimated fuel consumption and total delivery time
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 5: ECO Mode for Climate Conservation</h4>
            <p className="mb-3 leading-relaxed">
              The Delivery page includes an optional ECO Mode, which prioritizes environmentally friendly and fuel-efficient routes. This feature is designed to reduce carbon emissions, optimize fuel usage, and contribute to sustainable logistics practices.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • ECO Mode Benefits:<br/>
              • Minimizes fuel consumption by up to 15%<br/>
              • Reduces overall carbon footprint of delivery operations<br/>
              • Optimizes delivery routes with environmental impact in mind<br/>
              • May slightly increase delivery time but significantly reduces emissions
            </div>
          </div>
          
          <p className="mb-6 leading-relaxed">
            The Delivery page simplifies logistics planning through real-time mapping, automatic inventory updates, and AI-driven route optimization. It ensures delivery partners can operate efficiently while contributing to a greener future.
          </p>
        </>
      ),
    },
    {
      id: 'bus_operator',
      title: 'Bus Routes',
      content: (
        <>
                    <h3 className="text-xl font-semibold text-blue-400 mb-4">Public Transport Route Management</h3>
          <p className="mb-6 leading-relaxed">
            The Bus Routes section is exclusively designed for Bus Operators to manage and optimize public transport routes. This powerful tool enables operators to create new routes, modify existing ones, and analyze passenger data to improve overall service efficiency. By leveraging AI-powered analytics, bus operators can make data-driven decisions that enhance the public transport experience.
          </p>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 1: Viewing Existing Routes</h4>
            <p className="mb-3 leading-relaxed">
              Upon accessing the Bus Routes section, operators can view a comprehensive list of all existing bus routes. Each route displays key information such as origin, destination, number of stops, and current operational status.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • View all active bus routes in a sortable table format<br/>
              • See route numbers, start/end points, and total distance<br/>
              • Check passenger volume and peak hours for each route<br/>
              • Monitor on-time performance metrics for each route
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 2: Creating New Routes</h4>
            <p className="mb-3 leading-relaxed">
              The system provides an intuitive interface for creating new bus routes. Operators can select start and end points on the map and add intermediate stops to define the complete route path.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • Click "Create New Route" to begin the process<br/>
              • Select origin and destination points on the interactive map<br/>
              • Add intermediate stops by clicking on the map or entering addresses<br/>
              • Set schedule times, frequency, and service days<br/>
              • The system automatically calculates route distance and estimated travel time
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 3: Route Optimization</h4>
            <p className="mb-3 leading-relaxed">
              The AI-powered optimization tool analyzes traffic patterns, passenger demand, and historical data to suggest improvements to existing routes. This helps operators maximize efficiency and passenger satisfaction.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • Select a route to optimize from the list<br/>
              • View AI-generated suggestions for route improvements<br/>
              • See potential time savings and efficiency gains<br/>
              • Adjust stop sequences to reduce overall travel time<br/>
              • Optimize bus schedules based on passenger demand patterns
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 4: Analyzing Passenger Data</h4>
            <p className="mb-3 leading-relaxed">
              The system provides detailed analytics on passenger volumes, peak hours, and travel patterns. This data is crucial for making informed decisions about route modifications and service frequency.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • View heat maps showing passenger density along routes<br/>
              • Analyze hourly, daily, and seasonal passenger trends<br/>
              • Identify underserved areas and overcrowded routes<br/>
              • Use predictive analytics to forecast future demand
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">Step 5: Managing Service Disruptions</h4>
            <p className="mb-3 leading-relaxed">
              The Bus Routes section includes tools for managing planned and unplanned service disruptions. Operators can create detours, adjust schedules, and communicate changes to passengers in real-time.
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-lg font-mono overflow-x-auto mb-6">
              • Create temporary route detours due to road closures<br/>
              • Adjust service frequency during special events<br/>
              • Send real-time notifications to passengers about changes<br/>
              • View impact analysis of service modifications
            </div>
          </div>
          
          <p className="mb-6 leading-relaxed">
            The Bus Routes section empowers operators to create a more efficient, responsive, and passenger-focused public transport system. By leveraging data analytics and AI-driven insights, operators can continuously improve service quality while optimizing operational costs.
          </p>
        </>
      ),
    },
    // You can add more sections as needed
  ];

  // Function to scroll to the active section
useEffect(() => {
  if (mainContentRef.current) {
    mainContentRef.current.scrollTop = 0;
  }
}, [activeSection]);

// Function to navigate to next or previous section
const navigateSection = (direction) => {
  const currentIndex = sections.findIndex((section) => section.id === activeSection);
  if (direction === 'next' && currentIndex < sections.length - 1) {
    setActiveSection(sections[currentIndex + 1].id);
  } else if (direction === 'prev' && currentIndex > 0) {
    setActiveSection(sections[currentIndex - 1].id);
  }
};

// Get next and previous section titles
const currentIndex = sections.findIndex((section) => section.id === activeSection);
const prevSection = currentIndex > 0 ? sections[currentIndex - 1].title : null;
const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1].title : null;

return (
  <div className="flex h-screen bg-black text-white">
    {/* Header with navigation controls - subtle and professional */}
    <div className="fixed top-0 left-0 right-0 z-30 bg-black border-b border-gray-800 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden mr-3 p-2 rounded-md hover:bg-gray-900 transition-all duration-200 flex items-center justify-center"
          aria-label="Toggle navigation"
        >
          <Icon icon={sidebarOpen ? "mdi:close" : "mdi:menu"} className="text-xl" />
        </button>
        <img src={logo} alt="UPLYFT Logo" className="h-16 -my-4 cursor-pointer " onClick={() => navigate('/')} />
      </div>
      
      <button
        onClick={() => navigate('/')}
        className="p-2 rounded-md hover:bg-gray-900 transition-all duration-200 flex items-center border border-gray-800"
        title="Back to Home"
      >
        <Icon icon="mdi:home" className="text-lg" />
      </button>
    </div>
    
    {/* Sidebar - clean and professional */}
    <div
      className={`fixed inset-y-0 left-0 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 z-20 w-64 bg-black border-r border-gray-800 transition-transform duration-300 ease-in-out overflow-y-auto pt-16`}
    >
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6 text-blue-400 border-b border-gray-800 pb-3">Documentation</h2>
        
        <nav>
          <ul className="space-y-1">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => {
                    setActiveSection(section.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-md transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-gray-900 text-blue-400 border-l-4 border-blue-400'
                      : 'hover:bg-gray-900 text-gray-300 border-l-4 border-transparent'
                  }`}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>

    {/* Overlay for mobile */}
    {sidebarOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-70 z-10 md:hidden"
        onClick={() => setSidebarOpen(false)}
      ></div>
    )}

    {/* Main content */}
    <div className="flex-1 flex flex-col pt-16 md:ml-64">
      <div
        ref={mainContentRef}
        className="flex-1 p-6 md:p-8 overflow-y-auto pb-24"
      >
        {sections.find((section) => section.id === activeSection)?.content}
      </div>

      {/* Bottom navigation - subtle and professional */}
      <div className="bg-black border-t border-gray-800 p-4 flex justify-between">
        {prevSection && (
          <button
            onClick={() => navigateSection('prev')}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-800 hover:bg-gray-900 rounded-md transition-colors duration-200"
          >
            <Icon icon="mdi:chevron-left" className="text-blue-400" />
            <span className="text-sm">Previous: {prevSection}</span>
          </button>
        )}
        
        {!prevSection && <div></div>}
        
        {nextSection && (
          <button
            onClick={() => navigateSection('next')}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-800 hover:bg-gray-900 rounded-md transition-colors duration-200"
          >
            <span className="text-sm">Next: {nextSection}</span>
            <Icon icon="mdi:chevron-right" className="text-blue-400" />
          </button>
        )}
      </div>
    </div>
  </div>
);
};

export default Documentation;

