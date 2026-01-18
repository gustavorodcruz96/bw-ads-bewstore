import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BewSection from "@/components/BewSection";
import BenefitsSection from "@/components/BenefitsSection";
import SpecialistsSection from "@/components/SpecialistsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import VideosSection from "@/components/VideosSection";
import IphoneHighlightSection from "@/components/IphoneHighlightSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <BewSection />
      <BenefitsSection />
      <SpecialistsSection />
      <VideosSection />
      <TestimonialsSection />
      <IphoneHighlightSection />
      <CTASection />
      <Footer />

      <a
        href="https://wa.me/5531990742171?text=Olá! Gostaria de um orçamento para substituição de tela."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar com a B&W Store pelo WhatsApp"
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] bg-gradient-to-tr from-emerald-400 to-emerald-700 hover:from-emerald-500 hover:to-emerald-800 shadow-lg shadow-black/20 flex items-center justify-center transition-colors transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-background"
      >
        <WhatsAppIcon className="w-7 h-7 md:w-8 md:h-8 text-white" />
      </a>
    </main>
  );
};

export default Index;
