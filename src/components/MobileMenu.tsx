'use client'

import Link from "next/link";
import Menu from "./Menu";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useWixClient } from "../../hooks/useWixClient";
import CartModal from "./CartModal";
import ProfileDropdown from "./ProfileDropdown";
import { useCartStore } from "../../hooks/useCartStore";

interface MemberProfile {
  nickname?: string;
  name?: string;
  photo?: {
    url?: string;
  };
}

interface UserData {
  member?: {
    profile?: MemberProfile;
  };
}

const MobileMenu = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profilePicture, setProfilePicture] = useState("/profile.png");
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const wixClient = useWixClient();
  const router = useRouter();
  const { counter } = useCartStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check login status
  const checkLoginStatus = async () => {
    if (!wixClient) return false;
    
    try {
      const loggedIn = await wixClient.auth.loggedIn();
      setIsLoggedIn(loggedIn);
      return loggedIn;
    } catch (error) {
      console.error("Error checking login status:", error);
      return false;
    }
  };

  // Fetch user data function
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (data?.user) {
        setUserData(data.user);
        if (data.user?.member?.profile?.photo?.url) {
          setProfilePicture(data.user.member.profile.photo.url);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return false;
    } finally {
      setIsLoading(false);
      setIsInitialLoadComplete(true);
    }
  };

  // Process OAuth redirect tokens
  const processOAuthTokens = async () => {
    if (!wixClient) return false;
    
    try {
      // Check if URL contains authentication tokens
      if (window.location.hash.includes('access_token') || 
          window.location.search.includes('code=')) {
        await wixClient.auth.processIncomingOAuthToken();
        
        // Clear the URL without refreshing the page
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error processing OAuth tokens:", error);
      return false;
    }
  };

  // Handle OAuth redirect
  const handleOAuthRedirect = async () => {
    const oAuthData = localStorage.getItem("oAuthRedirectData");
    
    if (!oAuthData) return;
    
    try {
      setIsAuthenticating(true);
      
      // Process any tokens in the URL
      const tokensProcessed = await processOAuthTokens();
      
      // Check login status after processing tokens
      const isUserLoggedIn = await checkLoginStatus();
      
      if (isUserLoggedIn) {
        // Clear the OAuth data
        localStorage.removeItem("oAuthRedirectData");
        
        // Fetch user data
        await fetchUserData();
      }
    } catch (error) {
      console.error("Error handling OAuth redirect:", error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Authentication and user data initialization
  useEffect(() => {
    if (!wixClient) return;
    
    const initAuth = async () => {
      setIsLoading(true);
      
      try {
        // First process any tokens in URL if this is a redirect
        await processOAuthTokens();
        
        // Then check login status
        const loggedIn = await checkLoginStatus();
        
        // If logged in, fetch user data
        if (loggedIn) {
          await fetchUserData();
        }
        
        // Handle OAuth redirect data if present
        await handleOAuthRedirect();
      } catch (error) {
        console.error("Authentication initialization error:", error);
      } finally {
        setIsLoading(false);
        setIsInitialLoadComplete(true);
      }
    };
    
    initAuth();
    
    // Add listener for OAuth state changes via local storage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "oAuthComplete" && event.newValue === "true") {
        // Remove the flag
        localStorage.removeItem("oAuthComplete");
        
        // Reinitialize auth
        initAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [wixClient]);

  const login = async () => {
    if (!wixClient) return;
    
    try {
      const isUserLoggedIn = await checkLoginStatus();
      
      if (!isUserLoggedIn) {
        setIsAuthenticating(true);
        
        // Use the exact redirect URI that's configured in your OAuth app settings
        const redirectUrl = process.env.NEXT_PUBLIC_APP_URL;
        
        const loginRequestData = wixClient.auth.generateOAuthData(redirectUrl);
        localStorage.setItem("oAuthRedirectData", JSON.stringify(loginRequestData));
        
        const { authUrl } = await wixClient.auth.getAuthUrl(loginRequestData);
        window.location.href = authUrl;
      } else {
        setIsProfileOpen((prev) => !prev);
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    if (!wixClient) return;
    
    try {
      setIsLoading(true);
      Cookies.remove("refreshToken");
      const { logoutUrl } = await wixClient.auth.logout(window.location.href);
      
      // Reset state
      setIsProfileOpen(false);
      setUserData(null);
      setProfilePicture("/profile.png");
      setIsLoggedIn(false);
      
      // Navigate to logout URL
      router.push(logoutUrl);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading Animation Component
  const LoadingAnimation = () => (
    <div className="flex items-center justify-center space-x-1 animate-pulse">
      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
      <div className="w-2 h-2 bg-gray-300 rounded-full animation-delay-200"></div>
      <div className="w-2 h-2 bg-gray-300 rounded-full animation-delay-400"></div>
    </div>
  );

  // Placeholder Shimmer Loading State
  const LoadingPlaceholder = () => (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse"></div>
      <div className="flex flex-col space-y-1">
        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );

  // Render profile component based on loading and authentication state
  const renderProfileComponent = () => {
    // Show loading placeholder during initial load
    if (!isInitialLoadComplete) {
      return <LoadingPlaceholder />;
    }

    // Show profile image or login prompt
    if (!isLoggedIn || !userData) {
      return (
        <Image
          src={profilePicture}
          alt="Profile"
          width={27}
          height={27}
          className={`cursor-pointer rounded-full transition-transform duration-200 ${
            isAuthenticating ? 'opacity-50' : ''
          }`}
          onClick={login}
        />
      );
    }

    // Logged-in user state
    return (
      <Image
        src={profilePicture}
        alt="Profile"
        width={27}
        height={27}
        className={`cursor-pointer rounded-full transition-transform duration-200 ${
          isProfileOpen ? 'ring-2 ring-blue-500 ring-offset-2' : ''
        } ${isAuthenticating ? 'opacity-50' : ''}`}
        onClick={() => setIsProfileOpen((prev) => !prev)}
      />
    );
  };

  return (
    <div className="px-4 relative h-full flex items-center justify-between md:hidden">
      <Link href="/">
        <div className="text-2xl tracking-wide">BDN</div>
      </Link>

      <div className="flex items-center gap-3">
        <div className="relative" ref={dropdownRef}>
          {(isLoading || isAuthenticating) ? (
            <LoadingAnimation />
          ) : (
            renderProfileComponent()
          )}

          {isProfileOpen && userData && (
            <ProfileDropdown
              isProfileOpen={isProfileOpen}
              userData={userData}
              handleLogout={handleLogout}
              isLoading={isLoading}
              onClose={() => setIsProfileOpen(false)}
            />
          )}
        </div>

        <div
          className="relative cursor-pointer"
          onClick={() => setIsCartOpen((prev) => !prev)}
        >
          <Image src="/cart.png" alt="Cart" width={22} height={22} />
          {counter > 0 && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-lama rounded-full text-white text-xs flex items-center justify-center">
              {counter}
            </div>
          )}
        </div>

        {/* Cart Modal */}
        {isCartOpen && <CartModal 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
        />}

        <Menu />
      </div>
    </div>
  );
};

export default MobileMenu;