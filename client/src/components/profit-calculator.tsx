import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Calculator, Percent, DollarSign, TrendingUp, PieChart } from "lucide-react";

export default function ProfitCalculator() {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  const [calculationResult, setCalculationResult] = useState<any>(null);

  const { data: plans } = useQuery({
    queryKey: ["/api/investment-plans"],
  });

  const calculateMutation = useMutation({
    mutationFn: async ({ planId, amount }: { planId: number; amount: string }) => {
      const response = await apiRequest("POST", "/api/calculate-profit", {
        planId: parseInt(planId.toString()),
        amount: parseFloat(amount),
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setCalculationResult(data);
    },
  });

  const handleCalculate = () => {
    if (selectedPlan && amount) {
      calculateMutation.mutate({
        planId: parseInt(selectedPlan),
        amount: amount,
      });
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Calculate Your Profit</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Choose Investment Plan
                </label>
                <Select onValueChange={setSelectedPlan}>
                  <SelectTrigger className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <SelectValue placeholder="Select an investment plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans?.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id.toString()}>
                        {plan.interestRate}% - {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter Amount
                </label>
                <div className="flex">
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 p-4 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <Select onValueChange={setCurrency} defaultValue="USD">
                    <SelectTrigger className="w-24 p-4 border-l-0 border border-gray-300 rounded-r-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button
                onClick={handleCalculate}
                disabled={calculateMutation.isPending || !selectedPlan || !amount}
                className="w-full moneypro-button-primary py-4 font-semibold text-lg"
              >
                <Calculator className="mr-2 h-5 w-5" />
                {calculateMutation.isPending ? "Calculating..." : "Calculate"}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Percent className="text-purple-600 text-xl" />
                </div>
                <p className="text-sm text-gray-600 mb-2">Total Percent</p>
                <p className="text-3xl font-bold text-purple-600">
                  {calculationResult?.totalPercent || "0.00"}%
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="text-orange-600 text-xl" />
                </div>
                <p className="text-sm text-gray-600 mb-2">Daily Profits</p>
                <p className="text-3xl font-bold text-orange-600">
                  ${calculationResult?.dailyProfits || "0.00"}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-green-600 text-xl" />
                </div>
                <p className="text-sm text-gray-600 mb-2">Net Profit</p>
                <p className="text-3xl font-bold text-green-600">
                  ${calculationResult?.netProfit || "0.00"}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <PieChart className="text-blue-600 text-xl" />
                </div>
                <p className="text-sm text-gray-600 mb-2">Total Return</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${calculationResult?.totalReturn || "0.00"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
