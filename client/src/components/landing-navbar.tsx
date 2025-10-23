import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Menu, X, User } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();

  const handleLogin = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-600">MoneyPro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">
              Features
            </a>
            <a href="#plans" className="text-gray-700 hover:text-purple-600 transition-colors">
              Plans
            </a>
            <a href="#about" className="text-gray-700 hover:text-purple-600 transition-colors">
              About
            </a>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button and user avatar */}
          <div className="md:hidden flex items-center space-x-3">
            {isAuthenticated && user && (
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {(user as any)?.user_metadata?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                    <span className="text-xl font-bold text-purple-600">MoneyPro</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Navigation Links */}
                  <a 
                    href="#features" 
                    className="text-gray-700 hover:text-purple-600 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a 
                    href="#plans" 
                    className="text-gray-700 hover:text-purple-600 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Plans
                  </a>
                  <a 
                    href="#about" 
                    className="text-gray-700 hover:text-purple-600 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </a>
                  <div className="border-t pt-4 mt-4">
                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <User className="h-4 w-4" />
                          <span>{user?.primaryEmail || user?.email}</span>
                        </div>
                        <Link href="/dashboard">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Dashboard
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          className="w-full"
                          onClick={handleLogout}
                        >
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Link href="/login">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Login
                          </Button>
                        </Link>
                        <Link href="/login">
                          <Button 
                            className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Get Started
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}