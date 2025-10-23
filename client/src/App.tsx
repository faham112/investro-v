import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
// Removed Stack Auth imports
import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useLocation } from "wouter";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import UserDashboard from "@/pages/user-dashboard-new";
import UnifiedDashboard from "@/pages/unified-dashboard";
import ReferralsPage from "@/pages/referrals";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminLogin from "@/pages/admin-login";
import AdminLoginNew from "@/pages/admin-login-new";
import AdminPanel from "@/pages/admin-panel";
import UserLogin from "@/pages/user-login";
import NotFound from "@/pages/not-found";

function AdminRouter() {
  const { isAuthenticated: isAdminAuthenticated, isLoading: adminLoading, error } = useAdminAuth();

  // Show loading only if actually loading (not on error)
  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        <p className="text-white mt-4">Checking admin authentication...</p>
      </div>
    );
  }

  // If there's an error or not authenticated, show login
  if (error || !isAdminAuthenticated) {
    return <AdminLoginNew />;
  }

  return <AdminDashboard />;
}

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center moneypro-gradient">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/admin" component={AdminRouter} />
      <Route path="/admin-panel" component={AdminPanel} />
      <Route path="/login" component={UserLogin} />
      <Route path="/register" component={UserLogin} />
      <Route path="/signup" component={UserLogin} />
      <Route path="/" component={Landing} />
      {isAuthenticated && (
        <>
          <Route path="/dashboard" component={UnifiedDashboard} />
          <Route path="/dashboard/overview" component={UnifiedDashboard} />
          <Route path="/dashboard/home" component={UnifiedDashboard} />
          <Route path="/dashboard/investments" component={UnifiedDashboard} />
          <Route path="/dashboard/referrals" component={UnifiedDashboard} />
          <Route path="/dashboard/transactions" component={UnifiedDashboard} />
          <Route path="/dashboard/tools" component={UnifiedDashboard} />
          <Route path="/dashboard/profile" component={UnifiedDashboard} />
          <Route path="/dashboard/support" component={UnifiedDashboard} />
          <Route path="/old-dashboard" component={UserDashboard} />
          <Route path="/referrals" component={ReferralsPage} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
