import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp,
  Wallet,
  PieChart,
  Users,
  DollarSign,
  Share2,
  Copy,
  Gift,
  CreditCard,
  Activity,
  Calculator,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  User,
  Settings,
  MessageCircle,
  ArrowDown,
  ArrowUp,
  Minus
} from "lucide-react";

export default function UnifiedDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  
  // Determine active page from URL - removed overview, default to home
  const getActivePageFromUrl = () => {
    if (location === '/dashboard/home') return 'home';
    if (location === '/dashboard/investments') return 'investments';
    if (location === '/dashboard/referrals') return 'referrals';
    if (location === '/dashboard/transactions') return 'transactions';
    if (location === '/dashboard/tools') return 'tools';
    if (location === '/dashboard/profile') return 'profile';
    if (location === '/dashboard/support') return 'support';
    return 'home'; // Changed from 'overview' to 'home'
  };
  
  const [activePage, setActivePage] = useState(getActivePageFromUrl());

  useEffect(() => {
    setActivePage(getActivePageFromUrl());
  }, [location]);

  // Fetch all data with proper defaults
  const { data: stats } = useQuery({ queryKey: ["/api/stats"] });
  const { data: investments = [] } = useQuery({ queryKey: ["/api/investments"] });
  const { data: transactions = [] } = useQuery({ queryKey: ["/api/transactions"] });
  const { data: referralData } = useQuery({ queryKey: ["/api/referral-link"] });
  const { data: referralBonuses = [] } = useQuery({ queryKey: ["/api/referral-bonuses"] });
  const { data: referrals = [] } = useQuery({ queryKey: ["/api/referrals"] });
  const { data: investmentPlans = [] } = useQuery({ queryKey: ["/api/investment-plans"] });

  // Calculate derived values (moved to avoid duplicate declarations)
  const calculatedActiveInvestments = investments ? investments.filter((inv: any) => inv.status === 'active').length : 0;
  const calculatedTotalInvested = investments ? investments.reduce((sum: number, inv: any) => sum + parseFloat(inv.amount), 0) : 0;
  const calculatedTotalEarned = referralBonuses ? referralBonuses.reduce((sum: number, bonus: any) => sum + parseFloat(bonus.amount), 0) : 0;
  const calculatedPendingEarnings = referralBonuses ? referralBonuses.filter((bonus: any) => bonus.status === 'pending')
    .reduce((sum: number, bonus: any) => sum + parseFloat(bonus.amount), 0) : 0;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  // Generate unique referral code with firstname and alphanumeric
  const generateUniqueReferralCode = (firstName: string, userId: string) => {
    const name = firstName ? firstName.slice(0, 4).toUpperCase() : 'USER';
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const userIdPart = userId.slice(-4).toUpperCase();
    return `${name}${randomStr}${userIdPart}`;
  };

  const shareReferralLink = async () => {
    const referralLink = `${window.location.origin}/register?ref=${(user as any)?.referralCode || 'none'}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join MoneyPro Investment Platform',
          text: `Join me ${(user as any)?.firstName || 'there'} on MoneyPro and start earning from your investments!`,
          url: referralLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyToClipboard(referralLink, "Referral link");
    }
  };

  // Use calculated values from above
  const activeInvestments = calculatedActiveInvestments;
  const totalInvested = calculatedTotalInvested;
  const totalEarned = calculatedTotalEarned;
  const pendingEarnings = calculatedPendingEarnings;

  // Function to render different page content based on the active page  
  const renderPageContent = () => {
    switch (activePage) {
      case 'home':
        return renderHomePage();
      case 'investments':
        return renderInvestmentsPage();
      case 'referrals':
        return renderReferralsPage();
      case 'transactions':
        return renderTransactionsPage();
      case 'tools':
        return renderToolsPage();
      case 'profile':
        return renderProfilePage();
      case 'support':
        return renderSupportPage();
      case 'deposit':
        return renderDepositPage();
      case 'withdraw':
        return renderWithdrawPage();
      default:
        return renderHomePage(); // Changed from overview to home
    }
  };

  // Removed overview page - content integrated into other pages

  // Enhanced Home Page with integrated overview content
  const renderHomePage = () => {
    const userReferralCode = (user as any)?.referralCode || generateUniqueReferralCode((user as any)?.firstName || '', (user as any)?.id || '');
    
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {(user as any)?.firstName || 'Investor'}!
          </h1>
          <p className="text-gray-600">
            Manage your investments, track profits, and grow your wealth with MoneyPro.
          </p>
        </div>

        {/* Enhanced Stats with Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Balance</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${(user as any)?.totalBalance || "0.00"}
                  </p>
                </div>
                <Wallet className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Investments</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {activeInvestments}
                  </p>
                </div>
                <PieChart className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Invested</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${totalInvested.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Earned</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${totalEarned.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions with Referral */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => setLocation("/dashboard/investments")}>
                <Plus className="w-4 h-4 mr-2" />
                New Investment
              </Button>
              <Button className="w-full" variant="outline" onClick={() => setLocation("/dashboard/tools")}>
                <Calculator className="w-4 h-4 mr-2" />
                Profit Calculator
              </Button>
              <Button className="w-full" variant="outline" onClick={shareReferralLink}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Your Referral
              </Button>
              <Button className="w-full" variant="outline" onClick={() => setLocation("/dashboard/support")}>
                <Users className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>

          {/* Your Unique Referral Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="w-5 h-5 mr-2" />
                Your Referral Code
              </CardTitle>
              <CardDescription>
                Invite friends using your unique code: {(user as any)?.firstName || 'USER'} + Numbers & Letters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  value={userReferralCode}
                  readOnly
                  className="bg-gray-50"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(userReferralCode, "Referral code")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                <p>💰 Earn commission on every investment your referrals make!</p>
                <p>🎯 Multi-level rewards: Get bonuses from 2nd level referrals too!</p>
              </div>
              <Button onClick={shareReferralLink} className="w-full" variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share Referral Link
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions && transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction: any) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'deposit' ? 'bg-green-100' : 
                        transaction.type === 'withdrawal' ? 'bg-red-100' : 
                        transaction.type === 'referral' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {transaction.type === 'deposit' ? 
                          <ArrowUpRight className="w-5 h-5 text-green-600" /> :
                          transaction.type === 'withdrawal' ?
                          <ArrowDownLeft className="w-5 h-5 text-red-600" /> :
                          transaction.type === 'referral' ?
                          <Gift className="w-5 h-5 text-blue-600" /> :
                          <Activity className="w-5 h-5 text-gray-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{transaction.type}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                      <span className={`font-semibold ${
                        transaction.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount}
                      </span>
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No recent activity</p>
                <p className="text-sm">Your transactions and earnings will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  // Investments Page Content  
  const renderInvestmentsPage = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Investment Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Available Investment Plans</CardTitle>
              <CardDescription>Choose from our profitable investment packages</CardDescription>
            </CardHeader>
            <CardContent>
              {investmentPlans && investmentPlans.length > 0 ? (
                <div className="space-y-4">
                  {investmentPlans.map((plan) => (
                    <div key={plan.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{plan.name}</h3>
                          <p className="text-sm text-gray-600">{plan.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Min: ${plan.minAmount} - Max: ${plan.maxAmount}
                          </p>
                        </div>
                        <Badge variant="secondary">{plan.interestRate}% for {plan.duration} days</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No investment plans available</p>
              )}
            </CardContent>
          </Card>

          {/* My Investments */}
          <Card>
            <CardHeader>
              <CardTitle>My Investments</CardTitle>
            </CardHeader>
            <CardContent>
              {investments && investments.length > 0 ? (
                <div className="space-y-4">
                  {investments.slice(0, 5).map((investment) => (
                    <div key={investment.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">${investment.amount}</p>
                          <p className="text-sm text-gray-600">
                            Current Value: ${investment.currentValue}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(investment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={investment.status === 'active' ? 'default' : 'secondary'}>
                          {investment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No investments yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Deposit and Withdraw Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deposit Card */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <ArrowDown className="h-5 w-5 mr-2" />
                Deposit Funds
              </CardTitle>
              <CardDescription className="text-green-600">
                Add money to your investment account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-4">
                  <DollarSign className="w-12 h-12 mx-auto mb-3 text-green-600" />
                  <p className="text-lg font-semibold text-green-700 mb-2">Quick Deposit</p>
                  <p className="text-sm text-green-600 mb-4">
                    Fund your account instantly to start investing
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Make Deposit
                  </Button>
                </div>
                <div className="border-t border-green-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Current Balance:</span>
                    <span className="font-semibold text-green-700">
                      ${(user as any)?.totalBalance || '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Withdraw Card */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <ArrowUp className="h-5 w-5 mr-2" />
                Withdraw Funds
              </CardTitle>
              <CardDescription className="text-blue-600">
                Cash out your profits and principal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-4">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                  <p className="text-lg font-semibold text-blue-700 mb-2">Quick Withdraw</p>
                  <p className="text-sm text-blue-600 mb-4">
                    Withdraw your earnings and investments
                  </p>
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                    <Minus className="w-4 h-4 mr-2" />
                    Make Withdrawal
                  </Button>
                </div>
                <div className="border-t border-blue-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600">Available:</span>
                    <span className="font-semibold text-blue-700">
                      ${(user as any)?.totalBalance || '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Enhanced Referrals Page with Unique Code System
  const renderReferralsPage = () => {
    const userReferralCode = (user as any)?.referralCode || generateUniqueReferralCode((user as any)?.firstName || '', (user as any)?.id || '');
    const referralLink = `${window.location.origin}/register?ref=${userReferralCode}`;
    
    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Unique Referral System
          </h2>
          <p className="text-gray-600">
            Share your personalized code "{(user as any)?.firstName || 'USER'}" + unique numbers & letters to earn commissions!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                  <p className="text-2xl font-bold text-blue-600">{referrals ? referrals.length : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earned</p>
                  <p className="text-2xl font-bold text-green-600">${totalEarned.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Rewards</p>
                  <p className="text-2xl font-bold text-orange-600">${pendingEarnings.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Share2 className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Links</p>
                  <p className="text-2xl font-bold text-purple-600">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Your Unique Referral System */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="h-5 w-5 mr-2" />
                Your Personal Referral Code
              </CardTitle>
              <CardDescription>
                Based on your name "{(user as any)?.firstName || 'USER'}" + unique identifier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Your unique code:</p>
                    <p className="text-2xl font-bold text-purple-600 font-mono">{userReferralCode}</p>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(userReferralCode, "Referral code")}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  🎯 <strong>How it works:</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Your name creates the first part of your code</li>
                  <li>• Random letters & numbers make it unique</li>
                  <li>• People trust personal referrals more</li>
                  <li>• Easier to remember and share</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Share2 className="h-5 w-5 mr-2" />
                Share Your Referral Link
              </CardTitle>
              <CardDescription>
                Complete registration link with your personal code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={referralLink}
                  readOnly
                  className="flex-1 bg-gray-50"
                />
                <Button
                  onClick={() => copyToClipboard(referralLink, "Referral link")}
                  variant="outline"
                  size="icon"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button onClick={shareReferralLink} className="bg-purple-600 hover:bg-purple-700">
                  Share
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button onClick={shareReferralLink} className="bg-purple-600 hover:bg-purple-700">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Link
                  </Button>
                  <Button 
                    onClick={() => copyToClipboard(`Join me on MoneyPro! Use my referral code: ${userReferralCode}`, "Message")}
                    variant="outline"
                  >
                    Copy Message
                  </Button>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p>💡 <strong>Pro tips for sharing:</strong></p>
                  <p>• Personal approach: "Hey [Name], I've been using MoneyPro..."</p>
                  <p>• Mention your code includes your name for trust</p>
                  <p>• Share your success stories and earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commission Structure & My Team */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Commission Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-green-900">Level 1 (Direct)</p>
                      <p className="text-sm text-green-700">People you personally refer</p>
                      <p className="text-xs text-green-600 mt-1">Instant commission on their investments</p>
                    </div>
                    <Badge className="bg-green-600 text-white">5% Commission</Badge>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-blue-900">Level 2 (Indirect)</p>
                      <p className="text-sm text-blue-700">People referred by your referrals</p>
                      <p className="text-xs text-blue-600 mt-1">Bonus rewards from their activity</p>
                    </div>
                    <Badge className="bg-blue-600 text-white">2% Commission</Badge>
                  </div>
                </div>

                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <p className="font-medium mb-1">💰 Example Earnings:</p>
                  <p>• Direct referral invests $1,000 = You earn $50</p>
                  <p>• Their referral invests $1,000 = You earn $20</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                My Referral Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              {referrals && referrals.length > 0 ? (
                <div className="space-y-3">
                  {referrals.slice(0, 5).map((referral: any, index: number) => (
                    <div key={referral.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Referral #{index + 1}</p>
                          <p className="text-xs text-gray-600">
                            Level {referral.level || 1}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          +${(referral.commission || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {referral.status || 'Active'}
                        </p>
                      </div>
                    </div>
                  ))}
                  {referrals.length > 5 && (
                    <p className="text-center text-sm text-gray-500">
                      +{referrals.length - 5} more referrals
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No referrals yet</p>
                  <p className="text-sm">Start sharing your unique code to build your team!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Enhanced Transactions Page
  const renderTransactionsPage = () => {
    return (
      <div className="space-y-6">
        {/* Transaction Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ArrowUpRight className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Deposits</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${stats ? (stats as any).totalInvestments || "0.00" : "0.00"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Gift className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Referral Earnings</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${totalEarned.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Profits</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${stats ? (stats as any).totalProfits || "0.00" : "0.00"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              All Transactions
            </CardTitle>
            <CardDescription>Complete history of your financial activities</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions && transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction: any) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === 'deposit' ? 'bg-green-100' : 
                        transaction.type === 'withdrawal' ? 'bg-red-100' : 
                        transaction.type === 'referral' ? 'bg-blue-100' : 
                        transaction.type === 'profit' ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        {transaction.type === 'deposit' ? 
                          <ArrowUpRight className="w-6 h-6 text-green-600" /> :
                          transaction.type === 'withdrawal' ?
                          <ArrowDownLeft className="w-6 h-6 text-red-600" /> :
                          transaction.type === 'referral' ?
                          <Gift className="w-6 h-6 text-blue-600" /> :
                          transaction.type === 'profit' ?
                          <TrendingUp className="w-6 h-6 text-purple-600" /> :
                          <Activity className="w-6 h-6 text-gray-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {transaction.type}
                          {transaction.type === 'referral' && ' Commission'}
                          {transaction.type === 'profit' && ' Earnings'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {transaction.description && (
                          <p className="text-xs text-gray-500 mt-1">{transaction.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          transaction.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount}
                        </p>
                        <Badge 
                          variant={transaction.status === 'completed' ? 'default' : 
                                   transaction.status === 'pending' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No transactions yet</p>
                <p className="text-sm">Your deposits, withdrawals, and earnings will appear here</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setLocation("/dashboard/investments")}
                  variant="outline"
                >
                  Make Your First Investment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  // Enhanced Tools Page with Calculator
  const renderToolsPage = () => {
    // Effect to set default plan when investment plans load
    useEffect(() => {
      if (investmentPlans && investmentPlans.length > 0 && !selectedPlan) {
        setSelectedPlan(investmentPlans[0]);
      }
    }, [investmentPlans, selectedPlan]);

    const calculateProfits = () => {
      if (!calculatorAmount || !selectedPlan) return { dailyProfit: 0, totalProfit: 0, totalReturn: 0 };
      
      const amount = parseFloat(calculatorAmount) || 0;
      const dailyRate = selectedPlan.interestRate / 100;
      const dailyProfit = amount * dailyRate;
      const totalProfit = dailyProfit * selectedPlan.duration;
      const totalReturn = amount + totalProfit;
      
      return { dailyProfit, totalProfit, totalReturn };
    };

    const { dailyProfit, totalProfit, totalReturn } = calculateProfits();
    
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Investment Tools & Calculator</h2>
          <p className="text-gray-600">Plan your investments and track platform performance</p>
        </div>

        {/* Interactive Profit Calculator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Profit Calculator
            </CardTitle>
            <CardDescription>Calculate your potential returns based on our investment plans</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calculator Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Amount ($)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={calculatorAmount}
                    onChange={(e) => setCalculatorAmount(e.target.value)}
                    className="text-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Investment Plan
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedPlan?.id || ''}
                    onChange={(e) => {
                      const plan = investmentPlans?.find(p => p.id === e.target.value);
                      setSelectedPlan(plan);
                    }}
                  >
                    {investmentPlans?.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - {plan.interestRate}% daily for {plan.duration} days
                      </option>
                    ))}
                  </select>
                </div>

                {selectedPlan && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">{selectedPlan.name}</h4>
                    <p className="text-sm text-blue-700">{selectedPlan.description}</p>
                    <div className="text-xs text-blue-600 mt-2 space-y-1">
                      <p>• Minimum: ${selectedPlan.minAmount}</p>
                      <p>• Maximum: ${selectedPlan.maxAmount}</p>
                      <p>• Duration: {selectedPlan.duration} days</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Calculator Results */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Projected Returns</h4>
                
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">Daily Profit</p>
                    <p className="text-xl font-bold text-green-600">${dailyProfit.toFixed(2)}</p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">Total Profit ({selectedPlan?.duration} days)</p>
                    <p className="text-xl font-bold text-blue-600">${totalProfit.toFixed(2)}</p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-700">Total Return</p>
                    <p className="text-xl font-bold text-purple-600">${totalReturn.toFixed(2)}</p>
                  </div>
                </div>

                {calculatorAmount && parseFloat(calculatorAmount) > 0 && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    <p className="font-medium mb-1">💡 Investment Summary:</p>
                    <p>• Initial Investment: ${calculatorAmount}</p>
                    <p>• Return on Investment: {((totalProfit / parseFloat(calculatorAmount)) * 100).toFixed(1)}%</p>
                    <p>• Investment Period: {selectedPlan?.duration} days</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Platform Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">Total Invested</p>
                  <p className="text-lg font-bold text-green-600">
                    ${stats ? (stats as any).totalInvestments || "0.00" : "0.00"}
                  </p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">Total Profits</p>
                  <p className="text-lg font-bold text-blue-600">
                    ${stats ? (stats as any).totalProfits || "0.00" : "0.00"}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Status</span>
                  <Badge className="bg-green-600">Online</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Investors</span>
                  <span className="font-medium">{stats ? (stats as any).totalUsers || "0" : "0"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Investment Plans Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {investmentPlans && investmentPlans.length > 0 ? (
                <div className="space-y-3">
                  {investmentPlans.map((plan: any) => (
                    <div key={plan.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{plan.name}</p>
                          <p className="text-sm text-gray-600">
                            ${plan.minAmount} - ${plan.maxAmount}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {plan.interestRate}%/day
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No investment plans available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Enhanced Profile Page 
  const renderProfilePage = () => {
    const userReferralCode = (user as any)?.referralCode || generateUniqueReferralCode((user as any)?.firstName || '', (user as any)?.id || '');
    
    return (
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </CardTitle>
            <CardDescription>Manage your account details and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">
                  {(user as any)?.firstName?.charAt(0) || (user as any)?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">{(user as any)?.firstName || 'User'}</h3>
                <p className="text-gray-600">{(user as any)?.email}</p>

              </div>
            </div>
            
            {/* Profile Status */}
            <div className="mt-4">
              <Badge className="bg-green-100 text-green-800">Verified Account</Badge>
              <Badge className="ml-2 bg-blue-100 text-blue-800">Active Investor</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">
                    {new Date((user as any)?.createdAt || Date.now()).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Account Status</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">User ID</span>
                  <span className="font-mono text-sm">{(user as any)?.id || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Referral Code</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-medium">{userReferralCode}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(userReferralCode, "Referral code")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Active Investments</span>
                  <Badge variant="secondary">{activeInvestments}</Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Total Referrals</span>
                  <Badge variant="secondary">{referrals?.length || 0}</Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Completed Transactions</span>
                  <Badge variant="secondary">{transactions?.length || 0}</Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Last Login</span>
                  <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Account Security
            </CardTitle>
            <CardDescription>Manage your security preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive updates about your investments</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Enabled</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Extra security for your account</p>
                </div>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                </div>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Enhanced Support Page
  const renderSupportPage = () => {
    return (
      <div className="space-y-6">
        {/* Support Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Support Center</h2>
          <p className="text-gray-600">Get help, contact support, and find answers to common questions</p>
        </div>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="p-6">
              <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600 mb-4">Get instant help from our support team</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-gray-600 mb-4">Send us a detailed message</p>
              <Button variant="outline" className="w-full">
                Send Email
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Help Center</h3>
              <p className="text-sm text-gray-600 mb-4">Browse our knowledge base</p>
              <Button variant="outline" className="w-full">
                Browse Articles
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">How do I make my first investment?</h4>
                <p className="text-sm text-gray-600">
                  Navigate to the Investments page, select an investment plan that fits your budget, 
                  enter the amount you want to invest, and confirm your investment.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">How does the referral system work?</h4>
                <p className="text-sm text-gray-600">
                  Share your unique referral code (based on your name) with friends. You earn 5% commission 
                  on their direct investments and 2% on their referrals' investments.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">When do I receive my profits?</h4>
                <p className="text-sm text-gray-600">
                  Profits are calculated daily and added to your account balance. You can withdraw 
                  your profits at any time through the platform.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Is my investment secure?</h4>
                <p className="text-sm text-gray-600">
                  Yes, we use industry-standard security measures and all investments are backed by 
                  our cryptocurrency trading strategies.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">How do I withdraw my funds?</h4>
                <p className="text-sm text-gray-600">
                  Go to your profile page, click on withdraw funds, enter the amount, and provide 
                  your payment details. Withdrawals are processed within 24-48 hours.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Contact Information
            </CardTitle>
            <CardDescription>Other ways to reach us</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MessageCircle className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">support@moneypro.com</p>
                    <p className="text-xs text-gray-500">Response within 4-6 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-sm text-gray-600">Monday - Friday: 9AM - 6PM UTC</p>
                    <p className="text-xs text-gray-500">Weekend support available</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Activity className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <p className="font-medium">Average Response Time</p>
                    <p className="text-sm text-gray-600">Live Chat: Instant</p>
                    <p className="text-sm text-gray-600">Email: 4-6 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <p className="font-medium">Support Languages</p>
                    <p className="text-sm text-gray-600">English, Spanish, Chinese</p>
                    <p className="text-xs text-gray-500">More languages coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // State declarations moved to component level to avoid hooks rule violations
  const [depositAmount, setDepositAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bitcoin');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bitcoin');
  const [walletAddress, setWalletAddress] = useState('');
  const [calculatorAmount, setCalculatorAmount] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const renderDepositPage = () => {
    
    const handleDeposit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!depositAmount || parseFloat(depositAmount) <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid deposit amount",
          variant: "destructive"
        });
        return;
      }

      try {
        const response = await fetch('/api/deposit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: parseFloat(depositAmount),
            paymentMethod
          })
        });

        if (response.ok) {
          toast({
            title: "Deposit Initiated",
            description: "Your deposit request has been submitted successfully"
          });
          setDepositAmount('');
        } else {
          throw new Error('Deposit failed');
        }
      } catch (error) {
        toast({
          title: "Deposit Failed",
          description: "Please try again or contact support",
          variant: "destructive"
        });
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Make a Deposit</h2>
          <p className="text-gray-600">Fund your account securely to start investing</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-6 w-6 mr-2" />
                Deposit Funds
              </CardTitle>
              <CardDescription>Choose your payment method and deposit amount</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeposit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="deposit-amount">Deposit Amount ($)</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    step="0.01"
                    min="10"
                    placeholder="Enter amount (minimum $10)"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label>Payment Method</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card 
                      className={`cursor-pointer transition-colors ${paymentMethod === 'bitcoin' ? 'ring-2 ring-blue-600 bg-blue-50' : ''}`}
                      onClick={() => setPaymentMethod('bitcoin')}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <DollarSign className="h-6 w-6 text-orange-600" />
                        </div>
                        <h3 className="font-medium mb-1">Bitcoin</h3>
                        <p className="text-sm text-gray-600">BTC Payment</p>
                      </CardContent>
                    </Card>

                    <Card 
                      className={`cursor-pointer transition-colors ${paymentMethod === 'ethereum' ? 'ring-2 ring-blue-600 bg-blue-50' : ''}`}
                      onClick={() => setPaymentMethod('ethereum')}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <DollarSign className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-medium mb-1">Ethereum</h3>
                        <p className="text-sm text-gray-600">ETH Payment</p>
                      </CardContent>
                    </Card>

                    <Card 
                      className={`cursor-pointer transition-colors ${paymentMethod === 'usdt' ? 'ring-2 ring-blue-600 bg-blue-50' : ''}`}
                      onClick={() => setPaymentMethod('usdt')}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-medium mb-1">USDT</h3>
                        <p className="text-sm text-gray-600">Tether Payment</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Important Notes:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Minimum deposit amount is $10</li>
                    <li>• Deposits are typically processed within 1-6 confirmations</li>
                    <li>• Contact support if you don't see your deposit within 24 hours</li>
                    <li>• Always double-check the payment address before sending</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Initiate Deposit
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Deposit History */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Deposits</CardTitle>
              <CardDescription>Your deposit transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">$500.00 - Bitcoin</p>
                    <p className="text-sm text-gray-600">January 15, 2025</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">$1,000.00 - Ethereum</p>
                    <p className="text-sm text-gray-600">January 10, 2025</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Withdraw Page
  const renderWithdrawPage = () => {
    
    const availableBalance = parseFloat((user as any)?.totalBalance || "0.00");

    const handleWithdraw = async (e: React.FormEvent) => {
      e.preventDefault();
      const amount = parseFloat(withdrawAmount);
      
      if (!withdrawAmount || amount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid withdrawal amount",
          variant: "destructive"
        });
        return;
      }

      if (amount > availableBalance) {
        toast({
          title: "Insufficient Funds",
          description: "Withdrawal amount exceeds available balance",
          variant: "destructive"
        });
        return;
      }

      if (!walletAddress) {
        toast({
          title: "Missing Address",
          description: "Please provide a valid wallet address",
          variant: "destructive"
        });
        return;
      }

      try {
        const response = await fetch('/api/withdraw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount,
            withdrawalMethod: withdrawMethod,
            walletAddress
          })
        });

        if (response.ok) {
          toast({
            title: "Withdrawal Requested",
            description: "Your withdrawal request is being processed"
          });
          setWithdrawAmount('');
          setWalletAddress('');
        } else {
          throw new Error('Withdrawal failed');
        }
      } catch (error) {
        toast({
          title: "Withdrawal Failed",
          description: "Please try again or contact support",
          variant: "destructive"
        });
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Withdraw Funds</h2>
          <p className="text-gray-600">Transfer your earnings to your preferred wallet</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                <p className="text-3xl font-bold text-green-600">${availableBalance.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowDownLeft className="h-6 w-6 mr-2" />
                Request Withdrawal
              </CardTitle>
              <CardDescription>Choose your withdrawal method and amount</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWithdraw} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="withdraw-amount">Withdrawal Amount ($)</Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    step="0.01"
                    min="10"
                    max={availableBalance}
                    placeholder="Enter amount (minimum $10)"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-600">Available: ${availableBalance.toFixed(2)}</p>
                </div>

                <div className="space-y-4">
                  <Label>Withdrawal Method</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card 
                      className={`cursor-pointer transition-colors ${withdrawMethod === 'bitcoin' ? 'ring-2 ring-blue-600 bg-blue-50' : ''}`}
                      onClick={() => setWithdrawMethod('bitcoin')}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <DollarSign className="h-6 w-6 text-orange-600" />
                        </div>
                        <h3 className="font-medium mb-1">Bitcoin</h3>
                        <p className="text-sm text-gray-600">BTC Wallet</p>
                      </CardContent>
                    </Card>

                    <Card 
                      className={`cursor-pointer transition-colors ${withdrawMethod === 'ethereum' ? 'ring-2 ring-blue-600 bg-blue-50' : ''}`}
                      onClick={() => setWithdrawMethod('ethereum')}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <DollarSign className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-medium mb-1">Ethereum</h3>
                        <p className="text-sm text-gray-600">ETH Wallet</p>
                      </CardContent>
                    </Card>

                    <Card 
                      className={`cursor-pointer transition-colors ${withdrawMethod === 'usdt' ? 'ring-2 ring-blue-600 bg-blue-50' : ''}`}
                      onClick={() => setWithdrawMethod('usdt')}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-medium mb-1">USDT</h3>
                        <p className="text-sm text-gray-600">Tether Wallet</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wallet-address">Wallet Address</Label>
                  <Input
                    id="wallet-address"
                    placeholder="Enter your wallet address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Important Notes:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Minimum withdrawal amount is $10</li>
                    <li>• Withdrawals are processed within 24-48 hours</li>
                    <li>• Double-check your wallet address before submitting</li>
                    <li>• Transactions cannot be reversed once processed</li>
                    <li>• Network fees may apply depending on the cryptocurrency</li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={availableBalance < 10}
                >
                  <ArrowDownLeft className="h-4 w-4 mr-2" />
                  Request Withdrawal
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Withdrawal History */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Withdrawals</CardTitle>
              <CardDescription>Your withdrawal transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">$250.00 - Bitcoin</p>
                    <p className="text-sm text-gray-600">January 12, 2025</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">$100.00 - Ethereum</p>
                    <p className="text-sm text-gray-600">January 8, 2025</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Main render method
  const pageContent = () => {
    switch (activePage) {
      case 'home': return renderHomePage();
      case 'investments': return renderInvestmentsPage();
      case 'referrals': return renderReferralsPage();
      case 'transactions': return renderTransactionsPage();
      case 'tools': return renderToolsPage();
      case 'profile': return renderProfilePage();
      case 'support': return renderSupportPage();
      case 'deposit': return renderDepositPage();
      case 'withdraw': return renderWithdrawPage();
      default: return renderHomePage();
    }
  };

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle={`Welcome back, ${(user as any)?.firstName || (user as any)?.email}`}
    >
      {pageContent()}
    </DashboardLayout>
  );
}
