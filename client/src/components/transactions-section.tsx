import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";

export default function TransactionsSection() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');

  const { data: allTransactions } = useQuery({
    queryKey: ["/api/all-transactions"],
  });

  // Sample transaction data for display (matching the design reference)
  const sampleTransactions = [
    {
      id: 1,
      name: "S.M John Smith",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
      date: "Oct 01, 2017",
      amount: "$15,00,000.00",
      currency: "Dollar",
      status: "1 Day ago",
      type: "deposit"
    },
    {
      id: 2,
      name: "Michel Alex",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b977?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
      date: "Oct 10, 2017",
      amount: "$4,00,000.00",
      currency: "Euro",
      status: "3 Days ago",
      type: "deposit"
    },
    {
      id: 3,
      name: "Maria Sumi",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
      date: "Oct 15, 2017",
      amount: "$12,00,000.00",
      currency: "Dollar",
      status: "5 Days ago",
      type: "deposit"
    },
    {
      id: 4,
      name: "Ruddra Somodar",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
      date: "Oct 20, 2017",
      amount: "$3,00,000.00",
      currency: "Dollar",
      status: "2 Days ago",
      type: "deposit"
    },
    {
      id: 5,
      name: "Tony Blaer",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
      date: "Oct 17, 2017",
      amount: "$7,00,000.00",
      currency: "Euro",
      status: "3 Days ago",
      type: "withdraw"
    }
  ];

  const filteredTransactions = sampleTransactions.filter(t => t.type === activeTab);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-orange-500 text-sm font-semibold mb-4 uppercase tracking-wide">
            Transaction
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Latest Transaction</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Various aliquet nulla quibusdam eu odio natus wisi eget, lectus Nam consequuntur urna lectus commodo laboriosam Ridiculus lectus laboriosam.
          </p>
          
          <div className="flex items-center justify-center space-x-4 bg-gray-100 p-1 rounded-xl inline-flex">
            <Button
              onClick={() => setActiveTab('deposit')}
              className={activeTab === 'deposit' ? 'moneypro-button-primary' : 'bg-transparent text-gray-600 hover:text-purple-600 font-semibold'}
            >
              Deposit
            </Button>
            <Button
              onClick={() => setActiveTab('withdraw')}
              className={activeTab === 'withdraw' ? 'moneypro-button-primary' : 'bg-transparent text-gray-600 hover:text-purple-600 font-semibold'}
            >
              Withdraw
            </Button>
          </div>
        </div>
        
        <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Currency</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={transaction.avatar}
                            alt={transaction.name}
                            className="w-10 h-10 rounded-full mr-3 object-cover"
                          />
                          <span className="font-medium text-gray-900">
                            {transaction.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{transaction.date}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{transaction.amount}</td>
                      <td className="px-6 py-4 text-gray-600">{transaction.currency}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          transaction.type === 'deposit' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
