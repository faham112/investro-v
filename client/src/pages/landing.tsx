import LandingNavbar from "@/components/landing-navbar";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import AboutSection from "@/components/about-section";
import HowItWorks from "@/components/how-it-works";
import StatisticsSection from "@/components/statistics-section";
import InvestmentPlans from "@/components/investment-plans";
import ProfitCalculator from "@/components/profit-calculator";
import TransactionsSection from "@/components/transactions-section";
import TeamSection from "@/components/team-section";
import PaymentMethods from "@/components/payment-methods";
import Footer from "@/components/footer";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <HowItWorks />
      <StatisticsSection />
      <InvestmentPlans />
      <ProfitCalculator />
      <TransactionsSection />
      <TeamSection />
      <PaymentMethods />
      <Footer />
    </div>
  );
}
