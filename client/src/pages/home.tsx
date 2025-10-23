import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  TrendingUp,
  Wallet,
  PieChart,
  Users,
  Settings,
  LogOut
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: investments } = useQuery({
    queryKey: ["/api/investments"],
  });

  const { data: transactions } = useQuery({
    queryKey: ["/api/transactions"],
    select: (data) => data?.slice(0, 5), // Show only latest 5
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-purple-600">
                <TrendingUp className="inline w-8 h-8 mr-2" />
                MoneyPro
              </div>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to your MoneyPro Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your investments, track profits, and grow your wealth.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Balance</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${user?.totalBalance || "0.00"}
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
                    {investments?.filter(inv => inv.status === 'active').length || 0}
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
                  <p className="text-sm text-gray-600 mb-1">Platform Status</p>
                  <p className="text-2xl font-bold text-green-600">
                    Active
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Platform Profits</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${stats?.totalProfits || "0.00"}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/dashboard">
                <Button className="w-full moneypro-button-primary">
                  <PieChart className="w-4 h-4 mr-2" />
                  Go to Full Dashboard
                </Button>
              </Link>
              <Button className="w-full" variant="outline">
                <Wallet className="w-4 h-4 mr-2" />
                Make New Investment
              </Button>
              <Button className="w-full" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Profit Calculator
              </Button>
              <Link href="/referrals">
                <Button className="w-full" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Referral Program
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions && transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'deposit' ? 'bg-green-100' : 
                          transaction.type === 'withdrawal' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          <TrendingUp className={`w-5 h-5 ${
                            transaction.type === 'deposit' ? 'text-green-600' : 
                            transaction.type === 'withdrawal' ? 'text-red-600' : 'text-blue-600'
                          }`} />
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
                <p className="text-gray-600">No transactions yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
