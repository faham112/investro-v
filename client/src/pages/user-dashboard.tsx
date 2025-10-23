import { useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";
import {
  TrendingUp,
  Wallet,
  PieChart,
  Users,
  ArrowUpDown,
  Settings,
  LogOut,
  Plus,
  ArrowUp,
  ArrowDown,
  DollarSign
} from "lucide-react";

export default function UserDashboard() {
  const { user: authUser, isAuthenticated, loading: isLoading } = useSupabaseAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: investments, isLoading: investmentsLoading } = useQuery({
    queryKey: ["/api/investments"],
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
    },
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/transactions"],
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
    },
  });

  const { data: investmentPlans } = useQuery({
    queryKey: ["/api/investment-plans"],
  });

  // Calculate user statistics
  const activeInvestments = investments?.filter(inv => inv.status === 'active') || [];
  const totalInvested = activeInvestments.reduce((sum, inv) => sum + parseFloat(inv.amount.toString()), 0);
  const totalProfitEarned = activeInvestments.reduce((sum, inv) => sum + parseFloat(inv.profitEarned?.toString() || '0'), 0);
  const monthlyProfit = totalProfitEarned; // Simplified calculation

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center moneypro-gradient">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b"></header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="text-2xl font-bold text-purple-600 cursor-pointer">
                  <TrendingUp className="inline w-8 h-8 mr-2" />
                  MoneyPro Dashboard
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.firstName || user?.email}
              </span>
              {user?.isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = "/api/logout"}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Balance</p>
                  <p className="text-3xl font-bold text-purple-600">
                    ${user?.totalBalance || "0.00"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Investments</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {activeInvestments.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Monthly Profit</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${monthlyProfit.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Invested</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${totalInvested.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Investment Portfolio */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Investment Portfolio</span>
                <Button size="sm" className="moneypro-button-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  New Investment
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {investmentsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : activeInvestments.length > 0 ? (
                <div className="space-y-4">
                  {activeInvestments.map((investment) => {
                    const plan = investmentPlans?.find(p => p.id === investment.planId);
                    return (
                      <div
                        key={investment.id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {plan?.name || 'Investment Plan'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Invested: ${investment.amount}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            +{plan?.interestRate}%
                          </p>
                          <p className="text-sm text-gray-600">
                            ${investment.profitEarned || '0.00'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No active investments yet.</p>
                  <Button className="mt-4 moneypro-button-primary">
                    Start Investing
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : transactions && transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.slice(0, 8).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'deposit' ? 'bg-green-100' : 
                          transaction.type === 'withdrawal' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          {transaction.type === 'deposit' ? (
                            <ArrowDown className="w-5 h-5 text-green-600" />
                          ) : transaction.type === 'withdrawal' ? (
                            <ArrowUp className="w-5 h-5 text-red-600" />
                          ) : (
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {transaction.type}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`font-semibold ${
                        transaction.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ArrowUpDown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No transactions yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
