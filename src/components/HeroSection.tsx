import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import heroImage from "@/assets/bateria-bew-devices.webp";

const HeroSection = () => {
  const whatsappLink =
    "https://wa.me/5531990742171?text=Ol%C3%A1%2C%20vi%20o%20an%C3%BAncio%20e%20quero%20um%20or%C3%A7amento%20de%20troca%20da%20bateria%20do%20meu%20aparelho%20Apple%21%20%23BT25B";

  return (
    <section className="relative flex items-center bg-dark-gradient overflow-hidden pt-20 pb-16 md:py-0 h-auto min-h-[820px] md:h-[1000px]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container relative z-10 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-gray-300 text-sm font-medium mb-6 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Atendimento em Belo Horizonte
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-primary-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Bateria Viciada?
              <br />
              <span className="text-gray-400">Recupere a Autonomia.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Substituição de bateria com peças de alta qualidade. 
              Atendimento rápido e garantia de performance original.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Button
                asChild
                size="lg"
                className="gap-2 text-base px-8 py-6"
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="h-5 w-5" />
                  Solicitar Orçamento
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

           
          </div>

          {/* Image */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <img
                src={heroImage}
                alt="iPhone com bateria nova"
                className="w-full max-w-md lg:max-w-lg opacity-80 brightness-75 saturate-50"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
