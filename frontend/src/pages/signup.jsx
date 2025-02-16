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
        {/* Video section - hidden on mobile, visible on lg screens */}
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
        <div className="w-full lg:w-1/2 lg:ml-auto flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-4 p-6 sm:p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
            {/* Mobile video banner */}
            <div className="lg:hidden relative w-full h-32 rounded-lg overflow-hidden">
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

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-white text-center">Create Account</h2>
              <p className="text-gray-400 text-center text-sm sm:text-base">Please fill in your details</p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50">
                <p className="text-red-400 text-sm sm:text-base text-center">{error}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="block text-sm sm:text-base font-medium text-gray-300">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-black/20 border border-gray-600 text-white placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400 focus:ring-opacity-50 transition duration-200 text-base"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm sm:text-base font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-black/20 border border-gray-600 text-white placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400 focus:ring-opacity-50 transition duration-200 text-base"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm sm:text-base font-medium text-gray-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-black/20 border border-gray-600 text-white placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400 focus:ring-opacity-50 transition duration-200 text-base"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm sm:text-base font-medium text-gray-300">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-black/20 border border-gray-600 text-white placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400 focus:ring-opacity-50 transition duration-200 text-base"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 px-4 rounded-lg text-white font-semibold text-base sm:text-lg transition duration-200 ${
                  isLoading
                    ? 'bg-orange-500/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30'
                }`}
              >
                {isLoading ? 'Creating Account...' : 'Sign up'}
              </button>
            </form>

            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm sm:text-base">
                  <span className="px-2 text-gray-400 bg-transparent backdrop-blur-xl">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignup}
                className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-600 rounded-lg bg-black/20 hover:bg-black/30 transition duration-200 text-lg"
              >
                {/* <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="25" viewBox="0 0 48 48">
<path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
</svg> */}
                <span className="font-sans text-xl text-center flex items-center justify-center">
                  <span className="text-blue-500">G</span>
                  <span className="text-red-500">o</span>
                  <span className="text-yellow-500">o</span>
                  <span className="text-blue-500">g</span>
                  <span className="text-green-500">l</span>
                  <span className="text-red-500">e</span>
                </span>
              </button>
            </div>

            <p className="mt-4 text-center text-gray-400 text-sm sm:text-base">
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