import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Users, DollarSign, Shield } from "lucide-react";

export default function HeroSection() {
  const [email, setEmail] = useState("");

  const handleStartInvest = () => {
    if (email) {
      window.location.href = "/login";
    }
  };

  return (
    <section id="home" className="moneypro-gradient pt-16 pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute top-20 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-white opacity-10 rounded-full"></div>
      <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-orange-400 opacity-20 rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          <div className="text-white">
            <p className="text-orange-300 text-sm font-semibold mb-4 uppercase tracking-wide">
              <Users className="inline w-4 h-4 mr-2" />
              We have 24/7 supported team
            </p>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Safe Money with
              <span className="text-orange-300"> MoneyPro</span>
              <br />Since 2011
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-lg">
              MoneyPro is an investment company, whose team is working on making money from the volatility of cryptocurrencies and offer great returns to our clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex max-w-md">
                <Input
                  type="email"
                  placeholder="Enter email*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-6 py-4 rounded-l-full text-gray-700 border-none focus:ring-2 focus:ring-orange-500"
                />
                <Button
                  onClick={handleStartInvest}
                  className="moneypro-button-accent px-8 py-4 rounded-r-full font-semibold"
                >
                  Start Invest
                </Button>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600"
              alt="Professional investment team"
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
            
            {/* Floating Cards */}
            <div className="absolute -bottom-4 -left-4 bg-white p-6 rounded-xl shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="text-purple-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Profit</p>
                  <p className="text-2xl font-bold text-purple-600">$542K</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 bg-orange-500 text-white p-4 rounded-xl shadow-xl">
              <div className="text-center">
                <p className="text-sm">ROI</p>
                <p className="text-2xl font-bold">8.5%</p>
              </div>
            </div>
            
            <div className="absolute top-1/4 -left-8 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-xs text-gray-600">Secured</p>
                  <p className="text-sm font-bold text-gray-900">100%</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-1/4 -right-8 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-xs text-gray-600">Returns</p>
                  <p className="text-sm font-bold text-gray-900">Daily</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
