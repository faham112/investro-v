import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, DollarSign, TrendingUp, Activity, Shield, UserCheck, UserX, PieChart, Circle } from "lucide-react";
import Navbar from "@/components/navbar";
import type { User, Transaction, PlatformStats } from "../../../shared/types";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<PlatformStats>({
    queryKey: ['/api/admin/stats'],
    refetchInterval: 5000, // Refresh every 5 seconds for real-time data
  });

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: onlineUsers = [], isLoading: onlineUsersLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/online-users'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ['/api/admin/all-transactions'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (statsLoading) {
    return (
      <div className="flex h-screen">
        <Navbar isAdmin />
        <div className="flex-1 flex items-center justify-center md:ml-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const activeUsers = users.filter(user => user.totalBalance && parseFloat(user.totalBalance) > 0).length;
  const totalInvestmentValue = parseFloat(stats?.totalInvestments || "0");
  const recentTransactions = transactions.slice(0, 5);
  const offlineUsers = users.length - onlineUsers.length;

  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar isAdmin />
      <main className="flex-1 overflow-auto md:ml-64">
        <div className="space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center gap-2">
                <Circle className="h-3 w-3 text-green-500 fill-green-500" />
                <span className="text-sm text-gray-600">Live Data</span>
              </div>
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
          </div>

          {/* Real-time Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {activeUsers} active investors
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Circle className="h-2 w-2 text-green-500 fill-green-500" />
                    <span className="text-xs text-green-600">{onlineUsers.length} online</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Circle className="h-2 w-2 text-gray-400 fill-gray-400" />
                    <span className="text-xs text-gray-500">{offlineUsers} offline</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
                <DollarSign className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  ${totalInvestmentValue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Platform investment value
                </p>
                <div className="text-xs text-green-600 mt-1">
                  ↗ +{((totalInvestmentValue / 1000000) * 100).toFixed(1)}% growth
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Profits</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${parseFloat(stats?.totalProfits || "0").toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Generated profits
                </p>
                <div className="text-xs text-green-600 mt-1">
                  ROI: {totalInvestmentValue > 0 ? ((parseFloat(stats?.totalProfits || "0") / totalInvestmentValue) * 100).toFixed(2) : 0}%
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                <Activity className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats?.totalTransactions || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Total platform transactions
                </p>
                <div className="text-xs text-blue-600 mt-1">
                  Avg: ${totalInvestmentValue && stats?.totalTransactions ? (totalInvestmentValue / stats.totalTransactions).toFixed(0) : 0} per transaction
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* User Management */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Real-time user activity and management
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.slice(0, 5).map((user) => {
                        const isOnline = onlineUsers.some(onlineUser => onlineUser.id === user.id);
                        return (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className="relative">
                                  <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-medium">
                                      {user.firstName?.[0]?.toUpperCase() || "U"}
                                    </span>
                                  </div>
                                  <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                                    isOnline ? 'bg-green-500' : 'bg-gray-400'
                                  }`} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                                  <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={isOnline ? "default" : "secondary"} className="flex items-center gap-1 w-fit">
                                <Circle className={`h-2 w-2 ${isOnline ? 'text-green-500 fill-green-500' : 'text-gray-400 fill-gray-400'}`} />
                                {isOnline ? "Online" : "Offline"}
                              </Badge>
                            </TableCell>
                            <TableCell>${parseFloat(user.totalBalance || "0").toLocaleString()}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                Manage
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Real-time Transactions */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Live Transactions
                </CardTitle>
                <CardDescription>
                  Real-time transaction monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${
                            transaction.status === 'completed' ? 'bg-green-500' :
                            transaction.status === 'pending' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                          }`} />
                          <div>
                            <p className="text-sm font-medium capitalize">{transaction.type}</p>
                            <p className="text-xs text-gray-500">{transaction.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">${parseFloat(transaction.amount).toLocaleString()}</p>
                          <Badge variant="outline" className="text-xs">
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {recentTransactions.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No recent transactions</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Platform Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Platform Performance Metrics
              </CardTitle>
              <CardDescription>
                Real-time key performance indicators and analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">User Activity</span>
                    <span className="text-sm text-gray-500">{onlineUsers.length}/{stats?.totalUsers || 0}</span>
                  </div>
                  <Progress value={stats?.totalUsers ? (onlineUsers.length / stats.totalUsers) * 100 : 0} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">{((onlineUsers.length / (stats?.totalUsers || 1)) * 100).toFixed(1)}% online</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Investment Volume</span>
                    <span className="text-sm text-gray-500">${totalInvestmentValue.toLocaleString()}</span>
                  </div>
                  <Progress value={Math.min(totalInvestmentValue / 1000000 * 100, 100)} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">Target: $1M</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Transaction Activity</span>
                    <span className="text-sm text-gray-500">{stats?.totalTransactions || 0}</span>
                  </div>
                  <Progress value={Math.min((stats?.totalTransactions || 0) / 1000 * 100, 100)} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">Target: 1K transactions</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Profit Margin</span>
                    <span className="text-sm text-gray-500">
                      {totalInvestmentValue > 0 ? ((parseFloat(stats?.totalProfits || "0") / totalInvestmentValue) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <Progress value={Math.min(totalInvestmentValue > 0 ? ((parseFloat(stats?.totalProfits || "0") / totalInvestmentValue) * 100) : 0, 100)} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">Platform ROI</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}