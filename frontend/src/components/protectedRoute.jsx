import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkAuth } from '../middlewares/auth';

export default function ProtectedRoute({ role, children }) {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        // Check for token in URL query params (for Google auth callback)
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (token) {
          // Save token from URL to localStorage
          localStorage.setItem('authToken', token);
          // Remove token from URL by redirecting to the same page without query params
          navigate(location.pathname, { replace: true });
        }
        
        const auth = await checkAuth();
        
        if (!auth.valid) {
          // Redirect to login if not authenticated
          navigate('/login', { replace: true });
          return;
        }

        if (role && auth.role !== role) {
          // Redirect to unauthorized if role doesn't match
          navigate('/unauthorized', { replace: true });
          return;
        }
        
        // User is authenticated and has correct role
        setIsLoading(false);
      } catch (error) {
        console.error("Auth verification failed:", error);
        navigate('/login', { replace: true });
      }
    };

    verifyAccess();
  }, [navigate, role, location]);

  // Show loading state while checking
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 mt-4">Verifying access...</p>
        </div>
      </div>
    );    
  }

  // Only reached if authentication and role check passed
  return children;
}