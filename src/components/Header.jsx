import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, FileText, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";
import { toast } from "react-hot-toast";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, fetchUserProfile, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if we're on the PDF management page
  const isOnPdfPage = pathname === "/admin/pdf";

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
    <header
      className="sticky top-0 z-50 backdrop-blur-xl border-b border-gray-200 shadow-sm"
      style={{
        background: "linear-gradient(to right, #FFFFFF, #FFFFFF, #ebdad4)",
      }}
    >
      <div className="max-w-7xl mx-auto px-2 py-1 sm:px-3 lg:px-8">
        <div className="flex justify-between h-12 sm:h-14">
          <Link href="/chat" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Mindefy AI"
              width={36}
              height={36}
              className="w-9 h-9 sm:w-12 sm:h-12"
            />
            <span className="ml-2 sm:ml-3 text-base sm:text-xl text-[#332771] font-bold">
              AskDocs
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user?.userType === "admin" && !isOnPdfPage && (
              <button
                onClick={() => router.push("/admin/pdf")}
                className="cursor-pointer px-4 py-2.5 rounded-xl text-sm font-medium bg-[#332771] text-white transition-all duration-300 shadow-lg hover:bg-[#dc2626] hover:text-white hover:shadow-xl transform hover:scale-105 backdrop-blur-sm border border-white/20"
              >
                <span className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Manage KB</span>
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
              className="cursor-pointer px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 text-[#dc2626] shadow-sm hover:bg-[#dc2626] hover:text-white hover:shadow-lg transform hover:scale-105 backdrop-blur-sm border border-red-200/50"
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
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset"
              style={{ "--tw-ring-color": "#332771" }}
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
            {/*<div
              onClick={() => router.push("/profile")}
              className="flex items-center space-x-2 px-3 py-2 cursor-pointer"
            >
              <div className="h-10 w-10 bg-[#332771] rounded-full flex items-center justify-center text-white font-medium">
                {getInitials(user?.name || user?.username)}
              </div>
            </div> */}
            {user?.userType == "admin" && (
              <button
                onClick={() => {
                  router.push("/admin/pdf");
                  setIsMenuOpen(false);
                }}
                className="cursor-pointer border-b border-[#332771] flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <FileText className="h-5 w-5" />
                <span>Manage KB</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="cursor-pointer border-b border-[#332771] flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 w-full text-left"
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
