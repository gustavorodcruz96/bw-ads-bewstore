"use client";

import { useEffect, useState } from "react";
import { captureUTMs, buildHelenaWhatsAppURL } from "@/lib/utm";
import { trackViewContent, trackClickButton } from "@/lib/tracking";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import {
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  Clock,
  Award,
  Smartphone,
} from "lucide-react";

// Wrapper para usar WhatsAppIcon como ícone de benefit
function WhatsAppBenefitIcon({ className }: { className?: string }) {
  return <img src="/whatsapp.svg" alt="WhatsApp" className={`${className} invert brightness-200`} />;
}

const BENEFITS = [
  {
    icon: Shield,
    title: "Garantia de 90 dias",
    description: "Todos os aparelhos com garantia real da Bew Store",
  },
  {
    icon: CheckCircle,
    title: "Procedência verificada",
    description: "IMEI limpo, sem bloqueio, pronto para uso",
  },
  {
    icon: WhatsAppBenefitIcon,
    title: "Atendimento via WhatsApp",
    description: "Nossos consultores ajudam você a escolher o iPhone ideal",
  },
  {
    icon: Award,
    title: "Nota 4.9 no Google",
    description: "Mais de 500 clientes satisfeitos em BH",
  },
];

const TESTIMONIALS = [
  {
    name: "Mariana S.",
    text: "Comprei meu iPhone 13 e veio impecável! Parece novo. Super recomendo a Bew Store.",
    rating: 5,
  },
  {
    name: "Lucas P.",
    text: "Atendimento incrível pelo WhatsApp. Me ajudaram a escolher o melhor modelo pro meu uso.",
    rating: 5,
  },
  {
    name: "Fernanda R.",
    text: "Melhor preço de BH com certeza. E a garantia me deixou tranquila pra comprar.",
    rating: 5,
  },
];

export default function LandingPage() {
  const [whatsappUrl, setWhatsappUrl] = useState("");

  useEffect(() => {
    const utmData = captureUTMs();
    setWhatsappUrl(buildHelenaWhatsAppURL(utmData));
    trackViewContent();
  }, []);

  const handleWhatsAppClick = () => {
    trackClickButton();
  };

  const fallbackUrl =
    "https://api.helena.run/chat/v1/channel/wa/5531990742171?text=Ol%C3%A1!%20Vi%20o%20an%C3%BAncio%20e%20quero%20saber%20mais%20sobre%20os%20iPhones%20seminovos!%20%F0%9F%93%B1&utm_source=tiktok&utm_medium=cpc";

  return (
    <main className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative flex items-center bg-dark-gradient overflow-hidden min-h-[90vh]">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container relative z-10 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <img
              src="/bew-logo.png"
              alt="Bew Store"
              className="h-12 md:h-14 w-auto mx-auto mb-6 animate-fade-up"
            />
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-gray-300 text-sm font-medium mb-6 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-[#D2A89B] animate-pulse" />
              iPhones Seminovos em BH
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-up">
              Seu próximo iPhone
              <br />
              <span className="text-gray-400">está aqui.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto animate-fade-up">
              iPhones seminovos com garantia, procedência verificada e os
              melhores preços de Belo Horizonte. Fale com nosso especialista e
              encontre o modelo perfeito pra você.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up">
              <Button
                asChild
                size="lg"
                className="gap-3 text-lg px-10 py-7 text-white shadow-lg"
                onClick={handleWhatsAppClick}
              >
                <a
                  href={whatsappUrl || fallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="h-6 w-6" />
                  Falar com Especialista
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-12 text-gray-400 text-sm animate-fade-up">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-white/60" /> Garantia 90 dias
              </span>
              <span className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-white/60" /> IMEI verificado
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/60" /> Atendimento rápido
              </span>
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" /> 4.9 no Google
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Como funciona?
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Em 3 passos simples você encontra seu iPhone ideal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Fale conosco",
                description:
                  "Clique no botão do WhatsApp e conte o que você procura: modelo, cor, armazenamento.",
              },
              {
                step: "2",
                title: "Receba opções",
                description:
                  "Nosso especialista apresenta as melhores opções disponíveis com fotos e detalhes.",
              },
              {
                step: "3",
                title: "Feche o negócio",
                description:
                  "Escolha seu iPhone, combine a forma de pagamento e receba com garantia.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
                  <span className="text-xl font-bold text-white/80">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-16 md:py-24 bg-dark-gradient">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Por que comprar na Bew Store?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-white/60" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              O que nossos clientes dizem
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-card rounded-xl border border-gray-800 p-6"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 text-sm italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <p className="text-white font-medium text-sm">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 md:py-28 bg-dark-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Pronto pra trocar de iPhone?
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Fale com nosso especialista agora pelo WhatsApp. Sem compromisso,
              sem pressão — só as melhores opções pra você.
            </p>

            <Button
              asChild
              size="lg"
              className="gap-3 text-lg px-10 py-7 text-white shadow-lg"
              onClick={handleWhatsAppClick}
            >
              <a
                href={whatsappUrl || fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="h-6 w-6" />
                Chamar no WhatsApp
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>

            <div className="mt-12 pt-8 border-t border-gray-800">
              <p className="text-gray-500 text-sm mb-4">Formas de pagamento</p>
              <div className="flex flex-wrap justify-center gap-3">
                {["PIX", "Cartão de Crédito", "Cartão de Débito", "Parcelado"].map(
                  (method) => (
                    <span
                      key={method}
                      className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-sm font-medium"
                    >
                      {method}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-background border-t border-gray-800">
        <div className="container text-center">
          <p className="text-gray-500 text-sm">
            Bew Store - iPhones Seminovos com Garantia | Belo Horizonte - MG
          </p>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href={whatsappUrl || fallbackUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar com a Bew Store pelo WhatsApp"
        onClick={handleWhatsAppClick}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] shadow-lg shadow-green-900/40 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-green-800/50"
      >
        <WhatsAppIcon className="w-7 h-7 md:w-8 md:h-8 text-white" />
      </a>
    </main>
  );
}
