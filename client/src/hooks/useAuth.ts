import { useState } from "react";

export function useAuth() {
  const [user] = useState(null);
  const [isLoading] = useState(false);
  
  return {
    user,
    isAuthenticated: false,
    isLoading,
    signIn: () => window.location.href = '/login',
    signUp: () => window.location.href = '/register',
    signOut: () => { window.location.href = '/'; },
  };
}
