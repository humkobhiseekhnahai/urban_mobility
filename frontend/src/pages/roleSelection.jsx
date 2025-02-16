import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function RoleSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token') || localStorage.getItem('authToken');
    
    if (!token) {
      navigate('/login');
    } else {
      localStorage.setItem('authToken', token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleRoleSelect = async (role) => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:3000/auth/update-role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ role })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update role');
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-4xl p-4 sm:p-6 lg:p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-2">Choose Your Role</h2>
          <p className="text-gray-400 text-center">Select how you want to use the platform</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex flex-col p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex flex-col h-full">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">User</h3>
                <p className="text-gray-400 text-sm text-center mb-4">Book trips and manage your travel schedules with ease</p>
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => handleRoleSelect('user')}
                  disabled={isLoading}
                  className={`w-full py-2.5 px-4 rounded-lg text-white font-medium transition duration-200
                    ${isLoading 
                      ? 'bg-blue-500/50 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30'
                    }`}
                >
                  {isLoading ? 'Updating...' : 'Select'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex flex-col h-full">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Bus Operator</h3>
                <p className="text-gray-400 text-sm text-center mb-4">Manage your bus fleet and routes efficiently</p>
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => handleRoleSelect('operator')}
                  disabled={isLoading}
                  className={`w-full py-2.5 px-4 rounded-lg text-white font-medium transition duration-200
                    ${isLoading 
                      ? 'bg-orange-500/50 cursor-not-allowed' 
                      : 'bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30'
                    }`}
                >
                  {isLoading ? 'Updating...' : 'Select'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex flex-col h-full">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Delivery Partner</h3>
                <p className="text-gray-400 text-sm text-center mb-4">Deliver packages and earn competitive compensation for your services</p>
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => handleRoleSelect('partner')}
                  disabled={isLoading}
                  className={`w-full py-2.5 px-4 rounded-lg text-white font-medium transition duration-200
                    ${isLoading 
                      ? 'bg-purple-500/50 cursor-not-allowed' 
                      : 'bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/30'
                    }`}
                >
                  {isLoading ? 'Updating...' : 'Select'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-gray-400 text-sm">
            You can change your role later from your account settings
          </p>
        </div>
      </div>
    </div>
  );
}