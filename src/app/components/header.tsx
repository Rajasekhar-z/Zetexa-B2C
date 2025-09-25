// components/Header.tsx
'use client';

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, LogIn, LogOut, UserCircle, ChevronDown, Settings, CreditCard, Globe } from "lucide-react";

export default function Header({branding}: {branding: any}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // For accessibility: focus management for dropdown
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

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

  // Accessibility: close dropdown on Escape, focus trap
  useEffect(() => {
    if (!showProfileMenu) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowProfileMenu(false);
        profileButtonRef.current?.focus();
      }
      // Trap focus inside dropdown
      if (e.key === "Tab" && profileMenuRef.current) {
        const focusableEls = profileMenuRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showProfileMenu]);

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

  // Accessibility: ARIA labels and roles
  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white`} role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group" aria-label="Home">
            <img 
              className="h-8 w-auto transition-transform duration-200 group-hover:scale-105" 
              src={branding?.branding_logo} 
              alt="Zetexa Logo" 
              width={120} 
              height={40}
            />
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            <Link 
              href="/partner-with-us" 
              className="font-medium transition-all duration-200 hover:scale-105 text-black/90 hover:text-black"
              tabIndex={0}
              aria-label="Download App"
            >
              DOWNLOAD   APP
            </Link>
            <Link 
              href="/partner-with-us" 
              className="font-medium transition-all duration-200 hover:scale-105 text-black/90 hover:text-black"
              tabIndex={0}
              aria-label="Partner with Us"
            >
              PARTNER WITH US
            </Link>
            <Link 
              href="/about-us" 
              className="font-medium transition-all duration-200 hover:scale-105 text-black/90 hover:text-black"
              tabIndex={0}
              aria-label="About Us"
            >
              ABOUT US
            </Link>
            <Link 
              href="/topup" 
              className="font-medium transition-all duration-200 hover:scale-105 text-black/90 hover:text-black"
              tabIndex={0}
              aria-label="Top Up"
            >
              TOP UP
            </Link>
            <Link 
              href="/destinations" 
              className="font-medium transition-all duration-200 hover:scale-105 text-black/90 hover:text-black"
              tabIndex={0}
              aria-label="All Destinations"
            >
              ALL DESTINATIONS
            </Link>
          </nav>

          {/* Authentication Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  ref={profileButtonRef}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  aria-haspopup="menu"
                  aria-expanded={showProfileMenu}
                  aria-controls="profile-menu"
                  aria-label="Open user menu"
                  id="profile-menu-button"
                  tabIndex={0}
                  type="button"
                >
                  <div className="cursor-pointer w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm" aria-hidden="true">
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
                  <div
                    ref={profileMenuRef}
                    id="profile-menu"
                    className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2 duration-200"
                    role="menu"
                    aria-labelledby="profile-menu-button"
                    tabIndex={-1}
                  >
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-100" role="none">
                      <div className="flex items-center space-x-3">
                        {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {userInfo?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                          {userInfo?.last_name?.charAt(0)?.toUpperCase() || ''}
                        </div> */}
                        <div>
                          <p className="font-semibold text-gray-900" role="none">
                            {userInfo?.first_name} {userInfo?.last_name}
                          </p>
                          <p className="text-sm text-gray-500 text-ellipsis " role="none">{userInfo?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2" role="none">
                      <button
                        onClick={handleProfile}
                        className="cursor-pointer w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                        role="menuitem"
                        tabIndex={0}
                        aria-label="Profile"
                      >
                        <User className="h-5 w-5" aria-hidden="true" />
                        <span className="font-medium">Profile</span>
                      </button>
                      
                      <button
                        onClick={handleMyEsims}
                        className="cursor-pointer w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                        role="menuitem"
                        tabIndex={0}
                        aria-label="My eSIMs"
                      >
                        <Globe className="h-5 w-5" aria-hidden="true" />
                        <span className="font-medium">My eSIMs</span>
                      </button>
                      
                      <button
                        onClick={handleTopUp}
                        className="cursor-pointer w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                        role="menuitem"
                        tabIndex={0}
                        aria-label="Top Up"
                      >
                        <CreditCard className="h-5 w-5" aria-hidden="true" />
                        <span className="font-medium">Top Up</span>
                      </button>
                      
                      <button
                        onClick={handleDestinations}
                        className="cursor-pointer w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                        role="menuitem"
                        tabIndex={0}
                        aria-label="Destinations"
                      >
                        <Settings className="h-5 w-5" aria-hidden="true" />
                        <span className="font-medium">Destinations</span>
                      </button>
                    </div>

                    {/* Logout Section */}
                    <div className="border-t border-gray-100 pt-2" role="none">
                      <button
                        onClick={handleLogout}
                        className="cursor-pointer w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-150"
                        role="menuitem"
                        tabIndex={0}
                        aria-label="Logout"
                      >
                        <LogOut className="h-5 w-5" aria-hidden="true" />
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
                aria-label="Login"
                type="button"
              >
                <LogIn className="h-5 w-5" aria-hidden="true" />
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
          aria-label={showProfileMenu ? "Close menu" : "Open menu"}
          aria-controls="mobile-menu"
          aria-expanded={showProfileMenu}
          type="button"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {showProfileMenu && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white border-t border-gray-200 py-4 px-4"
          role="menu"
          aria-label="Mobile navigation"
        >
          <div className="space-y-3">
            <Link 
              href="/partner-with-us" 
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setShowProfileMenu(false)}
              tabIndex={0}
              role="menuitem"
              aria-label="Partner with Us"
            >
              Partner with Us
            </Link>
            <Link 
              href="/topup" 
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setShowProfileMenu(false)}
              tabIndex={0}
              role="menuitem"
              aria-label="Top Up"
            >
              Top Up
            </Link>
            <Link 
              href="/about-us" 
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setShowProfileMenu(false)}
              tabIndex={0}
              role="menuitem"
              aria-label="About Us"
            >
              About Us
            </Link>
            <Link 
              href="/destinations" 
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setShowProfileMenu(false)}
              tabIndex={0}
              role="menuitem"
              aria-label="Destinations"
            >
              Destinations
            </Link>
            
            {isAuthenticated && (
              <>
                <hr className="my-3" />
                <button
                  onClick={handleProfile}
                  className="cursor-pointer w-full flex items-center space-x-3 py-2 text-left text-gray-700 hover:text-blue-600"
                  role="menuitem"
                  tabIndex={0}
                  aria-label="Profile"
                  type="button"
                >
                  <User className="h-5 w-5" aria-hidden="true" />
                  <span className="font-medium">Profile</span>
                </button>
                <button
                  onClick={handleMyEsims}
                  className="cursor-pointer w-full flex items-center space-x-3 py-2 text-left text-gray-700 hover:text-blue-600"
                  role="menuitem"
                  tabIndex={0}
                  aria-label="My eSIMs"
                  type="button"
                >
                  <Globe className="h-5 w-5" aria-hidden="true" />
                  <span className="font-medium">My eSIMs</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer w-full flex items-center space-x-3 py-2 text-left text-red-600"
                  role="menuitem"
                  tabIndex={0}
                  aria-label="Logout"
                  type="button"
                >
                  <LogOut className="h-5 w-5" aria-hidden="true" />
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
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </header>
  );
}
