import { Shield, Clock, Wrench, CreditCard, MapPin, ThumbsUp } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Garantia de 90 Dias",
    description: "Todos os serviços incluem garantia total de 90 dias para sua tranquilidade.",
  },
  {
    icon: Clock,
    title: "Troca Expressa",
    description: "Substituição de tela em até 1 hora. Não fique sem seu aparelho.",
  },
  {
    icon: Wrench,
    title: "Peças Premium",
    description: "Utilizamos apenas peças de alta qualidade com certificação.",
  },
  {
    icon: CreditCard,
    title: "Parcelamento",
    description: "Parcelamos em até 12x no cartão. Aceitamos Pix com desconto.",
  },
  {
    icon: MapPin,
    title: "Centro de BH",
    description: "Localização privilegiada no centro de Belo Horizonte, fácil acesso.",
  },
  {
    icon: ThumbsUp,
    title: "+500 Clientes",
    description: "Mais de 500 clientes satisfeitos com avaliação 5 estrelas.",
  },
];

const BenefitsSection = () => {
  return (
    <section id="beneficios" className="py-20 md:py-28 bg-secondary">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Diferenciais
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Por que escolher a B&W Store?
          </h2>
          <p className="text-lg text-muted-foreground">
            Compromisso com qualidade, agilidade e a satisfação do cliente.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="text-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-background shadow-card mb-6 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="h-8 w-8 text-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
