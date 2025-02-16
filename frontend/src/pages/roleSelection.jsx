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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 text-center">Select Your Role</h2>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelect('user')}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Updating...' : 'Continue as User'}
          </button>
          <button
            onClick={() => handleRoleSelect('operator')}
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Updating...' : 'Continue as Bus Operator'}
          </button>
          <button
            onClick={() => handleRoleSelect('partner')}
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Updating...' : 'Continue as Delivery Partner'}
          </button>
        </div>
      </div>
    </div>
  );
}
