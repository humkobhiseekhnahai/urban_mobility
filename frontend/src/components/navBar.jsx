import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

export const NavBar = () => {
  const navigate = useNavigate();
  
  return (
    <nav className="w-full h-20 bg-neutral-800 border-b-2 border-amber-400 shadow-lg">
      <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-6">
        <div className="flex items-center space-x-8">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
          <img onClick={()=>navigate('/')} className='w-33 cursor-pointer' src={assets.logo} alt='' />
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8 ml-10">
            <button 
              className="relative group text-white hover:text-amber-300 transition-colors duration-200"
              onClick={() => navigate("/dashboard")}
            >
              <span className="text-lg font-medium tracking-wide">Dashboard</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            
            <button 
              className="relative group text-white hover:text-amber-300 transition-colors duration-200"
              onClick={() => navigate("/delivery")}
            >
              <span className="text-lg font-medium tracking-wide">Delivery</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-full bg-amber-400 flex items-center justify-center">
            <span className="text-neutral-900 font-medium">JD</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
