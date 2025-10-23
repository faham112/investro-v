import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link, useLocation } from 'wouter';
import { TrendingUp, ArrowLeft, Shield } from 'lucide-react';

export default function AdminLoginNew() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Login successful! Redirecting...');
        // Small delay to show success message, then redirect
        setTimeout(() => {
          window.location.reload(); // Refresh the page to trigger auth check
        }, 500);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setMessage('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-white hover:text-purple-200 transition-colors">
              <TrendingUp className="w-8 h-8" />
              <span>MoneyPro Admin</span>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:text-purple-200 hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Admin Access</CardTitle>
            <CardDescription className="text-gray-300">
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {message && (
              <div className={`mt-4 text-sm p-3 rounded ${
                message.includes('Error') || message.includes('failed')
                  ? 'text-red-300 bg-red-900/20 border border-red-500/20' 
                  : 'text-green-300 bg-green-900/20 border border-green-500/20'
              }`}>
                {message}
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Need help? Contact system administrator
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}