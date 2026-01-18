import { ArrowRight, Award, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import especialistaMain from "@/assets/especialista-01.webp";
import especialistaSecondary from "@/assets/especialista.webp";

const SpecialistsSection = () => {
  const whatsappLink =
    "https://wa.me/5531990742171?text=Olá! Gostaria de um orçamento para substituição de tela.";

  return (
    <section
      id="especialistas"
      className="relative py-20 md:py-28 bg-gradient-to-b from-background via-background to-secondary/20 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="mx-auto mt-10 h-64 w-full max-w-4xl rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container relative">
        <div className="max-w-2xl md:max-w-3xl mx-auto text-center mb-14">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Equipe especialista
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-4">
            Técnicos que tratam seu aparelho como peça única
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Na B&amp;W Store, seu dispositivo é atendido por profissionais dedicados a
            reparos de tela, com processos refinados e cuidado de laboratório em
            cada etapa do serviço.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr,1.1fr] items-stretch">
          <div
            data-testid="specialists-content-1"
            className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-[2rem] p-8 md:p-12 flex flex-col justify-between shadow-2xl shadow-black/5 hover:shadow-black/10 transition-shadow duration-500"
          >
            <div className="max-w-xl">
              <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
                Diagnóstico preciso antes de qualquer decisão
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                Cada atendimento começa com um exame completo do aparelho: brilho,
                toque, cores e estrutura. Assim, você entende exatamente o que
                está acontecendo e escolhe o melhor caminho com segurança.
              </p>
              <ul className="space-y-4 text-base text-muted-foreground">
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  Avaliação técnica minuciosa antes da substituição de tela
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  Explicação transparente sobre riscos, peças e investimento
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  Ajustes finos para preservar a experiência original de fábrica
                </li>
              </ul>
            </div>
            
            <div className="mt-10 flex flex-wrap gap-3 text-xs md:text-sm font-medium">
              <span className="inline-flex items-center rounded-full bg-secondary/80 px-4 py-2.5 text-secondary-foreground backdrop-blur-sm border border-secondary">
                <Award className="mr-2 h-4 w-4 text-primary" />
                Técnicos especialistas
              </span>
              <span className="inline-flex items-center rounded-full bg-secondary/80 px-4 py-2.5 text-secondary-foreground backdrop-blur-sm border border-secondary">
                <Shield className="mr-2 h-4 w-4 text-primary" />
                Laboratório equipado
              </span>
              <span className="inline-flex items-center rounded-full bg-secondary/80 px-4 py-2.5 text-secondary-foreground backdrop-blur-sm border border-secondary">
                <Clock className="mr-2 h-4 w-4 text-primary" />
                Processo padronizado
              </span>
            </div>
          </div>

          <div
            data-testid="specialists-image-1"
            className="relative group"
          >
            <div className="bg-gradient-to-br from-secondary via-muted to-background rounded-[2rem] p-2 h-full shadow-2xl shadow-black/10 transition-transform duration-500 group-hover:scale-[1.02]">
              <div className="relative h-full w-full overflow-hidden rounded-[1.5rem]">
                <img
                  src={especialistaMain}
                  alt="Técnico especialista B&W realizando diagnóstico em dispositivo"
                  loading="lazy"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              </div>
            </div>
            <div className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-md text-zinc-900 text-xs font-bold shadow-xl absolute -bottom-6 left-8 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Equipe especialista B&amp;W Store
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 items-center">
          <div
            data-testid="specialists-content-2"
            className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-[2rem] p-8 md:p-12 flex flex-col justify-center h-full shadow-xl shadow-black/5 order-1 md:order-2"
          >
            <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
              Acompanhamento próximo antes, durante e depois do serviço
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg mb-8">
              Da primeira mensagem à retirada do aparelho, você fala sempre com
              alguém que entende o problema. Cada etapa é explicada com clareza,
              para que você acompanhe o processo, tire dúvidas e saia seguro com
              o resultado.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50">
                <div className="mt-1 bg-primary/10 p-2 rounded-full">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Transparência total</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Você sabe exatamente o que será feito no seu aparelho.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50">
                <div className="mt-1 bg-primary/10 p-2 rounded-full">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Pós-venda ativo</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Garantia real e suporte contínuo após a entrega.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            data-testid="specialists-image-2"
            className="relative group h-full min-h-[400px] order-2 md:order-1"
          >
            <div className="bg-gradient-to-tr from-background via-muted to-secondary rounded-[2rem] p-2 h-full shadow-2xl shadow-black/10 transition-transform duration-500 group-hover:scale-[1.02]">
              <div className="relative h-full w-full overflow-hidden rounded-[1.5rem]">
                <img
                  src={especialistaSecondary}
                  alt="Técnico B&W em atendimento especializado ao cliente"
                  loading="lazy"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            asChild
            size="lg"
            className="px-10 py-7 text-lg gap-2"
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-5 w-5" />
              Solicitar orçamento
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SpecialistsSection;
