import { Button } from "@/components/ui/button";
import { Award, PiggyBank } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-orange-500 text-sm font-semibold mb-4 uppercase tracking-wide">
              About us
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About MoneyPro</h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              MoneyPro is plastered cheeky loo what a plonker some dodgy chav a barney wellies, gutted mate quaint the little rotter pardon.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Licensed & Certified
                  </h3>
                  <p className="text-gray-600">
                    We are ipsum dolor sit amet, consectetur adipiscing elit dunt ut labore et dolore magna.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <PiggyBank className="text-orange-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Saving & Investment
                  </h3>
                  <p className="text-gray-600">
                    We are ipsum dolor sit amet, consectetur adipiscing elit dunt ut labore et dolore magna.
                  </p>
                </div>
              </div>
            </div>
            
            <Button className="mt-8 moneypro-button-primary">
              Find out More
            </Button>
          </div>
          
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600"
              alt="Investment analysis dashboard"
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
