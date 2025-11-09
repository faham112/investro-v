import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Shield,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  Edit3,
  Plus,
  Trash2,
  BarChart3,
  CreditCard,
  Wallet,
  ArrowUpDown
} from "lucide-react";

// Admin login state
function AdminLoginForm({ onLogin }: { onLogin: (credentials: { username: string; password: string }) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ username, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Panel Login</CardTitle>
          <CardDescription>Access MoneyPro Administration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Admin Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              <Shield className="w-4 h-4 mr-2" />
              Login to Admin Panel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Main admin dashboard
function AdminDashboard() {
  const queryClient = useQueryClient();

  // Fetch admin stats
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error('Failed to fetch admin stats');
      return res.json();
    },
  });

  // Fetch investment plans
  const { data: investmentPlans = [] } = useQuery({
    queryKey: ['/api/investment-plans'],
    queryFn: async () => {
      const res = await fetch('/api/investment-plans');
      if (!res.ok) throw new Error('Failed to fetch investment plans');
      return res.json();
    },
  });

  // Plan management mutations
  const updatePlanMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const res = await fetch(`/api/admin/plans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update plan');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/investment-plans'] });
    },
    onError: () => {
    },
  });

  const createPlanMutation = useMutation({
    mutationFn: async (planData: any) => {
      const res = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData),
      });
      if (!res.ok) throw new Error('Failed to create plan');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/investment-plans'] });
    },
    onError: () => {
    },
  });

  // Plan edit dialog
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    interest_rate: 0,
    min_amount: 0,
    max_amount: 0,
    duration: 0
  });

  const handleUpdatePlan = (planData: any) => {
    updatePlanMutation.mutate({ id: editingPlan.id, updates: planData });
    setEditingPlan(null);
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    createPlanMutation.mutate(newPlan);
    setNewPlan({ name: '', description: '', interest_rate: 0, min_amount: 0, max_amount: 0, duration: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
      {/* Admin Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">MoneyPro Admin Panel</h1>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
              Administrator Access
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="plans" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Investment Plans</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Users</TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Transactions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* User Statistics Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Online Users</p>
                        <p className="text-3xl font-bold text-green-600">
                          {stats?.onlineUsers || 0}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Currently active</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Users</p>
                        <p className="text-3xl font-bold text-purple-600">
                          {stats?.totalUsers || 0}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Active members</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Registered Users</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {stats?.totalRegisteredUsers || stats?.totalUsers || 0}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">All registrations</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Platform Statistics */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Investments</p>
                        <p className="text-2xl font-bold text-orange-600">
                          ${stats?.totalInvestments || "0"}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Active Plans</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {investmentPlans.length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Platform Revenue</p>
                        <p className="text-2xl font-bold text-emerald-600">
                          ${stats?.platformRevenue || "0"}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                        <p className="text-2xl font-bold text-indigo-600">
                          {stats?.totalTransactions || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <ArrowUpDown className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Investment Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Investment Plans Management</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Plan
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Investment Plan</DialogTitle>
                    <DialogDescription>Add a new investment plan to the platform</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreatePlan} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Plan Name</Label>
                        <Input
                          id="name"
                          value={newPlan.name}
                          onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                          placeholder="e.g., Premium Plan"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interest_rate">Interest Rate (%)</Label>
                        <Input
                          id="interest_rate"
                          type="number"
                          step="0.01"
                          value={newPlan.interest_rate}
                          onChange={(e) => setNewPlan({ ...newPlan, interest_rate: parseFloat(e.target.value) })}
                          placeholder="e.g., 12.5"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newPlan.description}
                        onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                        placeholder="Plan description"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="min_amount">Min Amount ($)</Label>
                        <Input
                          id="min_amount"
                          type="number"
                          value={newPlan.min_amount}
                          onChange={(e) => setNewPlan({ ...newPlan, min_amount: parseFloat(e.target.value) })}
                          placeholder="100"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max_amount">Max Amount ($)</Label>
                        <Input
                          id="max_amount"
                          type="number"
                          value={newPlan.max_amount}
                          onChange={(e) => setNewPlan({ ...newPlan, max_amount: parseFloat(e.target.value) })}
                          placeholder="10000"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (days)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={newPlan.duration}
                          onChange={(e) => setNewPlan({ ...newPlan, duration: parseInt(e.target.value) })}
                          placeholder="30"
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">Create Plan</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {investmentPlans.map((plan: any) => (
                <Card key={plan.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{plan.name}</h3>
                        <Badge variant="outline">{plan.interest_rate}% Returns</Badge>
                        <Badge variant={plan.is_active ? "default" : "secondary"}>
                          {plan.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{plan.description}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Min Investment:</span>
                          <div className="font-semibold">${plan.min_amount}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Max Investment:</span>
                          <div className="font-semibold">${plan.max_amount}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <div className="font-semibold">{plan.duration} days</div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingPlan(plan)}
                      className="border-purple-300 text-purple-600 hover:bg-purple-50"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Edit Plan Dialog */}
            {editingPlan && (
              <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Investment Plan</DialogTitle>
                    <DialogDescription>Update the investment plan details</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const planData = {
                      name: formData.get('name'),
                      description: formData.get('description'),
                      interest_rate: parseFloat(formData.get('interest_rate') as string),
                      min_amount: parseFloat(formData.get('min_amount') as string),
                      max_amount: parseFloat(formData.get('max_amount') as string),
                      duration: parseInt(formData.get('duration') as string),
                    };
                    handleUpdatePlan(planData);
                  }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Plan Name</Label>
                        <Input
                          id="edit-name"
                          name="name"
                          defaultValue={editingPlan.name}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-interest_rate">Interest Rate (%)</Label>
                        <Input
                          id="edit-interest_rate"
                          name="interest_rate"
                          type="number"
                          step="0.01"
                          defaultValue={editingPlan.interest_rate}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Input
                        id="edit-description"
                        name="description"
                        defaultValue={editingPlan.description}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-min_amount">Min Amount ($)</Label>
                        <Input
                          id="edit-min_amount"
                          name="min_amount"
                          type="number"
                          defaultValue={editingPlan.min_amount}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-max_amount">Max Amount ($)</Label>
                        <Input
                          id="edit-max_amount"
                          name="max_amount"
                          type="number"
                          defaultValue={editingPlan.max_amount}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-duration">Duration (days)</Label>
                        <Input
                          id="edit-duration"
                          name="duration"
                          type="number"
                          defaultValue={editingPlan.duration}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">Update Plan</Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Monitor and manage platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  User management features coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Monitor all platform transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Transaction monitoring features coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Main admin panel component with authentication
export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
      }
    } catch (error) {
    }
  };

  if (!isAuthenticated) {
    return <AdminLoginForm onLogin={handleLogin} />;
  }

  return <AdminDashboard />;
}
