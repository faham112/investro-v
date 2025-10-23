import { useState, useEffect } from "react";
import { useSupabaseAuth } from "./useSupabaseAuth";

export function useAdminAuth() {
  const { user } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/admin/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.status === 401) {
          // Not an admin, that's fine
          setAdmin(null);
          setError(null);
        } else if (response.ok) {
          const adminData = await response.json();
          setAdmin(adminData);
        } else {
          throw new Error('Failed to check admin status');
        }
      } catch (err: any) {
        setError(err.message);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []); // Remove user dependency since admin auth is separate from user auth

  const logout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setAdmin(null);
    } catch (error) {
      console.error('Admin logout error:', error);
    }
  };

  // Method to refresh admin status (useful after login)
  const refresh = () => {
    const checkAdminStatus = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/admin/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.status === 401) {
          setAdmin(null);
          setError(null);
        } else if (response.ok) {
          const adminData = await response.json();
          setAdmin(adminData);
        } else {
          throw new Error('Failed to check admin status');
        }
      } catch (err: any) {
        setError(err.message);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  };

  return {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    logout,
    isLoggingOut: false,
    error,
    refresh,
  };
}