import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

const CTASection = () => {
  const whatsappLink =
    "https://wa.me/5531990742171?text=Olá! Gostaria de um orçamento para substituição de tela.";

  return (
    <section className="py-20 md:py-28 bg-dark-gradient relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-primary-foreground mb-6">
            Tela quebrada não precisa ser dor de cabeça
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Solicite seu orçamento agora mesmo pelo WhatsApp. 
            Resposta rápida e sem compromisso.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="gap-3 text-lg px-10 py-7"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-6 w-6" />
                Chamar no WhatsApp
              </a>
            </Button>
          </div>

          {/* Payment Methods */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm mb-4">Formas de pagamento</p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-sm font-medium">
                PIX
              </span>
              <span className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-sm font-medium">
                Cartão de Crédito
              </span>
              <span className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-sm font-medium">
                Cartão de Débito
              </span>
              <span className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-sm font-medium">
                Dinheiro
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
