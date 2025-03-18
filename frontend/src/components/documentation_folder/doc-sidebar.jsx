import { motion } from "framer-motion";
import logo from "../../assets/UPLYFT.svg";
import { useNavigate } from "react-router-dom";

const MotionButton = motion.button;

export function DocsSidebar({ activeSection, setActiveSection }) {
  const navigate = useNavigate();
  // Function to handle section changes
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    // Scroll to top when changing sections
    window.scrollTo(0, 0);
  };

  return (
    <div className="pr-4 border-r border-gray-800 h-screen sticky top-0 flex flex-col bg-black ">
      {/* Fixed Logo Section */}
      <div className=" flex justify-center items-center pr-10 pt-6 pb-4 px-4 bg-black/80 backdrop-blur-sm sticky top-0 z-10">
        <motion.img
          src={logo}
          alt="UPLYFT Logo"
          onClick={() => navigate("/")}
          className=" h-30 w-auto transition-transform hover:scale-105 -my-10 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto py-6 lg:py-8">
        <div className="space-y-8 px-4">
          {/* Getting Started Section */}
          <div className="pb-2">
            <motion.h4
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-3 px-3 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg"
            >
              Overview
            </motion.h4>
            <div className="space-y-1">
              {[
                { id: "introduction", label: "Introduction" },
                { id: "architecture", label: "Architecture" },
              ].map((item, index) => (
                <MotionButton
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  }}
                  className={`group flex w-full items-center px-3 py-2.5 rounded-lg transition-all ${
                    activeSection === item.id
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 bg-white rounded-full mr-3 ${
                      activeSection === item.id
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    } transition-opacity`}
                  />
                  {item.label}
                </MotionButton>
              ))}
            </div>
          </div>

          {/* Consumer model section */}
          <div className="pb-2">
            <motion.h4
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-3 px-3 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg"
            >
              Consumer Model
            </motion.h4>
            <div className="space-y-1">
              {[
                { id: "public", label: "Public" },
                { id: "deliverypartner", label: "Delivery Partner" },
                { id: "busoperator", label: "Bus Operator" },
              ].map((item, index) => (
                <MotionButton
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  }}
                  className={`group flex w-full items-center px-3 py-2.5 rounded-lg transition-all ${
                    activeSection === item.id
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 bg-white rounded-full mr-3 ${
                      activeSection === item.id
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    } transition-opacity`}
                  />
                  {item.label}
                </MotionButton>
              ))}
            </div>
          </div>

          {/* Core Concepts Section */}
          <div className="pb-2">
            <motion.h4
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-3 px-3 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg"
            >
              Core Concepts
            </motion.h4>
            <div className="space-y-1">
              {[
                { id: "loading-sequence", label: "Loading Sequence" },
                { id: "deliveryrouting", label: "Delivery Routing" },
                {
                  id: "bustransportoptimization",
                  label: "Bus Transport Optimization",
                },
                { id: "safetyanalysis", label: "Safety Analysis" },
              ].map((item, index) => (
                <MotionButton
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  }}
                  className={`group flex w-full items-center px-3 py-2.5 rounded-lg transition-all ${
                    activeSection === item.id
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 bg-white rounded-full mr-3 ${
                      activeSection === item.id
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    } transition-opacity`}
                  />
                  {item.label}
                </MotionButton>
              ))}
            </div>
          </div>

          {/* Advanced Section */}
          <div className="pb-2">
            <motion.h4
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-3 px-3 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg"
            >
              Advanced
            </motion.h4>
            <div className="space-y-1">
              {[
                { id: "authentication", label: "Authentication" },
                { id: "database", label: "Database" },
              ].map((item, index) => (
                <MotionButton
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  }}
                  className={`group flex w-full items-center px-3 py-2.5 rounded-lg transition-all ${
                    activeSection === item.id
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 bg-white rounded-full mr-3 ${
                      activeSection === item.id
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    } transition-opacity`}
                  />
                  {item.label}
                </MotionButton>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
