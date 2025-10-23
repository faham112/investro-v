import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Percent,
  Users,
  BarChart3,
  Zap,
  Handshake,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: UserPlus,
    title: "Open An Account",
    description: "Power of MoneyPro is trammelled and when nothing prevents beings able to do what we like best invest.",
    color: "purple"
  },
  {
    icon: Percent,
    title: "Give Interest",
    description: "Power of MoneyPro is trammelled and when nothing prevents beings able to do what we like best invest.",
    color: "orange"
  },
  {
    icon: Users,
    title: "Affiliate Program",
    description: "Power of MoneyPro is trammelled and when nothing prevents beings able to do what we like best invest.",
    color: "green"
  },
  {
    icon: BarChart3,
    title: "Stable & Profitable",
    description: "Power of MoneyPro is trammelled and when nothing prevents beings able to do what we like best invest.",
    color: "blue"
  },
  {
    icon: Zap,
    title: "Instant Withdraw",
    description: "Power of MoneyPro is trammelled and when nothing prevents beings able to do what we like best invest.",
    color: "red"
  },
  {
    icon: Handshake,
    title: "Referral Provides",
    description: "Power of MoneyPro is trammelled and when nothing prevents beings able to do what we like best invest.",
    color: "purple"
  }
];

const colorClasses = {
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    hoverBg: "group-hover:bg-purple-600",
    hoverText: "group-hover:text-white"
  },
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-600",
    hoverBg: "group-hover:bg-orange-600",
    hoverText: "group-hover:text-white"
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
    hoverBg: "group-hover:bg-green-600",
    hoverText: "group-hover:text-white"
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    hoverBg: "group-hover:bg-blue-600",
    hoverText: "group-hover:text-white"
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-600",
    hoverBg: "group-hover:bg-red-600",
    hoverText: "group-hover:text-white"
  }
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-orange-500 text-sm font-semibold mb-4 uppercase tracking-wide">
            Features
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Best Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Various aliquet nulla quibusdam eu odio natus wisi eget, lectus Nam consequuntur urna lectus commodo laboriosam Ridiculus lectus laboriosam.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const colorClass = colorClasses[feature.color as keyof typeof colorClasses];
            const Icon = feature.icon;
            
            return (
              <Card 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className={`w-16 h-16 ${colorClass.bg} ${colorClass.hoverBg} rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300`}>
                    <Icon className={`text-2xl ${colorClass.text} ${colorClass.hoverText} transition-colors duration-300`} size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <Button
                    variant="ghost"
                    className="text-purple-600 hover:text-purple-700 font-semibold p-0 h-auto"
                  >
                    Know more <ArrowRight className="ml-2 h-4 w-4" />
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
