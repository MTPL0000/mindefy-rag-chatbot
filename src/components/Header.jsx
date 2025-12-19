import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, FileText, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, fetchUserProfile, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Check if we're on the PDF management page
  const isOnPdfPage = pathname === '/admin/pdf';

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
    toast.success("Logout successful!");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-gray-200 shadow-sm" style={{background: 'linear-gradient(to right, #FFFFFF, #FFFFFF, #ebdad4)'}}>
      <div className="mx-auto px-2 sm:px-3 lg:px-8 2xl:max-w-[1400px]">
        <div className="flex justify-between h-16">
          <Link href="/chat" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Mindefy AI"
              width={48}
              height={48}
              className=""
            />
            <span className="ml-2 text-xl font-bold" style={{color: '#332771'}}>
              AskDocs
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user?.userType === "admin" && !isOnPdfPage && (
              <button
                onClick={() => router.push("/admin/pdf")}
                className="cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 border-gray-800 bg-transparent text-gray-800 hover:bg-gray-800 hover:text-white"
              >
                <span className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Manage PDF</span>
                </span>
              </button>
            )}
            {/* Profile icon - commented out for now */}
            {/* <div className="relative ml-3">
              <div
                onClick={() => router.push("/profile")}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <div className="h-11 w-11 rounded-full flex items-center justify-center text-white font-medium text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform group-hover:scale-110 border-2 border-white/30" 
                     style={{
                       background: 'linear-gradient(135deg, #332771 0%, #332771 100%)',
                       boxShadow: '0 2px 8px rgba(51, 39, 113, 0.2)'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.background = 'linear-gradient(135deg, #d93311 0%, #d93311 100%)';
                       e.currentTarget.style.boxShadow = '0 3px 12px rgba(217, 51, 17, 0.25)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.background = 'linear-gradient(135deg, #332771 0%, #332771 100%)';
                       e.currentTarget.style.boxShadow = '0 2px 8px rgba(51, 39, 113, 0.2)';
                     }}>
                  {getInitials(user?.name || user?.username)}
                </div>
              </div>
            </div> */}
            <button
              onClick={handleLogout}
              className="cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-sm shadow-sm"
            >
              <span className="flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset" style={{'--tw-ring-color': '#332771'}}
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/60 backdrop-blur-xl shadow-lg glass-morphism rounded-b-lg">
            <div
              onClick={() => router.push("/profile")}
              className="flex items-center space-x-2 px-3 py-2 cursor-pointer"
            >
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium" style={{backgroundColor: '#332771'}}>
                {getInitials(user?.name || user?.username)}
              </div>
            </div>
            {user?.userType == "admin" && !isOnPdfPage && (
              <button
                onClick={() => {
                  router.push("/admin/pdf");
                  setIsMenuOpen(false);
                }}
                className="cursor-pointer border-b flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 w-full text-left" style={{borderBottomColor: '#332771'}}
              >
                <FileText className="h-5 w-5" />
                <span>Manage PDF</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="cursor-pointer border-b flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 w-full text-left" style={{borderBottomColor: '#332771'}}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
