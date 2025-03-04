import Link from "next/link";
import { 
  LogOut, 
  User, 
  ShoppingBag, 
  Heart, 
  Settings, 
  HelpCircle 
} from "lucide-react";

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

interface ProfileDropdownProps {
  isProfileOpen: boolean;
  userData: UserData | null;
  handleLogout: () => Promise<void>;
  isLoading: boolean;
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isProfileOpen,
  userData,
  handleLogout,
  isLoading,
  onClose
}) => {
  const menuItems = [
    { 
      icon: <User className="mr-2 h-4 w-4" />, 
      label: "Profile", 
      href: "/profile",
      disabled: false
    },
    { 
      icon: <ShoppingBag className="mr-2 h-4 w-4" />, 
      label: "My Orders", 
      href: "/orders",
      disabled: false
    },
    { 
      icon: <Heart className="mr-2 h-4 w-4" />, 
      label: "Wishlist", 
      href: "/wishlist",
      disabled: false
    },
    { 
      icon: <Settings className="mr-2 h-4 w-4" />, 
      label: "Settings", 
      href: "/settings",
      disabled: false
    },
    { 
      icon: <HelpCircle className="mr-2 h-4 w-4" />, 
      label: "Help", 
      href: "/help",
      disabled: false
    }
  ];

  return (
    <div 
      className="absolute right-0 top-full mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-100 z-50 overflow-hidden animate-dropdown-slide-down origin-top-right"
      onClick={(e) => e.stopPropagation()}
    >
      {/* User Header */}
      <div className="flex items-center p-4 border-b border-gray-100 bg-gray-50">
        <img 
          src={userData?.member?.profile?.photo?.url || "/profile.png"}
          alt="Profile"
          className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-primary/20 shadow-sm"
        />
        <div>
          <p className="font-bold text-lg text-gray-800 leading-tight">
            {userData?.member?.profile?.nickname || "User"}
          </p>
          <p className="text-sm text-gray-500 truncate max-w-[180px]">
            {userData?.member?.profile?.name || "Welcome back"}
          </p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        {menuItems.map((item, index) => (
          <Link 
            key={index} 
            href={item.href}
            className={`
              flex items-center px-4 py-2.5 text-sm text-gray-700 
              hover:bg-gray-100 transition-colors duration-200 
              ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/5'}
            `}
            onClick={item.disabled ? (e) => e.preventDefault() : onClose}
          >
            {item.icon}
            <span className="flex-grow">{item.label}</span>
            {item.disabled && (
              <span className="text-xs text-gray-400 ml-2">Coming Soon</span>
            )}
          </Link>
        ))}
      </div>

      {/* Logout Button */}
      <div className="border-t border-gray-100">
        <button 
          onClick={handleLogout}
          disabled={isLoading}
          className="
            w-full flex items-center justify-center 
            px-4 py-3 text-sm 
            text-red-600 hover:bg-red-50 
            transition-colors duration-200 
            disabled:opacity-50 
            group
          "
        >
          {isLoading ? (
            <div className="animate-spin h-4 w-4 border-b-2 border-red-600 rounded-full"></div>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
              Sign Out
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;