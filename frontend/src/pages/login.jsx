import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import video from "../assets/video1.mp4";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(location.state?.error || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('authToken', data.token);

      const roleCheck = await fetch('http://localhost:3000/auth/check-role', {
        headers: { Authorization: `Bearer ${data.token}` }
      });

      if (roleCheck.ok) {
        const { roleSelected } = await roleCheck.json();
        navigate(roleSelected ? '/dashboard' : '/role-select');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      localStorage.setItem('authToken', token);
      navigate('/role-select');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Video section - hidden on mobile, visible on lg screens */}
        <div className="hidden lg:block lg:w-1/2 relative h-screen">
          <video
            src={video}
            className="w-full h-full object-cover absolute inset-0"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        </div>

        {/* Login form section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen lg:min-h-0">
          <div className="w-full max-w-md space-y-6 p-6 sm:p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
            {/* Mobile video banner */}
            <div className="lg:hidden relative w-full h-40 sm:h-48 rounded-lg overflow-hidden mb-6">
              <video
                src={video}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            </div>

            <div className="mb-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-2">Welcome Back</h2>
              <p className="text-gray-400 text-center text-sm sm:text-base">Please enter your details</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50">
                <p className="text-red-400 text-sm sm:text-base text-center">{error}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-black/20 border border-gray-600 text-white placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400 focus:ring-opacity-50 transition duration-200 text-base"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm sm:text-base font-medium text-gray-300">Password</label>
                  <Link to="/forgot-password" className="text-sm sm:text-base text-orange-400 hover:text-orange-300">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-black/20 border border-gray-600 text-white placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400 focus:ring-opacity-50 transition duration-200 text-base"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold text-base sm:text-lg transition duration-200 ${
                  isLoading
                    ? 'bg-orange-500/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30'
                }`}
              >
                {isLoading ? 'Logging In...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm sm:text-base">
                  <span className="px-2 text-gray-400 bg-transparent backdrop-blur-xl">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-600 rounded-lg bg-black/20 hover:bg-black/30 transition duration-200 text-lg"
              >
                <img src="/google-icon.svg" alt="Google" className="w-6 h-6" />
                <span className="font-sans">
                  <span className="text-blue-500">G</span>
                  <span className="text-red-500">o</span>
                  <span className="text-yellow-500">o</span>
                  <span className="text-blue-500">g</span>
                  <span className="text-green-500">l</span>
                  <span className="text-red-500">e</span>
                </span>
              </button>
            </div>

            <p className="mt-8 text-center text-gray-400 text-sm sm:text-base">
              Don't have an account?{' '}
              <Link to="/signup" className="text-orange-400 hover:text-orange-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}