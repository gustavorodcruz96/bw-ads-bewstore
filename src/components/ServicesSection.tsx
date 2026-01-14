import { Smartphone, Tablet, Watch, Laptop, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Smartphone,
    title: "Troca de Tela iPhone",
    description: "Substituição completa da tela com peças de alta qualidade para todos os modelos de iPhone.",
    devices: ["iPhone 15 Pro Max", "iPhone 14", "iPhone 13", "iPhone 12", "E mais..."],
  },
  {
    icon: Smartphone,
    title: "Troca de Vidro",
    description: "Renovação apenas do vidro frontal, mantendo o display original do seu aparelho.",
    devices: ["iPhone 15", "iPhone 14 Pro", "iPhone 13 Pro", "iPhone SE", "E mais..."],
  },
  {
    icon: Tablet,
    title: "Tela para iPad",
    description: "Substituição de tela e vidro para todas as linhas de iPad com qualidade premium.",
    devices: ["iPad Pro", "iPad Air", "iPad Mini", "iPad 10ª geração"],
  },
  {
    icon: Watch,
    title: "Vidro Apple Watch",
    description: "Troca de vidro para Apple Watch com acabamento perfeito e resistência.",
    devices: ["Watch Ultra", "Series 9", "Series 8", "Watch SE"],
  },
];

const ServicesSection = () => {
  const whatsappLink = "https://wa.me/5531999999999?text=Olá! Gostaria de um orçamento para troca de tela.";

  return (
    <section id="servicos" className="py-20 md:py-28 bg-background">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Nossos Serviços
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Soluções completas para seu dispositivo
          </h2>
          <p className="text-lg text-muted-foreground">
            Trabalhamos com todos os modelos de iPhone, iPad e Apple Watch. 
            Peças de qualidade e mão de obra especializada.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative bg-card rounded-2xl p-8 shadow-card hover:shadow-xl transition-all duration-300 border border-border hover:border-gray-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.devices.map((device) => (
                      <span
                        key={device}
                        className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
                      >
                        {device}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button asChild size="lg" className="gap-2">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              Solicitar Orçamento Grátis
              <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
