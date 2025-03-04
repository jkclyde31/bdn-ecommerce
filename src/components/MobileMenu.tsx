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
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const wixClient = useWixClient();
  const router = useRouter();

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
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Authentication and user data fetching
  useEffect(() => {
    // Initial fetch
    fetchUserData();
    
    // Check if this is a redirect from OAuth login
    const checkOAuthRedirect = async () => {
      const oAuthData = localStorage.getItem("oAuthRedirectData");
      
      if (oAuthData && wixClient?.auth?.loggedIn) {
        try {
          setIsAuthenticating(true);
          const isLoggedIn = wixClient.auth.loggedIn();
          
          if (isLoggedIn) {
            // Clear the OAuth data
            localStorage.removeItem("oAuthRedirectData");
            // Fetch user data again
            await fetchUserData();
          }
        } catch (error) {
          console.error("Error checking login status:", error);
        } finally {
          setIsAuthenticating(false);
        }
      }
    };
    
    // Wait for wixClient to be ready before checking
    if (wixClient) {
      checkOAuthRedirect();
    }
  }, [wixClient]);

  const login = async () => {
    if (!wixClient.auth.loggedIn()) {
      setIsAuthenticating(true);
      const loginRequestData = wixClient.auth.generateOAuthData(
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      );
      localStorage.setItem("oAuthRedirectData", JSON.stringify(loginRequestData));
      const { authUrl } = await wixClient.auth.getAuthUrl(loginRequestData);
      window.location.href = authUrl;
    } else {
      setIsProfileOpen((prev) => !prev);
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

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
    </div>
  );

  return (
    <div className="px-4 relative h-full flex items-center justify-between md:hidden">
      <Link href="/">
        <div className="text-2xl tracking-wide">BDN</div>
      </Link>

      <div className="flex items-center gap-3">
        <div className="relative" ref={dropdownRef}>
          {isLoading || isAuthenticating ? (
            <LoadingSpinner />
          ) : (
            <Image
              src={profilePicture}
              alt="Profile"
              width={27}
              height={27}
              className={`cursor-pointer rounded-full transition-transform duration-200 ${
                isProfileOpen ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              } ${isAuthenticating ? 'opacity-50' : ''}`}
              onClick={login}
            />
          )}

          {isProfileOpen && (
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
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-lama rounded-full text-white text-sm flex items-center justify-center"></div>
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