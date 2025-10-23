import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Home, 
  PieChart, 
  Users, 
  CreditCard, 
  History, 
  Calculator,
  Settings,
  LogOut,
  Menu,
  TrendingUp,
  Wallet,
  BarChart3,
  Gift,
  User,
  HelpCircle
} from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Home', href: '/dashboard/home', icon: BarChart3 },
  { name: 'Investments', href: '/dashboard/investments', icon: PieChart },
  { name: 'Referrals', href: '/dashboard/referrals', icon: Users },
  { name: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
  { name: 'Tools', href: '/dashboard/tools', icon: Calculator },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Support', href: '/dashboard/support', icon: HelpCircle },
];

function NavigationItems({ onItemClick }: { onItemClick?: () => void }) {
  const [location] = useLocation();
  const { user, signOut } = useSupabaseAuth();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b">
        <TrendingUp className="h-8 w-8 text-purple-600 mr-2" />
        <span className="text-xl font-bold text-gray-900">MoneyPro</span>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b bg-gradient-to-r from-purple-50 to-orange-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {(user as any)?.firstName?.charAt(0) || (user as any)?.email?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {(user as any)?.firstName || (user as any)?.email}
            </p>
            <p className="text-xs text-gray-600">
              Balance: ${(user as any)?.totalBalance || '0.00'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location === item.href || (item.href !== '/dashboard' && location.startsWith(item.href));
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive 
                    ? "bg-purple-600 text-white hover:bg-purple-700" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={onItemClick}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 py-4 border-t space-y-2">
        {(user as any)?.isAdmin && (
          <Link href="/admin">
            <Button variant="outline" className="w-full justify-start" onClick={onItemClick}>
              <Settings className="mr-3 h-4 w-4" />
              Admin Panel
            </Button>
          </Link>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={async () => {
            onItemClick?.();
            await signOut();
            window.location.href = "/";
          }}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={`hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r ${className}`}>
      <NavigationItems />
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <NavigationItems onItemClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}