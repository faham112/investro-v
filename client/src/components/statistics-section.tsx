import { useQuery } from "@tanstack/react-query";
import { Users, BarChart3, ArrowUpDown, Wallet } from "lucide-react";

export default function StatisticsSection() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const statistics = [
    {
      icon: Users,
      label: "Total Members",
      value: stats?.totalUsers?.toLocaleString() || "545,965",
      color: "text-white"
    },
    {
      icon: BarChart3,
      label: "Total Profits",
      value: `$${stats?.totalProfits || "54,585"}`,
      color: "text-white"
    },
    {
      icon: ArrowUpDown,
      label: "Total Transaction",
      value: stats?.totalTransactions?.toLocaleString() || "280+",
      color: "text-white"
    },
    {
      icon: Wallet,
      label: "Total Deposited",
      value: `$${stats?.totalInvestments || "12,275,535"}`,
      color: "text-white"
    }
  ];

  return (
    <section className="py-20 moneypro-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statistics.map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <div key={index} className="text-center text-white">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={32} />
                </div>
                <p className="text-orange-200 text-sm font-semibold mb-2 uppercase tracking-wide">
                  {stat.label}
                </p>
                <h3 className={`text-4xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
