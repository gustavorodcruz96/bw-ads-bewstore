import { Shield, Clock, Wrench, CreditCard, MapPin, ThumbsUp } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Garantia real em serviços",
    description: "Garantia documentada em todos os serviços realizados na B&W Store.",
  },
  {
    icon: Clock,
    title: "Agilidade no atendimento",
    description: "Atendimento rápido, com horário agendado para sua maior comodidade.",
  },
  {
    icon: Wrench,
    title: "Saúde 100%",
    description: "Utilizamos apenas baterias com capacidade original e alta durabilidade.",
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
    title: "Clientes satisfeitos",
    description: "Atendimento focado em resolver o problema e explicar cada etapa.",
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            Por que escolher a B&W Store?
          </h2>
          <p className="text-lg text-muted-foreground">
            Compromisso com qualidade, agilidade e a satisfação do cliente.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group h-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <article className="flex h-full flex-col rounded-3xl bg-card/90 border border-border/60 shadow-card px-6 py-6 text-left transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg sm:h-auto md:h-[230px] lg:h-[260px] overflow-hidden">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md self-start">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <div className="mt-auto flex w-full flex-col gap-2 overflow-y-auto">
                  <h3 className="text-base md:text-lg font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
