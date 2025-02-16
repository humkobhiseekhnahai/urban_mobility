import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import video from "../assets/video1.mp4";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      return setError('All fields are required');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          navigate('/login', { state: { error: 'Email already exists. Please login' } });
          return;
        }
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('authToken', data.token);
      navigate('/role-select');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Video section - hidden on mobile */}
        <div className="hidden lg:block lg:w-1/2 fixed left-0 h-screen">
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
    {/* Signup form section */}
    <div className="w-full lg:w-1/2 lg:ml-auto flex items-center justify-center p-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[95vw] md:max-w-md space-y-4 p-4 sm:p-6 md:p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
        
        {/* Mobile video banner (only on small screens) */}
        <div className="lg:hidden relative w-full h-[15vh] min-h-[100px] rounded-lg overflow-hidden mb-4">
          <video
            src={video}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center">
            Create Account
          </h2>
          <p className="text-gray-400 text-center text-xs sm:text-sm">
            Please fill in your details
          </p>
        </div>

        {error && (
          <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/50">
            <p className="text-red-400 text-xs sm:text-sm text-center">{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full px-3 py-2 text-xs sm:text-sm md:text-base rounded-lg bg-black/20 border border-gray-600 text-white placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400 transition duration-200"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-3 py-2 text-xs sm:text-sm md:text-base rounded-lg bg-black/20 border border-gray-600 text-white placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400 transition duration-200"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-3 py-2 text-xs sm:text-sm md:text-base rounded-lg bg-black/20 border border-gray-600 text-white placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400 transition duration-200"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="w-full px-3 py-2 text-xs sm:text-sm md:text-base rounded-lg bg-black/20 border border-gray-600 text-white placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400 transition duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium text-xs sm:text-sm md:text-base transition duration-200 ${
              isLoading
                ? 'bg-orange-500/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30'
            }`}
          >
            {isLoading ? 'Creating Account...' : 'Sign up'}
          </button>
        </form>

        <div className="mt-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 text-gray-400 text-xs sm:text-sm bg-transparent backdrop-blur-xl">
                Or continue with
              </span>
            </div>
          </div>
          <div className="flex justify-center items-center mt-3">
            <button
              onClick={handleGoogleSignup}
              className="p-2 rounded-full bg-white hover:bg-gray-100 transition duration-200"
              aria-label="Sign up with Google"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 48 48"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path
                  fill="#fbc02d"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8
                     c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                     C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20
                     C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#e53935"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12
                     c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                     C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4caf50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238
                     C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025
                     C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1565c0"
                  d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
                     c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238
                     C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
            </button>
          </div>
        </div>

        <p className="mt-3 text-center text-gray-400 text-xs sm:text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-400 hover:text-orange-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  </div>
</div>

  );
}
