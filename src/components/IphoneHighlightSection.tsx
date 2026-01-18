import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import imgIphone from "@/assets/Troca de Tela.webp";

const IphoneHighlightSection = () => {
  const whatsappLink =
    "https://wa.me/5531990742171?text=Olá! Gostaria de um orçamento para substituição de tela.";

  return (
    <section className="pt-8 pb-28 md:pt-16 md:pb-28">
      <div className="container">
        <div
          data-testid="iphone-highlight-card"
          className="relative overflow-visible rounded-[2rem] bg-[#18181b] text-white shadow-2xl"
        >
          <div className="px-8 py-12 md:px-16 md:py-16 flex flex-col justify-center gap-10 md:min-h-[380px] lg:min-h-[420px]">
            <div className="w-full md:max-w-lg space-y-6">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight tracking-tight">
                Seu iPhone com tela nova, sem perder a experiência original.
              </h2>
              <p className="text-base md:text-lg text-zinc-300 max-w-xl">
                Unimos diagnóstico técnico, peças selecionadas e acabamento de laboratório para renovar a tela
                do seu iPhone com segurança, garantia real e resultado de padrão premium.
              </p>
              <div>
                <Button
                  asChild
                  size="lg"
                  className="gap-2 text-sm md:text-base px-8 py-4 rounded-full bg-gradient-to-r from-[#9C5A3C] to-[#B46E45] border-none text-white hover:opacity-95"
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="h-5 w-5" />
                    Solicitar orçamento agora
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <img
            src={imgIphone}
            alt="iPhone com tela substituída"
            loading="lazy"
            className="mx-auto mt-4 md:mt-0 md:absolute md:bottom-0 md:right-6 w-[320px] sm:w-[360px] md:w-[490px] lg:w-[520px] h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default IphoneHighlightSection;
