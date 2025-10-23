import { UserPlus, DollarSign, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: 1,
    title: "Register An Account",
    description: "Create a new account to work that strategy by building out your existing account.",
    color: "purple"
  },
  {
    icon: DollarSign,
    number: 2,
    title: "Invest Your Money",
    description: "Create a new account to work that strategy by building out your existing account.",
    color: "orange"
  },
  {
    icon: TrendingUp,
    number: 3,
    title: "Get Smart Profit",
    description: "Create a new account to work that strategy by building out your existing account.",
    color: "green"
  }
];

const colorClasses = {
  purple: "bg-purple-600",
  orange: "bg-orange-600",
  green: "bg-green-600"
};

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-orange-500 text-sm font-semibold mb-4 uppercase tracking-wide">
            How we work
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Various aliquet nulla quibusdam eu odio natus wisi eget, lectus Nam consequuntur urna lectus commodo laboriosam Ridiculus lectus laboriosam.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            
            return (
              <div key={index} className="text-center relative">
                <div className={`w-20 h-20 ${colorClasses[step.color as keyof typeof colorClasses]} rounded-full flex items-center justify-center mx-auto mb-6 relative z-10`}>
                  <Icon className="text-3xl text-white" size={32} />
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
                
                {/* Connection line (hidden on mobile, visible on md+) */}
                {!isLast && (
                  <div className="hidden md:block absolute top-10 left-full w-32 h-0.5 bg-gray-300 transform translate-x-8 z-0"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
