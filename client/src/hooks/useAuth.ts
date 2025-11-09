import { useState, useEffect } from 'react';
import { User } from 'shared/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Here you might want to verify the token with the backend
      // For simplicity, we'll just decode it, but a backend check is better
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Check if token is expired
        if (payload.exp * 1000 > Date.now()) {
          // In a real app, you'd fetch user details from the backend
          // For now, we'll just set a placeholder user object
          setUser({ id: payload.id, role: payload.role, email: payload.email, username: payload.username });
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Failed to parse token:", error);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email:string, password:string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email:string, password:string, username:string, referralCode:string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username, referralCode }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Sign up failed');
      }
      // You might want to automatically sign in the user here or redirect to login
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
  };
}
