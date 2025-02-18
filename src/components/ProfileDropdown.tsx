import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { User, UserCircle, LogOut } from 'lucide-react';

interface UserProfile {
  nickname?: string;
  name?: string;
}

interface Member {
  profile?: UserProfile;
}

interface UserData {
  member?: Member;
}

interface ProfileDropdownProps {
  isProfileOpen: boolean;
  userData?: UserData | null;
  handleLogout: () => void;
  isLoading: boolean;
  onClose: () => void;  // New prop for handling close
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ 
  isProfileOpen, 
  userData, 
  handleLogout, 
  isLoading,
  onClose 
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Only add the event listener if the dropdown is open
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen, onClose]);

  if (!isProfileOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute min-w-[200px] p-4 rounded-lg top-12 -right-9 md:left-0 bg-white shadow-lg z-20 border border-gray-100"
    >
      <div className="space-y-3">
        {/* User Info */}
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <User className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {userData ? (
              userData.member?.profile?.nickname || 
              userData.member?.profile?.name || 
              'User'
            ) : (
              'Guest'
            )}
          </span>
        </div>

        {/* Profile Link */}
        <Link 
          href="/profile" 
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 p-2 rounded-md transition-colors"
        >
          <UserCircle className="w-5 h-5" />
          <span>Profile</span>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 p-2 rounded-md transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>{isLoading ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;