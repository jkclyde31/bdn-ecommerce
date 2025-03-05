"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CartModal from "./CartModal";
import { useWixClient } from "../../hooks/useWixClient";
import Cookies from "js-cookie";
import { useCartStore } from "../../hooks/useCartStore";
import { Toast } from "./Toast";
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

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profilePicture, setProfilePicture] = useState("/profile.png");
  const [showToast, setShowToast] = useState(false);

  const router = useRouter();
  const wixClient = useWixClient();
  const { cart, counter, getCart } = useCartStore();

  // Consolidated user data fetching
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
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
      setIsInitialLoadComplete(true);
    }
  };

  // Fetch user and cart data on mount
  useEffect(() => {
    fetchUserData();
    getCart(wixClient);
  }, [wixClient, getCart]);

  // Consolidated OAuth handling
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const oAuthRedirectData = localStorage.getItem("oAuthRedirectData");

      if (oAuthRedirectData) {
        setIsAuthenticating(true);
        const parsedOAuthData = JSON.parse(oAuthRedirectData);
        const returnedOAuthData = wixClient.auth.parseFromUrl();

        if (returnedOAuthData.error) {
          console.error(`OAuth Error: ${returnedOAuthData.errorDescription}`);
          setIsAuthenticating(false);
          return;
        }

        try {
          const memberTokens = await wixClient.auth.getMemberTokens(
            returnedOAuthData.code,
            returnedOAuthData.state,
            parsedOAuthData
          );

          wixClient.updateTokens({
            refreshToken: memberTokens.refreshToken,
            accessToken: memberTokens.accessToken,
          });

          // Remove redirect data after successful authentication
          localStorage.removeItem("oAuthRedirectData");

          // Refetch user data to ensure the latest information
          await fetchUserData();
        } catch (error) {
          console.error("Authentication failed:", error);
        } finally {
          setIsAuthenticating(false);
        }
      }
    };

    handleOAuthCallback();
  }, [wixClient]);

  const login = async () => {
    if (!wixClient.auth.loggedIn()) {
      setIsAuthenticating(true);
      const loginRequestData = wixClient.auth.generateOAuthData(
        process.env.NEXT_PUBLIC_APP_URL 
      );
      localStorage.setItem("oAuthRedirectData", JSON.stringify(loginRequestData));
      const { authUrl } = await wixClient.auth.getAuthUrl(loginRequestData);
      window.location.href = authUrl;
    } else {
      setIsProfileOpen((prev) => !prev);
    }
  };
  
  // Modify the OAuth callback effect to explicitly refresh cart
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const oAuthRedirectData = localStorage.getItem("oAuthRedirectData");
  
      if (oAuthRedirectData) {
        setIsAuthenticating(true);
        const parsedOAuthData = JSON.parse(oAuthRedirectData);
        const returnedOAuthData = wixClient.auth.parseFromUrl();
  
        if (returnedOAuthData.error) {
          console.error(`OAuth Error: ${returnedOAuthData.errorDescription}`);
          setIsAuthenticating(false);
          return;
        }
  
        try {
          const memberTokens = await wixClient.auth.getMemberTokens(
            returnedOAuthData.code,
            returnedOAuthData.state,
            parsedOAuthData
          );
  
          wixClient.updateTokens({
            refreshToken: memberTokens.refreshToken,
            accessToken: memberTokens.accessToken,
          });
  
          // Remove redirect data after successful authentication
          localStorage.removeItem("oAuthRedirectData");
  
          // Refetch user data and explicitly refresh cart
          await Promise.all([
            fetchUserData(),
            getCart(wixClient)  // Explicitly refresh cart here
          ]);
        } catch (error) {
          console.error("Authentication failed:", error);
        } finally {
          setIsAuthenticating(false);
        }
      }
    };
  
    handleOAuthCallback();
  }, [wixClient, getCart]);  // Add getCart to dependencies

  const handleLogout = async () => {
    setIsLoading(true);
    Cookies.remove("refreshToken");
    const { logoutUrl } = await wixClient.auth.logout(window.location.href);
    setIsLoading(false);
    setIsProfileOpen(false);
    setUserData(null);
    setProfilePicture("/profile.png");
    router.push(logoutUrl);
  };

  // Detailed Loading Animation Component
  const LoadingAnimation = () => (
    <div className="flex items-center justify-center space-x-2 animate-pulse">
      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
      <div className="w-3 h-3 bg-gray-300 rounded-full animation-delay-200"></div>
      <div className="w-3 h-3 bg-gray-300 rounded-full animation-delay-400"></div>
    </div>
  );

  // Placeholder Shimmer Loading State
  const LoadingPlaceholder = () => (
    <div className="flex items-center gap-3 relative">
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      <div className="flex flex-col space-y-2">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );

  // Get user's display name
  const getUserDisplayName = () => {
    const profile = userData?.member?.profile;
    return profile?.nickname || profile?.name || "User";
  };

  // Determine what to render based on loading state and user data
  const renderAuthComponent = () => {
    // Show loading placeholder during initial load
    if (!isInitialLoadComplete) {
      return <LoadingPlaceholder />;
    }

    // Show login button if no user data
    if (!userData) {
      return (
        <button 
          onClick={login} 
          disabled={isAuthenticating}
          className={`px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors duration-300 ease-in-out flex items-center gap-2 shadow-md ${isAuthenticating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isAuthenticating ? (
            <LoadingAnimation />
          ) : (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="feather feather-user"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Login / Signup
            </>
          )}
        </button>
      );
    }

    // Show user profile when data is available
    return (
      <div className="flex items-center gap-3">
        <div className="relative flex items-center gap-2" onClick={() => setIsProfileOpen((prev) => !prev)}>
          {isLoading ? (
            <LoadingAnimation />
          ) : (
            <Image
              src={profilePicture}
              alt="Profile"
              width={26}
              height={26}
              className="cursor-pointer rounded-full"
            />
          )}
          <span className="text-sm font-medium cursor-pointer">
            {getUserDisplayName()}
          </span>
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
      </div>
    );
  };

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      {/* Login/Signup or Profile Icon */}
      {renderAuthComponent()}

      {/* Cart Icon */}
      <div
        className="relative cursor-pointer"
        onClick={() => setIsCartOpen((prev) => !prev)}
      >
        <Image src="/cart.png" alt="Cart" width={22} height={22} />
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-primary rounded-full text-white text-sm flex items-center justify-center">
          {counter}
        </div>
      </div>

      {/* Cart Modal */}
      {isCartOpen && <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />}

      {/* Welcome Toast */}
      {showToast && userData && (
        <Toast 
          message={`Welcome back${userData.member?.profile?.nickname ? `, ${userData.member.profile.nickname}` : ''}!`}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default NavIcons;