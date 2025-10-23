import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { 
  Menu, 
  X, 
  Home, 
  User, 
  CreditCard, 
  PieChart, 
  Settings, 
  LogOut,
  Shield,
  Users,
  TrendingUp,
  DollarSign,
  Activity
} from "lucide-react";

interface NavbarProps {
  isAdmin?: boolean;
}

export default function Navbar({ isAdmin = false }: NavbarProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { admin, isAuthenticated: isAdminAuthenticated, logout: adminLogout } = useAdminAuth();

  const userNavItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/investments", label: "Investments", icon: PieChart },
    { href: "/transactions", label: "Transactions", icon: CreditCard },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const adminNavItems = [
    { href: "/admin", label: "Dashboard", icon: Shield },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/investments", label: "Investments", icon: TrendingUp },
    { href: "/admin/transactions", label: "Transactions", icon: DollarSign },
    { href: "/admin/analytics", label: "Analytics", icon: Activity },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;
  const currentUser = isAdmin ? admin : user;
  const authenticated = isAdmin ? isAdminAuthenticated : isAuthenticated;

  const handleLogout = () => {
    if (isAdmin) {
      adminLogout();
    } else {
      window.location.href = "/api/logout";
    }
    setIsMobileMenuOpen(false);
  };

  const NavLink = ({ href, label, icon: Icon, mobile = false }: { 
    href: string; 
    label: string; 
    icon: any; 
    mobile?: boolean;
  }) => {
    const isActive = location === href;
    const baseClasses = mobile 
      ? "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
      : "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50";
    
    const activeClasses = isActive 
      ? "bg-gradient-to-r from-purple-500 to-orange-500 text-white"
      : "";

    const handleClick = () => {
      if (mobile) setIsMobileMenuOpen(false);
      window.location.href = href;
    };

    return (
      <div 
        className={`${baseClasses} ${activeClasses} cursor-pointer`}
        onClick={handleClick}
      >
        <Icon className="h-4 w-4" />
        {label}
      </div>
    );
  };

  if (!authenticated) {
    return (
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">MP</span>
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            MoneyPro
          </span>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50 bg-white dark:bg-gray-950 border-r">
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2 h-16 px-6 border-b">
            <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MP</span>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
              MoneyPro {isAdmin ? "Admin" : ""}
            </span>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>

          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {isAdmin ? admin?.username?.[0]?.toUpperCase() : user?.firstName?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {isAdmin ? admin?.username : `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {isAdmin ? "Administrator" : user?.email || ""}
                </p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              size="sm" 
              className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden z-50">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <div className="flex items-center gap-2 pb-4">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MP</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                MoneyPro {isAdmin ? "Admin" : ""}
              </span>
            </div>
            
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <NavLink key={item.href} {...item} mobile />
              ))}
            </nav>

            <div className="border-t pt-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {isAdmin ? admin?.username?.[0]?.toUpperCase() : user?.firstName?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {isAdmin ? admin?.username : `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {isAdmin ? "Administrator" : user?.email || ""}
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">MP</span>
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            MoneyPro {isAdmin ? "Admin" : ""}
          </span>
        </div>
      </header>
    </>
  );
}