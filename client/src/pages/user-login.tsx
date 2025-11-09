import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Link, useLocation } from 'wouter';
import { TrendingUp, ArrowLeft, Users } from 'lucide-react';

export default function UserLogin() {
  const [, setLocation] = useLocation();
  const { isLoading: authIsLoading, signIn, signUp, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Extract referral code from URL parameters and determine default tab
  const [defaultTab, setDefaultTab] = useState('signin');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    const currentPath = window.location.pathname;
    
    // If it's a referral link or register/signup page, default to signup tab
    if (ref || currentPath === '/register' || currentPath === '/signup') {
      setDefaultTab('signup');
      if (ref) {
        setReferralCode(ref);
        setMessage(`You're signing up with referral code: ${ref}`);
      }
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  if (isAuthenticated) {
    return null;
  }

  const handleSignIn = async () => {
    setMessage('');
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setMessage(`Error: ${error}`);
      } else {
        setMessage('Welcome back!');
        setTimeout(() => setLocation('/dashboard'), 1000);
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    setMessage('');
    setIsLoading(true);
    try {
      const { error } = await signUp(email, password, `${firstName} ${lastName}`, referralCode);
      if (error) {
        setMessage(`Error: ${error}`);
      } else {
        const successMsg = referralCode 
          ? `Account created successfully with referral code ${referralCode}! Please check your email to confirm your account.`
          : 'Account created successfully! Please check your email to confirm your account.';
        setMessage(successMsg);
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };



  if (authIsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-purple-600 hover:text-purple-700 transition-colors">
              <TrendingUp className="w-8 h-8" />
              <span>MoneyPro</span>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Referral Banner */}
      {referralCode && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3">
          <div className="max-w-4xl mx-auto text-center px-4">
            <p className="font-medium">
              🎉 You're invited to join MoneyPro! Use referral code: <span className="font-bold">{referralCode}</span>
            </p>
          </div>
        </div>
      )}

      {/* Login Form */}
      <div className="flex items-center justify-center py-12 px-4">
        <Card className={`w-full max-w-md ${referralCode ? 'border-green-200 shadow-lg' : ''}`}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {defaultTab === 'signup' && referralCode ? 'Join MoneyPro with Referral' : 'Welcome to MoneyPro'}
            </CardTitle>
            <CardDescription>
              {defaultTab === 'signup' && referralCode 
                ? `Create your account and start earning with referral code: ${referralCode}`
                : 'Sign in to your account or create a new one'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={defaultTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <Button 
                    onClick={handleSignIn} 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <Label htmlFor="referral-code" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Referral Code (Optional)
                    </Label>
                    <Input
                      id="referral-code"
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      placeholder="Enter referral code"
                      className={referralCode ? "border-green-300 bg-green-50" : ""}
                    />
                    {referralCode && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ You'll earn bonuses with referral code: {referralCode}
                      </p>
                    )}
                  </div>
                  <Button 
                    onClick={handleSignUp} 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : (referralCode ? 'Create Account with Referral' : 'Create Account')}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {message && (
              <div className={`mt-4 text-sm p-3 rounded ${
                message.includes('Error') 
                  ? 'text-red-600 bg-red-50 border border-red-200' 
                  : 'text-green-600 bg-green-50 border border-green-200'
              }`}>
                {message}
              </div>
            )}


          </CardContent>
        </Card>
      </div>
    </div>
  );
}
