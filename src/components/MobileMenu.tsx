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

  const dropdownRef = useRef<HTMLDivElement>(null);
  const authCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Fetch user data function with retry logic
  const fetchUserData = async (retryCount = 0, maxRetries = 3) => {
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
      } else if (retryCount < maxRetries) {
        // If no user data but we're within retry count, wait and try again
        console.log(`No user data found, retrying (${retryCount + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchUserData(retryCount + 1, maxRetries);
      }
      return false;
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (retryCount < maxRetries) {
        // If error but we're within retry count, wait and try again
        console.log(`Error fetching user data, retrying (${retryCount + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchUserData(retryCount + 1, maxRetries);
      }
      return false;
    } finally {
      if (retryCount === 0 || retryCount === maxRetries) {
        setIsLoading(false);
        setIsInitialLoadComplete(true);
      }
    }
  };

  // Check if we're returning from OAuth login
  const isReturningFromOAuth = () => {
    return Boolean(localStorage.getItem("oAuthRedirectData"));
  };

  // Authentication and user data fetching
  useEffect(() => {
    if (!wixClient) return;

    const init = async () => {
      // If returning from OAuth, attempt to process tokens and update login state
      if (isReturningFromOAuth()) {
        setIsAuthenticating(true);
        
        try {
          // Give a bit of time for Wix client to initialize
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Check if we need to process incoming tokens
          if (window.location.hash.includes('access_token') || 
              window.location.search.includes('code=')) {
            try {
              await wixClient.auth.processIncomingOAuthToken();
              console.log("Successfully processed OAuth tokens");
              
              // Clean URL without refreshing
              const cleanUrl = window.location.pathname;
              window.history.replaceState({}, document.title, cleanUrl);
            } catch (tokenError) {
              console.error("Error processing OAuth tokens:", tokenError);
            }
          }
          
          // Start polling for login state
          if (authCheckIntervalRef.current) {
            clearInterval(authCheckIntervalRef.current);
          }
          
          // Set interval to check login status repeatedly
          authCheckIntervalRef.current = setInterval(async () => {
            try {
              const isLoggedIn = await wixClient.auth.loggedIn();
              console.log("Login check:", isLoggedIn);
              
              if (isLoggedIn) {
                // Stop polling once logged in
                if (authCheckIntervalRef.current) {
                  clearInterval(authCheckIntervalRef.current);
                  authCheckIntervalRef.current = null;
                }
                
                // Clear OAuth data
                localStorage.removeItem("oAuthRedirectData");
                
                // Fetch user data with retry logic
                await fetchUserData();
                setIsAuthenticating(false);
              }
            } catch (checkError) {
              console.error("Error checking login status:", checkError);
            }
          }, 1000); // Check every second
          
          // Set timeout to stop polling after 10 seconds to prevent endless polling
          setTimeout(() => {
            if (authCheckIntervalRef.current) {
              clearInterval(authCheckIntervalRef.current);
              authCheckIntervalRef.current = null;
              setIsAuthenticating(false);
              console.log("Stopped polling for login status after timeout");
            }
          }, 10000);
        } catch (error) {
          console.error("Error during OAuth handling:", error);
          setIsAuthenticating(false);
        }
      } else {
        // Normal initialization - just fetch user data if logged in
        try {
          const isLoggedIn = await wixClient.auth.loggedIn();
          if (isLoggedIn) {
            await fetchUserData();
          }
        } catch (error) {
          console.error("Error during normal initialization:", error);
        } finally {
          setIsInitialLoadComplete(true);
          setIsLoading(false);
        }
      }
    };

    init();

    // Clean up interval on component unmount
    return () => {
      if (authCheckIntervalRef.current) {
        clearInterval(authCheckIntervalRef.current);
        authCheckIntervalRef.current = null;
      }
    };
  }, [wixClient]);

  const login = async () => {
    if (!wixClient || isAuthenticating) return;

    try {
      const isLoggedIn = await wixClient.auth.loggedIn();
      
      if (!isLoggedIn) {
        setIsAuthenticating(true);
        
        // Generate OAuth data with current URL as redirect
        const loginRequestData = wixClient.auth.generateOAuthData(
          window.location.origin + window.location.pathname
        );
        
        // Store OAuth data for detection after redirect
        localStorage.setItem("oAuthRedirectData", JSON.stringify(loginRequestData));
        
        // Get auth URL and redirect
        const { authUrl } = await wixClient.auth.getAuthUrl(loginRequestData);
        window.location.href = authUrl;
      } else {
        setIsProfileOpen(prev => !prev);
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      Cookies.remove("refreshToken");
      const { logoutUrl } = await wixClient.auth.logout(window.location.href);
      setIsProfileOpen(false);
      setUserData(null);
      setProfilePicture("/profile.png");
      router.push(logoutUrl);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Detailed Loading Animation Component
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
    if (!userData) {
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