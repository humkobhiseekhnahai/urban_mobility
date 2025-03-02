import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center space-y-4 max-w-sm w-full">
        {/* Error Code and Message */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">403 Unauthorized</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            You don't have permission to access this page.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="space-y-2 pt-2">
          <Link 
            to="/dashboard" 
            className="block text-blue-600 hover:text-blue-800 text-sm sm:text-base"
          >
            ← Return to Dashboard
          </Link>
          <Link 
            to="/login" 
            className="block text-blue-600 hover:text-blue-800 text-sm sm:text-base"
          >
            Sign in with a different account
          </Link>
        </div>
      </div>
    </div>
  );
}