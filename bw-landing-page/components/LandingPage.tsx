/**
 * LandingPage - Módulo exportável da landing page completa da B&W Store.
 *
 * Uso:
 *   import LandingPage from "@/components/LandingPage";
 *   <LandingPage />
 *
 * Inclui todas as seções, imagens, vídeos, cores e interações.
 */

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

const WHATSAPP_LINK =
  "https://wa.me/5531990742171?text=Ol%C3%A1%2C%20vi%20o%20an%C3%BAncio%20e%20quero%20um%20or%C3%A7amento%20de%20troca%20da%20bateria%20do%20meu%20aparelho%20Apple%21%20%23BT25B";

const LandingPage = () => {
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

      {/* Floating WhatsApp Button */}
      <a
        href={WHATSAPP_LINK}
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

export default LandingPage;

// Named exports for uso individual de cada seção
export {
  Header,
  HeroSection,
  ServicesSection,
  BewSection,
  BenefitsSection,
  SpecialistsSection,
  TestimonialsSection,
  VideosSection,
  IphoneHighlightSection,
  CTASection,
  Footer,
  WhatsAppIcon,
  WHATSAPP_LINK,
};
