import { ArrowRight, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-iphone.png";

const HeroSection = () => {
  const whatsappLink = "https://wa.me/5531999999999?text=Olá! Gostaria de um orçamento para troca de tela.";

  return (
    <section className="relative min-h-screen flex items-center bg-dark-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container relative z-10 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-gray-300 text-sm font-medium mb-6 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Atendimento em Belo Horizonte
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Tela Quebrada?
              <br />
              <span className="text-gray-400">Renovamos seu iPhone.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Troca de vidro e substituição de tela com peças de alta qualidade. 
              Atendimento rápido e garantia em todos os serviços.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Button
                asChild
                size="lg"
                className="gap-2 text-base px-8 py-6 bg-primary-foreground text-primary hover:bg-gray-200 shadow-button"
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  Solicitar Orçamento
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base px-8 py-6 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-primary-foreground"
              >
                <a href="#servicos">Ver Serviços</a>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start mt-10 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2 text-gray-400">
                <Shield className="h-5 w-5" />
                <span className="text-sm">Garantia de 90 dias</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="h-5 w-5" />
                <span className="text-sm">Entrega em 1h</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Award className="h-5 w-5" />
                <span className="text-sm">+500 telas trocadas</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <img
                src={heroImage}
                alt="iPhone com tela quebrada"
                className="w-full max-w-md lg:max-w-lg animate-float"
              />
              {/* Floating Card */}
              <div className="absolute -left-4 bottom-20 bg-background rounded-2xl p-4 shadow-2xl animate-fade-up hidden sm:block" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Peças originais</p>
                    <p className="text-sm text-muted-foreground">Qualidade garantida</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L1440 120L1440 60C1440 60 1140 0 720 0C300 0 0 60 0 60L0 120Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
