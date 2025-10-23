import { ReactNode } from "react";
import { Sidebar, MobileSidebar } from "./Sidebar";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const { user } = useSupabaseAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
      {/* Sidebar for desktop */}
      <Sidebar />
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                {/* Mobile hamburger menu */}
                <MobileSidebar />
                
                {/* Page title */}
                <div className="ml-4 lg:ml-0">
                  {title && (
                    <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                  )}
                  {subtitle && (
                    <p className="text-sm text-gray-600">{subtitle}</p>
                  )}
                </div>
              </div>

              {/* Mobile user avatar - opposite side of hamburger */}
              <div className="lg:hidden">
                {user && (
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {(user as any)?.user_metadata?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}