// components/Header.tsx
'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, LogIn, LogOut, UserCircle, ChevronDown, Settings, CreditCard, Globe } from "lucide-react";

export default function Header({branding}: {branding: any}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Check authentication status on component mount
    const token = localStorage.getItem('customerToken');
    const userInfoStr = localStorage.getItem('customerInfo');
    
    if (token && userInfoStr) {
      setIsAuthenticated(true);
      try {
        setUserInfo(JSON.parse(userInfoStr));
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }

    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerInfo');
    sessionStorage.removeItem('redirectToMyEsim');
    
    // Update state
    setIsAuthenticated(false);
    setUserInfo(null);
    setShowProfileMenu(false);
    
    // Redirect to home page
    router.push('/');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleProfile = () => {
    router.push('/user-dashboard/profile');
    setShowProfileMenu(false);
  };

  const handleMyEsims = () => {
    router.push('/user-dashboard/my-esim');
    setShowProfileMenu(false);
  };

  const handleTopUp = () => {
    router.push('/topup');
    setShowProfileMenu(false);
  };

  const handleDestinations = () => {
    router.push('/destinations');
    setShowProfileMenu(false);
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
       bg-gradient-to-r from-blue-600 to-indigo-700
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <img 
              className="h-8 w-auto transition-transform duration-200 group-hover:scale-105" 
              src={branding?.dark_mode_logo} 
              alt="Zetexa Logo" 
              width={120} 
              height={40}
            />
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/partner-with-us" 
              className={`font-medium transition-all duration-200 hover:scale-105 
                   text-white/90 hover:text-white`}
            >
              Partner with Us
            </Link>
            <Link 
              href="/topup" 
              className={`font-medium transition-all duration-200 hover:scale-105
                 text-white/90 hover:text-white`}
            >
              Top Up
            </Link>
            <Link 
              href="/about-us" 
              className={`font-medium transition-all duration-200 hover:scale-105
                
                   text-white/90 hover:text-white
              `}
            >
              About Us
            </Link>
            <Link 
              href="/destinations" 
              className={`font-medium transition-all duration-200 hover:scale-105
               text-white/90 hover:text-white
              `}
            >
              Destinations
            </Link>
          </nav>

          {/* Authentication Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  // className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  //   isScrolled
                  //     ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  //     : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
                  // }`}
                >
                  <div className="cursor-pointer w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {userInfo?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                    {userInfo?.last_name?.charAt(0)?.toUpperCase() || ''}
                  </div>
                  {/* <span className="hidden sm:block font-medium">
                    {userInfo?.first_name || 'User'}
                  </span> */}
                  {/* <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                    showProfileMenu ? 'rotate-180' : ''
                  }`} /> */}
                </button>
                
                {/* Enhanced Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {userInfo?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                          {userInfo?.last_name?.charAt(0)?.toUpperCase() || ''}
                        </div> */}
                        <div>
                          <p className="font-semibold text-gray-900">
                            {userInfo?.first_name} {userInfo?.last_name}
                          </p>
                          <p className="text-sm text-gray-500 text-ellipsis ">{userInfo?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={handleProfile}
                        className="cursor-pointer w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                      >
                        <User className="h-5 w-5" />
                        <span className="font-medium">Profile</span>
                      </button>
                      
                      <button
                        onClick={handleMyEsims}
                        className="cursor-pointer w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                      >
                        <Globe className="h-5 w-5" />
                        <span className="font-medium">My eSIMs</span>
                      </button>
                      
                      <button
                        onClick={handleTopUp}
                        className="cursor-pointer w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                      >
                        <CreditCard className="h-5 w-5" />
                        <span className="font-medium">Top Up</span>
                      </button>
                      
                      <button
                        onClick={handleDestinations}
                        className="cursor-pointer w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                      >
                        <Settings className="h-5 w-5" />
                        <span className="font-medium">Destinations</span>
                      </button>
                    </div>

                    {/* Logout Section */}
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="cursor-pointer w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-150"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className={`cursor-pointer flex items-center space-x-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                  isScrolled
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-white text-blue-600 hover:bg-gray-50 shadow-lg hover:shadow-xl'
                }`}
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Button */}
      <div className="md:hidden absolute right-4 top-4">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className={`cursor-pointer p-2 rounded-lg transition-all duration-200 ${
            isScrolled
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {showProfileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4 px-4">
          <div className="space-y-3">
            <Link 
              href="/partner-with-us" 
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setShowProfileMenu(false)}
            >
              Partner with Us
            </Link>
            <Link 
              href="/topup" 
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setShowProfileMenu(false)}
            >
              Top Up
            </Link>
            <Link 
              href="/about-us" 
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setShowProfileMenu(false)}
            >
              About Us
            </Link>
            <Link 
              href="/destinations" 
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setShowProfileMenu(false)}
            >
              Destinations
            </Link>
            
            {isAuthenticated && (
              <>
                <hr className="my-3" />
                <button
                  onClick={handleProfile}
                  className="cursor-pointer w-full flex items-center space-x-3 py-2 text-left text-gray-700 hover:text-blue-600"
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Profile</span>
                </button>
                <button
                  onClick={handleMyEsims}
                  className="cursor-pointer w-full flex items-center space-x-3 py-2 text-left text-gray-700 hover:text-blue-600"
                >
                  <Globe className="h-5 w-5" />
                  <span className="font-medium">My eSIMs</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer w-full flex items-center space-x-3 py-2 text-left text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Overlay to close dropdown when clicking outside */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </header>
  );
}
