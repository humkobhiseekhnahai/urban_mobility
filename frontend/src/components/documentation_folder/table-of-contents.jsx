import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function TableOfContents({ activeSection }) {
  const [activeSubSection, setActiveSubSection] = useState("");

  // Define subsections for each content type with corrected IDs that match the content
  const sectionMapping = {
    introduction: [
      { id: "what-is-our-platform", label: "What is UPLYFT?" },
      { id: "key-features", label: "Key Features" },
      { id: "getting-started", label: "Getting Started" },
      { id: "code-example", label: "Code Example" },
      { id: "next-steps", label: "Next Steps" }
    ],
    architecture: [
      { id: "system-overview", label: "System Overview" },
      { id: "core-components", label: "Core Components" },
      { id: "data-flow", label: "Data Flow" }
    ],
    public: [
      { id: "understanding-the-uplyft-dashboard", label: "Understanding the UPLYFT Dashboard" },
      { id: "step-1-accessing-the-dashboard", label: "Accessing the Dashboard" },
      { id: "step-2-viewing-bus-details", label: "Viewing Bus Details" },
      { id: "step-3-using-filters-to-select-specific-days", label: "Using Filters" },
      { id: "step-4-exploring-the-interactive-map", label: "Interactive Map" },
      { id: "step-5-understanding-the-traffic-heat-map", label: "Traffic Heat Map" },
      { id: "step-6-checking-real-time-weather-updates", label: "Weather Updates" },
      { id: "step-7-receiving-live-traffic-incident-alerts", label: "Traffic Incident Alerts" }
    ],
    deliverypartner: [
      { id: "delivery-optimization", label: "Delivery Optimization" },
      { id: "delivery-route-optimization", label: "Delivery Route Optimization" },
      { id: "step-1-input-warehouse-address", label: "Input Warehouse Address" },
      { id: "step-2-add-delivery-stops", label: "Add Delivery Stops" },
      { id: "step-3-input-vehicle-details", label: "Input Vehicle Details" },
      { id: "step-4-route-optimization", label: "Route Optimization" },
      { id: "step-5-eco-mode-for-climate-conservation", label: "ECO Mode" }
    ],
    busoperator: [
      { id: "public-transport-optimization", label: "Public Transport Optimization" },
      { id: "public-transport-route-management", label: "Public Transport Route Management" },
      { id: "step-1-viewing-existing-routes", label: "Viewing Existing Routes" },
      { id: "step-2-creating-new-routes", label: "Creating New Routes" },
      { id: "step-3-route-optimization", label: "Route Optimization" },
      { id: "step-4-analyzing-passenger-data", label: "Analyzing Passenger Data" },
      { id: "step-5-managing-service-disruptions", label: "Managing Service Disruptions" }
    ],
    "loading-sequence": [
      { id: "bin-packing-algorithm", label: "Bin Packing Algorithm" },
      { id: "what-is-bin-packing", label: "What is Bin Packing?" },
      { id: "implementation-process", label: "Implementation Process" }
    ],
    deliveryrouting: [
      { id: "genetic-algorithm-for-delivery-routing", label: "Genetic Algorithm" },
      { id: "how-it-works", label: "How It Works" },
      { id: "evolution-process", label: "Evolution Process" },
      { id: "benefits-of-genetic-algorithms", label: "Benefits" }
    ],
    bustransportoptimization: [
      { id: "optimization-techniques", label: "Optimization Techniques" },
      { id: "transshipment-point-optimization", label: "Transshipment Point Optimization" },
      { id: "purpose-and-implementation", label: "Purpose and Implementation" },
      { id: "algorithm-steps", label: "Algorithm Steps" },
      { id: "benefits-of-transshipment-nodes", label: "Benefits" }
    ],
    safetyanalysis: [
      { id: "safety-analytics", label: "Safety Analytics" },
      { id: "safety-analysis-service", label: "Safety Analysis Service" },
      { id: "key-features", label: "Key Features" },
      { id: "real-time-monitoring", label: "Real-Time Monitoring" },
      { id: "impact-benefits", label: "Impact & Benefits" }
    ],
    authentication: [
      { id: "authentication-system", label: "Authentication System" },
      { id: "role-based-access-control", label: "Role-Based Access Control" },
      { id: "user-roles-access-permissions", label: "User Roles & Access" },
      { id: "unauthorized-access-handling", label: "Unauthorized Access" },
      { id: "authentication-flow", label: "Authentication Flow" }
    ],
    database: [
      { id: "database-architecture", label: "Database Architecture" },
      { id: "postgresql-prisma-integration", label: "PostgreSQL & Prisma" },
      { id: "key-database-features", label: "Key Database Features" },
      { id: "prisma-orm-implementation", label: "Prisma ORM" },
      { id: "database-schema-design", label: "Database Schema" }
    ]
  };

  // Track active subsection based on scroll position
  useEffect(() => {
    // If no active section or no mapping exists, reset active subsection
    if (!activeSection || !sectionMapping[activeSection]) {
      setActiveSubSection("");
      return;
    }

    const subsections = sectionMapping[activeSection].map(item => item.id);

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      // Find the section that is currently in view
      for (let i = 0; i < subsections.length; i++) {
        const section = subsections[i];
        const element = document.getElementById(section);
        
        if (!element) {
          console.warn(`Element with ID "${section}" not found`);
          continue;
        }
        
        const { offsetTop, offsetHeight } = element;
        const nextElement = i < subsections.length - 1 ? document.getElementById(subsections[i + 1]) : null;
        
        // If this is the last section or we're above the next section
        if (!nextElement || scrollPosition < nextElement.offsetTop) {
          if (scrollPosition >= offsetTop - 100 && scrollPosition < offsetTop + offsetHeight) {
            setActiveSubSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // Initialize on mount with a slight delay to ensure DOM is fully loaded
    setTimeout(handleScroll, 300);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeSection]);

  // Handle smooth scrolling to subsections with improved reliability
  const handleClick = (e, sectionId) => {
    e.preventDefault();
    
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      
      if (element) {
        // Calculate position with offset for header
        const yOffset = -100; // Adjust based on your header height
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        // Smooth scroll to the element
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
        
        // Update active section immediately for better UX
        setActiveSubSection(sectionId);
      } else {
        console.error(`Element with ID "${sectionId}" not found when clicking`);
      }
    }, 100);
  };

  // If no mapping exists for the active section, don't show table of contents
  if (!activeSection || !sectionMapping[activeSection]) {
    return null;
  }

  // Get the subsections for the current active section
  const currentSectionItems = sectionMapping[activeSection];

  // Group subsections into main sections and nested sections
  const mainSections = currentSectionItems.filter(item => 
    !item.id.includes('-') || item.id.split('-').length <= 2
  );
  
  const getNestedSections = (mainSectionId) => {
    return currentSectionItems.filter(item => 
      item.id !== mainSectionId && 
      (item.id.startsWith(mainSectionId + '-') || 
       item.parent === mainSectionId)
    );
  };

  return (
    <div className="space-y-4 p-6 bg-black border border-gray-800 rounded-lg m-5">
      <h3 className="text-base font-semibold text-gray-200 pb-2 border-b border-gray-800">
        On This Page
      </h3>
      <nav className="space-y-2">
        <ul className="m-0 list-none space-y-1">
          {mainSections.map((section) => (
            <li key={section.id} className="mt-2">
              <motion.a
                href={`#${section.id}`}
                onClick={(e) => handleClick(e, section.id)}
                className={`flex items-center px-3 py-2 ${
                  activeSubSection === section.id 
                    ? "text-white bg-gray-900" 
                    : "text-gray-400 hover:text-white hover:bg-gray-900"
                } rounded-md transition-colors`}
                whileHover={{ x: 4 }}
              >
                {section.label}
              </motion.a>
              
              {/* Nested subsections */}
              {getNestedSections(section.id).length > 0 && (
                <ul className="m-0 list-none pl-4 border-l-2 border-gray-800 ml-3">
                  {getNestedSections(section.id).map((subSection) => (
                    <li key={subSection.id} className="mt-1">
                      <motion.a
                        href={`#${subSection.id}`}
                        onClick={(e) => handleClick(e, subSection.id)}
                        className={`flex items-center px-3 py-1.5 ${
                          activeSubSection === subSection.id 
                            ? "text-white bg-gray-900" 
                            : "text-gray-400 hover:text-white hover:bg-gray-900"
                        } rounded-md transition-colors`}
                        whileHover={{ x: 4 }}
                      >
                        <span className={`w-1.5 h-1.5 ${
                          activeSubSection === subSection.id ? "bg-white" : "bg-gray-600"
                        } rounded-full mr-2`} />
                        {subSection.label}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
