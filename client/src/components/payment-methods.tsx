import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Wallet, 
  Bitcoin, 
  Banknote,
  DollarSign,
  Euro
} from "lucide-react";

const paymentMethods = [
  { icon: CreditCard, name: "Visa", color: "text-blue-600" },
  { icon: CreditCard, name: "Mastercard", color: "text-red-600" },
  { icon: Wallet, name: "PayPal", color: "text-blue-500" },
  { icon: Bitcoin, name: "Bitcoin", color: "text-yellow-500" },
  { icon: CreditCard, name: "Stripe", color: "text-purple-600" },
  { icon: DollarSign, name: "Amazon Pay", color: "text-yellow-600" },
  { icon: Euro, name: "SEPA", color: "text-blue-800" },
  { icon: Banknote, name: "Wire Transfer", color: "text-green-600" },
  { icon: Wallet, name: "Skrill", color: "text-purple-500" },
  { icon: Wallet, name: "Neteller", color: "text-green-500" },
  { icon: CreditCard, name: "American Express", color: "text-blue-700" },
  { icon: Wallet, name: "Perfect Money", color: "text-red-500" }
];

export default function PaymentMethods() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Payment We Accept</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We accept all major banking and fiat payment methods to make your investment process easier with our platform.
          </p>
          <p className="text-orange-500 text-sm font-semibold mb-8 uppercase tracking-wide">
            We Accepted These Payment Methods
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center mb-12">
          {paymentMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div 
                key={index}
                className="w-20 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-300 cursor-pointer group"
              >
                <Icon className={`text-3xl ${method.color} group-hover:scale-110 transition-transform duration-300`} />
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <Button 
            className="moneypro-button-primary px-8 py-3 font-semibold text-lg"
            onClick={() => window.location.href = "/login"}
          >
            Invest Now
          </Button>
        </div>
      </div>
    </section>
  );
}
