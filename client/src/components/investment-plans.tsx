import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Award } from "lucide-react";

export default function InvestmentPlans() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ["/api/investment-plans"],
  });

  // Default plans if API data not available
  const defaultPlans = [
    {
      id: 1,
      name: "MoneyPro Basic",
      interestRate: "5.50",
      minAmount: "500",
      maxAmount: "3000",
      description: "Up to 50 Users Available",
      icon: Award,
      color: "purple",
      popular: false
    },
    {
      id: 2,
      name: "MoneyPro Advanced",
      interestRate: "7.50",
      minAmount: "900",
      maxAmount: "7000",
      description: "Up to 100 Users Available",
      icon: Crown,
      color: "orange",
      popular: true
    },
    {
      id: 3,
      name: "MoneyPro Premium",
      interestRate: "8.50",
      minAmount: "1500",
      maxAmount: "12000",
      description: "Up to 120 Users Available",
      icon: Crown,
      color: "green",
      popular: false
    }
  ];

  const displayPlans = plans || defaultPlans;

  const colorClasses = {
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      button: "moneypro-button-primary"
    },
    orange: {
      bg: "bg-orange-100",
      text: "text-orange-600",
      button: "moneypro-button-accent"
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      button: "bg-green-600 hover:bg-green-700 text-white"
    }
  };

  return (
    <section id="plans" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-orange-500 text-sm font-semibold mb-4 uppercase tracking-wide">
            Pricing
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Best Plan</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Various aliquet nulla quibusdam eu odio natus wisi eget, lectus Nam consequuntur urna lectus commodo laboriosam Ridiculus lectus laboriosam.
          </p>
          
          <div className="flex items-center justify-center space-x-4 bg-gray-100 p-1 rounded-xl inline-flex">
            <Button className="moneypro-button-primary">Monthly</Button>
            <Button variant="ghost" className="text-gray-600 hover:text-purple-600 font-semibold">
              Yearly
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayPlans.map((plan, index) => {
            const colorClass = colorClasses[plan.color as keyof typeof colorClasses] || colorClasses.purple;
            const Icon = plan.icon || Award;
            const isPremium = plan.popular || index === 1;
            
            return (
              <Card 
                key={plan.id} 
                className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow relative ${
                  isPremium ? 'border-2 border-orange-500' : 'border border-gray-100'
                }`}
              >
                {isPremium && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardContent className="p-0">
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 ${colorClass.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`${colorClass.text} text-2xl`} size={32} />
                    </div>
                    <div className={`text-4xl font-bold ${colorClass.text} mb-2`}>
                      {plan.interestRate}%
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      {plan.name}
                    </h3>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center">
                      <Check className="text-green-500 mr-3" size={20} />
                      <span className="text-gray-600">
                        Maximum Deposit ${parseFloat(plan.maxAmount).toLocaleString()}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-green-500 mr-3" size={20} />
                      <span className="text-gray-600">
                        Minimum Deposit ${parseFloat(plan.minAmount).toLocaleString()}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-green-500 mr-3" size={20} />
                      <span className="text-gray-600">
                        {plan.description}
                      </span>
                    </li>
                  </ul>
                  
                  <Button 
                    className={`w-full py-3 font-semibold transition-colors ${colorClass.button}`}
                    onClick={() => window.location.href = "/login"}
                  >
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
