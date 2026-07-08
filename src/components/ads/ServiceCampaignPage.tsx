"use client";

import { useEffect, useRef, useState } from "react";
import type { StaticImageData } from "next/image";
import { captureUTMs, buildHelenaWhatsAppURL } from "@/lib/utm";
import { trackClickButton, trackViewContent } from "@/lib/tracking";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import {
  ArrowRight,
  Award,
  Battery,
  CheckCircle,
  ChevronDown,
  Clock,
  CreditCard,
  Instagram,
  MapPin,
  Menu,
  Monitor,
  Phone,
  Search,
  Shield,
  Smartphone,
  Star,
  Tablet,
  ThumbsUp,
  Watch,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";

import bewLogo from "@/assets/bew-logo.png";
import storeImg42 from "@/assets/imgi_42_2025-04-03.webp";
import storeImg44 from "@/assets/imgi_44_2025-04-03.webp";
import storeImg70 from "@/assets/imgi_70_unnamed.webp";
import storeImg74 from "@/assets/imgi_74_unnamed.webp";
import iPadBattery from "@/assets/ipad-batery.webp";
import deviceGlassSet from "@/assets/bg-bew-telas.webp";
import deviceGlassSetAlt from "@/assets/capa-bg-bew.webp";
import watchGlass from "@/assets/Vidro Apple Watch.webp";
import appleWatchGlassHero from "@/assets/generated-campaigns/apple-watch-glass-hero.webp";
import iPadGlassHero from "@/assets/generated-campaigns/ipad-glass-hero.webp";
import iPadMaintenanceHero from "@/assets/generated-campaigns/ipad-maintenance-hero.webp";
import iPadScreenHero from "@/assets/generated-campaigns/ipad-screen-hero.webp";

type Variant =
  | "ipad-maintenance"
  | "apple-watch-glass";

type ServiceItem = {
  title: string;
  description: string;
  image: StaticImageData;
  icon: LucideIcon;
  colSpan: string;
  rowSpan: string;
};

type CampaignConfig = {
  contentId: string;
  contentName: string;
  whatsappMessage: string;
  badge: string;
  heroAlt: string;
  heroImage: StaticImageData;
  heroLines: [string, string, string];
  heroDescription: string;
  proof: string[];
  servicesLead: string;
  services: ServiceItem[];
  midCtaImage: StaticImageData;
  midCtaTitle: string;
  midCtaDescription: string;
  howLead: string;
  experienceCopy: [string, string];
  specialistTitle: string;
  specialistDescription: string;
  specialistBullets: string[];
  highlightImage: StaticImageData;
  highlightTitle: [string, string];
  highlightDescription: string;
  footerTitle: string;
  footerServices: string[];
  finalQuestion: string;
  legalDevices: string;
  faqs: { q: string; a: string }[];
  testimonials: { name: string; role: string; content: string; rating: number }[];
};

const STORE_IMAGES = [storeImg42, storeImg44, storeImg70, storeImg74];

const COMMON_BENEFITS = [
  {
    icon: Shield,
    title: "Condições documentadas",
    description: "Prazo, valores e condições do serviço são informados antes da aprovação.",
  },
  {
    icon: Clock,
    title: "Atendimento ágil",
    description: "Primeira avaliação pelo WhatsApp e orientação clara sobre prazo.",
  },
  {
    icon: Wrench,
    title: "Processo técnico",
    description: "Equipamento avaliado por equipe técnica em atendimento presencial.",
  },
  {
    icon: CreditCard,
    title: "Parcelamento",
    description: "Pagamento em Pix, débito, crédito e parcelamento no cartão.",
  },
  {
    icon: MapPin,
    title: "Savassi, BH",
    description: "Atendimento na Rua Alagoas, 1050, em Belo Horizonte.",
  },
  {
    icon: ThumbsUp,
    title: "4.9 no Google",
    description: "Mais de 500 clientes atendidos com cuidado e transparência.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    icon: WhatsAppIcon,
    title: "Fale no WhatsApp",
    description: "Conte o modelo e o que aconteceu. Nossa equipe já orienta os próximos passos.",
  },
  {
    step: "2",
    icon: Search,
    title: "Avaliação técnica",
    description: "Confirmamos a necessidade real do serviço antes de qualquer procedimento.",
  },
  {
    step: "3",
    icon: Wrench,
    title: "Execução cuidadosa",
    description: "Você aprova a proposta e o equipamento segue para o laboratório.",
  },
  {
    step: "4",
    icon: CheckCircle,
    title: "Entrega testada",
    description: "O dispositivo passa por testes finais e recebe as condições documentadas do serviço.",
  },
];

const CAMPAIGNS: Record<Variant, CampaignConfig> = {
  "ipad-maintenance": {
    contentId: "ipad-maintenance-lp",
    contentName: "Manutencao Vidro e Tela iPad - Landing Page",
    whatsappMessage:
      "Olá! Gostaria de um orçamento para manutenção, troca de vidro ou troca de tela do meu iPad! #GIPAD1",
    badge: "Manutenção, vidro e tela de iPad em BH",
    heroAlt: "Manutenção, troca de vidro e troca de tela de iPad",
    heroImage: iPadMaintenanceHero,
    heroLines: ["Manutenção de iPad,", "vidro e tela", "com avaliação local."],
    heroDescription:
      "Diagnóstico técnico, troca de vidro e troca de tela de iPad com proposta transparente e atendimento presencial na Savassi.",
    proof: ["Troca de vidro", "Troca de tela", "Avaliação técnica"],
    servicesLead:
      "Uma página única para cuidar do seu iPad: manutenção, vidro quebrado, tela falhando e avaliação completa.",
    services: [
      {
        title: "Troca de Vidro",
        description: "Para vidro trincado ou quebrado, com avaliação de touch e acabamento.",
        image: iPadGlassHero,
        icon: Tablet,
        colSpan: "md:col-span-1",
        rowSpan: "md:row-span-2",
      },
      {
        title: "Troca de Tela",
        description: "Para falhas de imagem, manchas, linhas, touch irregular ou impacto.",
        image: iPadScreenHero,
        icon: Monitor,
        colSpan: "md:col-span-2",
        rowSpan: "md:row-span-1",
      },
      {
        title: "Manutenção Técnica",
        description: "Correção de bateria, conector, áudio, botões, câmeras e falhas gerais.",
        image: iPadBattery,
        icon: Wrench,
        colSpan: "md:col-span-1",
        rowSpan: "md:row-span-1",
      },
      {
        title: "Diagnóstico Completo",
        description: "Confirmamos se o caso é vidro, tela, conjunto frontal ou outro procedimento.",
        image: deviceGlassSet,
        icon: Search,
        colSpan: "md:col-span-1",
        rowSpan: "md:row-span-1",
      },
    ],
    midCtaImage: iPadMaintenanceHero,
    midCtaTitle: "Não sabe se é vidro, tela ou manutenção?",
    midCtaDescription:
      "Envie o modelo e fotos pelo WhatsApp. A equipe orienta se é troca de vidro, troca de tela ou outro procedimento.",
    howLead: "Do WhatsApp ao iPad pronto, com clareza em cada etapa.",
    experienceCopy: [
      "Na B&W Store, seu iPad passa por uma triagem cuidadosa antes do orçamento. Você entende se o caso é vidro, tela, bateria, conector ou outro procedimento antes de aprovar.",
      "O atendimento acontece em ambiente técnico organizado, com comunicação direta pelo WhatsApp e orçamento antes de qualquer procedimento.",
    ],
    specialistTitle: "Equipe técnica para iPad",
    specialistDescription:
      "Avaliamos o conjunto do aparelho para evitar troca desnecessária de peças e indicar o procedimento mais adequado: vidro, tela ou manutenção.",
    specialistBullets: [
      "Teste de vidro, tela, touch, bateria e conectores",
      "Proposta detalhada antes do procedimento",
      "Entrega com testes finais e condições documentadas",
    ],
    highlightImage: iPadMaintenanceHero,
    highlightTitle: ["Seu iPad funcionando de novo,", "com segurança."],
    highlightDescription:
      "Diagnóstico profissional, troca de vidro, troca de tela e manutenção de iPad em Belo Horizonte.",
    footerTitle: "iPad",
    footerServices: [
      "Manutenção de iPad",
      "Troca de vidro",
      "Troca de tela",
      "Bateria e conector",
      "Áudio, botões e câmeras",
      "Check-up completo",
    ],
    finalQuestion: "Seu iPad precisa de manutenção, vidro ou tela?",
    legalDevices: "Apple e iPad são marcas registradas da Apple Inc.",
    faqs: [
      {
        q: "Vocês fazem manutenção, troca de vidro e troca de tela de iPad?",
        a: "Sim. Atendemos manutenção de iPad, troca de vidro e troca de tela, sempre com avaliação do modelo e da condição do aparelho antes da proposta.",
      },
      {
        q: "Como sei se preciso trocar vidro ou tela?",
        a: "Depende do dano. Se a imagem e o touch estiverem preservados, pode ser caso de vidro. Se houver falha de imagem, manchas ou touch irregular, pode envolver tela ou conjunto frontal.",
      },
      {
        q: "A avaliação tem compromisso?",
        a: "Não. Você recebe a proposta antes de aprovar qualquer procedimento.",
      },
      {
        q: "Como são informadas as condições do serviço?",
        a: "Antes de aprovar, você recebe a proposta com escopo, prazo e condições aplicáveis ao procedimento.",
      },
      {
        q: "Onde fica a loja?",
        a: "Rua Alagoas, 1050, Savassi, Belo Horizonte - MG. O atendimento inicial é feito pelo WhatsApp.",
      },
    ],
    testimonials: [
      {
        name: "Marina P.",
        role: "iPad Air",
        content:
          "Meu iPad voltou a funcionar perfeitamente. O atendimento foi claro desde o orçamento.",
        rating: 5,
      },
      {
        name: "Henrique L.",
        role: "iPad Pro",
        content:
          "Achei que teria que trocar tudo, mas fizeram a avaliação correta e explicaram cada opção.",
        rating: 5,
      },
      {
        name: "Paula R.",
        role: "iPad mini",
        content:
          "Atendimento rápido pelo WhatsApp e muita transparência no prazo.",
        rating: 5,
      },
    ],
  },
  "apple-watch-glass": {
    contentId: "apple-watch-glass-lp",
    contentName: "Troca de Vidro Apple Watch - Landing Page",
    whatsappMessage:
      "Olá! Gostaria de um orçamento para troca de vidro do meu Apple Watch! #GAW1",
    badge: "Vidro Apple Watch em BH",
    heroAlt: "Troca de vidro de Apple Watch",
    heroImage: appleWatchGlassHero,
    heroLines: ["Vidro do Watch", "quebrou?", "avaliação local."],
    heroDescription:
      "Troca de vidro de Apple Watch com avaliação técnica, acabamento cuidadoso e orientação pelo WhatsApp.",
    proof: ["Avaliação sem compromisso", "Atendimento presencial", "Condições documentadas"],
    servicesLead:
      "Apple Watch exige atenção a vedação, touch e acabamento. A avaliação vem primeiro.",
    services: [
      {
        title: "Troca de Vidro",
        description: "Substituição do vidro conforme série, tamanho e condição do Watch.",
        image: appleWatchGlassHero,
        icon: Watch,
        colSpan: "md:col-span-1",
        rowSpan: "md:row-span-2",
      },
      {
        title: "Teste de Touch",
        description: "Verificação de resposta ao toque e estabilidade após o procedimento.",
        image: watchGlass,
        icon: CheckCircle,
        colSpan: "md:col-span-2",
        rowSpan: "md:row-span-1",
      },
      {
        title: "Vedação",
        description: "Montagem cuidadosa para preservar encaixe e acabamento externo.",
        image: deviceGlassSetAlt,
        icon: Shield,
        colSpan: "md:col-span-1",
        rowSpan: "md:row-span-1",
      },
      {
        title: "Bateria e Carga",
        description: "Também avaliamos autonomia e carregamento quando necessário.",
        image: watchGlass,
        icon: Battery,
        colSpan: "md:col-span-1",
        rowSpan: "md:row-span-1",
      },
    ],
    midCtaImage: appleWatchGlassHero,
    midCtaTitle: "Pequeno no tamanho, exige procedimento cuidadoso.",
    midCtaDescription:
      "Envie fotos do Apple Watch pelo WhatsApp e receba orientação sobre vidro, tela e viabilidade do procedimento.",
    howLead: "Do orçamento ao teste final, tudo com cuidado técnico.",
    experienceCopy: [
      "O Apple Watch tem estrutura compacta e exige procedimento delicado. Por isso, avaliamos série, tamanho, touch e condição do vidro antes da proposta.",
      "A comunicação é direta pelo WhatsApp, com orientação clara sobre prazo, condições aplicáveis e cuidados depois do serviço.",
    ],
    specialistTitle: "Cuidado para Apple Watch",
    specialistDescription:
      "A troca de vidro precisa respeitar encaixe, touch e acabamento. Nossa avaliação identifica o melhor caminho antes do procedimento.",
    specialistBullets: [
      "Identificação da série e tamanho",
      "Avaliação de vidro, tela e touch",
      "Montagem cuidadosa e teste final",
    ],
    highlightImage: appleWatchGlassHero,
    highlightTitle: ["Seu Watch de volta", "ao uso diário."],
    highlightDescription:
      "Troca de vidro de Apple Watch com atendimento presencial em Belo Horizonte.",
    footerTitle: "Apple Watch",
    footerServices: [
      "Troca de vidro",
      "Avaliação de tela",
      "Teste de touch",
      "Vedação e acabamento",
      "Bateria e carga",
      "Check-up completo",
    ],
    finalQuestion: "O vidro do seu Apple Watch quebrou?",
    legalDevices: "Apple e Apple Watch são marcas registradas da Apple Inc.",
    faqs: [
      {
        q: "Vocês trocam vidro de Apple Watch?",
        a: "Sim, mediante avaliação do modelo, tamanho e condição do touch/tela.",
      },
      {
        q: "Preciso enviar a série do Watch?",
        a: "Ajuda bastante. Se não souber, envie fotos pelo WhatsApp que a equipe orienta.",
      },
      {
        q: "Troca só o vidro ou a tela inteira?",
        a: "Depende do dano. A avaliação mostra se o vidro é suficiente ou se há dano no conjunto.",
      },
      {
        q: "Como são informadas as condições do serviço?",
        a: "A proposta informa escopo, prazo e condições aplicáveis antes da aprovação.",
      },
      {
        q: "Onde fica a B&W Store?",
        a: "Rua Alagoas, 1050, Savassi, Belo Horizonte - MG.",
      },
    ],
    testimonials: [
      {
        name: "Daniela S.",
        role: "Apple Watch Series 8",
        content:
          "O vidro do meu Watch ficou com acabamento ótimo. Atendimento muito cuidadoso.",
        rating: 5,
      },
      {
        name: "Gustavo R.",
        role: "Apple Watch Ultra",
        content:
          "Enviei fotos pelo WhatsApp e já me orientaram certinho. Serviço transparente.",
        rating: 5,
      },
      {
        name: "Marcela D.",
        role: "Apple Watch SE",
        content:
          "Achei que não teria solução, mas avaliaram e explicaram as condições antes do serviço.",
        rating: 5,
      },
    ],
  },
};

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 transition-colors hover:border-white/20">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-6 text-left"
      >
        <span className="pr-4 text-[15px] font-medium text-white">{q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-500 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-sm leading-relaxed text-gray-400">{a}</p>
        </div>
      </div>
    </div>
  );
}

export function ServiceCampaignPage({ variant }: { variant: Variant }) {
  const config = CAMPAIGNS[variant];
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const utmData = captureUTMs();
    setWhatsappUrl(buildHelenaWhatsAppURL(utmData, config.whatsappMessage));
    trackViewContent({
      content_id: config.contentId,
      content_name: config.contentName,
    });
  }, [config]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 20);
      if (currentY <= 20) {
        setIsVisible(true);
      } else if (currentY > lastScrollY.current + 2) {
        setIsVisible(false);
      } else if (currentY < lastScrollY.current - 2) {
        setIsVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    STORE_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.src = src.src;
    });
    const interval = window.setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % STORE_IMAGES.length);
    }, 4000);
    return () => window.clearInterval(interval);
  }, []);

  const fallbackUrl = `https://api.helena.run/chat/v1/channel/wa/5531990742171?text=${encodeURIComponent(
    config.whatsappMessage
  )}&utm_source=google&utm_medium=cpc`;
  const ctaUrl = whatsappUrl || fallbackUrl;

  const handleWhatsAppClick = () => {
    trackClickButton({
      content_id: `whatsapp-cta-${config.contentId}`,
      content_name: `WhatsApp CTA - ${config.contentName}`,
    });
  };

  return (
    <main className="min-h-screen bg-black">
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "border-b border-white/5 bg-black/80 py-3 backdrop-blur-xl"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container flex items-center justify-between">
          <a href="#" className="flex items-center">
            <img src={bewLogo.src} alt="Bew Store" className="h-9" />
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {[
              { href: "#servicos", label: "Serviços" },
              { href: "#diferenciais", label: "Diferenciais" },
              { href: "#depoimentos", label: "Depoimentos" },
              { href: "#faq", label: "Dúvidas" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <Button asChild size="sm" className="h-widget-trigger gap-2" onClick={handleWhatsAppClick}>
              <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-4 w-4" />
                Consultar
              </a>
            </Button>
          </nav>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white md:hidden"
            aria-label="Abrir menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full border-b border-white/5 bg-black/95 backdrop-blur-xl md:hidden">
            <nav className="container flex flex-col gap-4 py-6">
              {[
                { href: "#servicos", label: "Serviços" },
                { href: "#diferenciais", label: "Diferenciais" },
                { href: "#depoimentos", label: "Depoimentos" },
                { href: "#faq", label: "Dúvidas" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="py-2 font-medium text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Button asChild className="h-widget-trigger mt-2 w-full gap-2" onClick={handleWhatsAppClick}>
                <a href={ctaUrl} target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
                  <WhatsAppIcon className="h-4 w-4" />
                  Falar com a equipe
                </a>
              </Button>
            </nav>
          </div>
        )}
      </header>

      <section className="relative flex min-h-[100vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={config.heroImage.src}
            alt={config.heroAlt}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        </div>

        <div className="container relative z-10 pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="max-w-2xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-gray-300 backdrop-blur-sm animate-fade-up">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              {config.badge}
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-white animate-fade-up md:text-5xl lg:text-6xl xl:text-7xl">
              {config.heroLines[0]}
              <br />
              {config.heroLines[1]}
              <br />
              <span className="text-[#D2A89B]">{config.heroLines[2]}</span>
            </h1>

            <p className="mb-10 max-w-lg text-lg leading-relaxed text-gray-300 animate-fade-up md:text-xl">
              {config.heroDescription}
            </p>

            <p className="mb-8 max-w-lg rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-xs leading-relaxed text-gray-400 backdrop-blur-sm animate-fade-up">
              B&W Store é uma empresa independente, sem vínculo com a Apple Inc. As marcas Apple, iPad e Apple Watch
              são usadas apenas para identificar modelos compatíveis com os serviços informados.
            </p>

            <div className="flex flex-col gap-4 animate-fade-up sm:flex-row">
              <Button asChild size="lg" className="h-widget-trigger gap-3 px-8 py-6 text-base" onClick={handleWhatsAppClick}>
                <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="h-5 w-5" />
                  Falar com a equipe
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/20 px-8 py-6 text-base text-white hover:bg-white/10 hover:text-white"
              >
                <a href="#servicos">Ver Serviços</a>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-400 animate-fade-up">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#D2A89B]" /> {config.proof[0]}
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#D2A89B]" /> {config.proof[1]}
              </span>
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" /> {config.proof[2]}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-float">
          <ChevronDown className="h-6 w-6 text-white/40" />
        </div>
      </section>

      <section id="servicos" className="relative overflow-hidden bg-[#fafafa] py-24 scroll-mt-16 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#9C5A3C]">
              Especialidades
            </p>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
              Nossos Serviços
            </h2>
            <p className="text-lg text-gray-500">{config.servicesLead}</p>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 auto-rows-[280px] md:grid-cols-3 md:auto-rows-[260px]">
            {config.services.map((service) => (
              <a
                key={service.title}
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className={`h-widget-trigger group relative block overflow-hidden rounded-3xl shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${service.colSpan} ${service.rowSpan}`}
              >
                <img
                  src={service.image.src}
                  alt={service.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 transition-all duration-500 group-hover:from-black/95 group-hover:via-black/55" />
                <div className="relative z-10 flex h-full flex-col justify-end p-7">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-sm">
                      <service.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="mb-1 text-xl font-bold leading-tight text-white md:text-2xl">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-300">{service.description}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Button asChild size="lg" className="h-widget-trigger gap-2 px-10 py-7 text-base" onClick={handleWhatsAppClick}>
              <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-5 w-5" />
                Falar com a equipe
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0">
          <img src={config.midCtaImage.src} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/75" />
        </div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-gray-300">
              <Search className="h-4 w-4 text-[#D2A89B]" />
              Avaliação sem compromisso
            </div>
            <h3 className="mb-6 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              {config.midCtaTitle}
            </h3>
            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-gray-300 md:text-xl">
              {config.midCtaDescription}
            </p>
            <Button asChild size="lg" className="h-widget-trigger gap-3 px-10 py-7 text-lg" onClick={handleWhatsAppClick}>
              <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-5 w-5" />
                Agendar Avaliação
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <div className="mb-16 text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#9C5A3C]">
              Passo a passo
            </p>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Como funciona?
            </h2>
            <p className="mx-auto max-w-xl text-lg text-gray-500">{config.howLead}</p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-4">
            {HOW_IT_WORKS.map((item, index) => (
              <div key={item.step} className="relative text-center">
                {index < HOW_IT_WORKS.length - 1 && (
                  <div className="absolute left-[60%] top-7 hidden h-px w-[80%] bg-gray-200 md:block" />
                )}
                <div className="relative z-10 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
                  <item.icon className="h-6 w-6 text-[#9C5A3C]" />
                </div>
                <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[#9C5A3C]/60">
                  Passo {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#fafafa] py-24 md:py-32">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gray-100 shadow-2xl md:aspect-square">
                {STORE_IMAGES.map((src, index) => (
                  <div
                    key={src.src}
                    className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out ${
                      index === carouselIndex ? "z-10 opacity-100" : "z-0 opacity-0"
                    }`}
                  >
                    <img src={src.src} alt={`B&W Store ${index + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                  {STORE_IMAGES.map((_, index) => (
                    <button
                      type="button"
                      aria-label={`Ver ambiente ${index + 1}`}
                      key={index}
                      onClick={() => setCarouselIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === carouselIndex ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-8">
              <div className="w-fit rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600">
                B&W Experience
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold leading-[1.1] tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                  Um ambiente
                  <br />
                  <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-400 bg-clip-text text-transparent">
                    pensado para você.
                  </span>
                </h2>
                <div className="space-y-5 text-lg leading-relaxed text-gray-500">
                  <p>{config.experienceCopy[0]}</p>
                  <p>{config.experienceCopy[1]}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <div className="h-px w-12 bg-[#D2A89B]" />
                <span className="text-sm font-medium uppercase tracking-widest text-gray-400">
                  Savassi - BH
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-zinc-950 py-24 md:py-32">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>
        <div className="container relative z-10">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#D2A89B]">
              Equipe técnica
            </p>
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              {config.specialistTitle}
            </h2>
            <p className="text-lg text-gray-400">{config.specialistDescription}</p>
          </div>

          <div className="mx-auto grid max-w-6xl items-stretch gap-8 lg:grid-cols-[1.3fr,1fr]">
            <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm md:p-12">
              <div className="max-w-xl">
                <h3 className="mb-6 text-2xl font-bold text-white md:text-3xl">
                  Avaliação técnica presencial
                </h3>
                <p className="mb-8 text-lg leading-relaxed text-gray-400">
                  Cada atendimento começa entendendo o uso, o modelo e a falha do aparelho. A proposta vem com escopo, prazo e condições aplicáveis.
                </p>
                <ul className="space-y-4 text-gray-400">
                  {config.specialistBullets.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#D2A89B]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 flex flex-wrap gap-3 text-xs font-medium md:text-sm">
                {[
                  { icon: Award, label: "Equipe técnica" },
                  { icon: Shield, label: "Laboratório equipado" },
                  { icon: Clock, label: "Processo padronizado" },
                ].map((badge) => (
                  <span
                    key={badge.label}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-gray-300"
                  >
                    <badge.icon className="mr-2 h-4 w-4 text-[#D2A89B]" />
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="group relative">
              <div className="h-full rounded-3xl bg-gradient-to-br from-white/10 to-white/5 p-1.5 shadow-2xl">
                <div className="relative h-full w-full overflow-hidden rounded-[1.25rem]">
                  <img
                    src={config.highlightImage.src}
                    alt={config.specialistTitle}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
              </div>
              <div className="absolute -bottom-5 left-6 hidden items-center gap-2 rounded-full border border-white/20 bg-white/95 px-5 py-2.5 text-xs font-bold text-zinc-900 shadow-xl md:inline-flex">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                Equipe técnica
              </div>
            </div>
          </div>

          <div className="mt-14 flex justify-center">
            <Button asChild size="lg" className="h-widget-trigger gap-2 px-10 py-7 text-base" onClick={handleWhatsAppClick}>
              <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-5 w-5" />
                Falar com a equipe
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section id="diferenciais" className="bg-[#fafafa] py-20 scroll-mt-16 md:py-28">
        <div className="container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#9C5A3C]">
              Diferenciais
            </p>
            <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
              Por que escolher a Bew Store?
            </h2>
            <p className="text-lg text-gray-500">
              Compromisso com qualidade, agilidade e satisfação do cliente.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COMMON_BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="group rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5E3A2F] text-white shadow-md">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{benefit.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="depoimentos" className="bg-zinc-950 py-20 scroll-mt-16 md:py-28">
        <div className="container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#D2A89B]">
              Depoimentos
            </p>
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              O que nossos clientes dizem
            </h2>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {config.testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-colors hover:border-white/20"
              >
                <div className="mb-6 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-6 flex-1 text-[15px] leading-relaxed text-gray-300">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="mt-auto flex items-center gap-4 border-t border-white/5 pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5E3A2F]">
                    <span className="text-sm font-semibold text-white">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fafafa] py-20 md:py-28">
        <div className="container">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-zinc-900 text-white shadow-2xl">
            <div className="absolute inset-0">
              <img src={config.highlightImage.src} alt="" className="h-full w-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/95 to-zinc-900/70" />
            </div>
            <div className="relative z-10 px-8 py-14 md:px-16 md:py-20">
              <div className="max-w-lg space-y-6">
                <h2 className="text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
                  {config.highlightTitle[0]}
                  <br />
                  <span className="text-[#D2A89B]">{config.highlightTitle[1]}</span>
                </h2>
                <p className="max-w-md text-lg leading-relaxed text-zinc-300">
                  {config.highlightDescription}
                </p>
                <Button asChild size="lg" className="h-widget-trigger gap-2 px-8 py-6 text-base" onClick={handleWhatsAppClick}>
                  <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="h-5 w-5" />
                    Falar com a equipe agora
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="relative overflow-hidden bg-[#3D221A] py-20 scroll-mt-16 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5E3A2F] via-[#3D221A] to-[#2A1610]" />
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl">
            <div className="mb-14 text-center">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#D2A89B]">
                Tire suas dúvidas
              </p>
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Perguntas Frequentes
              </h2>
            </div>
            <div className="space-y-3">
              {config.faqs.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-zinc-950 py-24 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              {config.finalQuestion}
              <br />
              <span className="text-[#D2A89B]">Fale com a gente.</span>
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-xl text-gray-400">
              Fale com a equipe pelo WhatsApp. A avaliação inicial não obriga aprovação do serviço.
            </p>
            <Button asChild size="lg" className="h-widget-trigger gap-3 px-10 py-7 text-lg" onClick={handleWhatsAppClick}>
              <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-6 w-6" />
                Chamar no WhatsApp
              </a>
            </Button>

            <div className="mt-14 border-t border-white/10 pt-8">
              <p className="mb-4 text-sm text-gray-500">Formas de pagamento</p>
              <div className="flex flex-wrap justify-center gap-3">
                {["PIX", "Cartão de Crédito", "Cartão de Débito", "Dinheiro"].map((method) => (
                  <span
                    key={method}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-8 text-sm text-gray-600">
              Atendimento de segunda a sábado, das 9h às 18h
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-black text-white">
        <div className="container py-16">
          <div className="flex flex-col gap-12 md:flex-row">
            <div className="md:min-w-[260px] md:basis-[36%] lg:basis-[38%]">
              <img src={bewLogo.src} alt="B&W Store" className="mb-6 h-12" />
              <p className="mb-6 max-w-md leading-relaxed text-gray-400">
                {config.footerTitle} em Belo Horizonte, com atendimento presencial e proposta antes da aprovação.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/bewstoreoficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
                  aria-label="Instagram Bew Store"
                >
                  <Instagram className="h-5 w-5 text-gray-400" />
                </a>
              </div>
            </div>

            <div className="md:flex-1">
              <h4 className="mb-6 text-lg font-semibold">Contato</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                  <span className="text-gray-400">
                    Rua Alagoas, 1050 - Savassi
                    <br />
                    Belo Horizonte - MG
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <a href="tel:+553138890437" className="text-gray-400 transition-colors hover:text-white">
                    (31) 3889-0437
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <WhatsAppIcon className="h-5 w-5 text-gray-500" />
                  <a
                    href={ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatsAppClick}
                    className="h-widget-trigger text-gray-400 transition-colors hover:text-white"
                  >
                    (31) 99074-2171
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:flex-1">
              <h4 className="mb-6 text-lg font-semibold">{config.footerTitle}</h4>
              <ul className="space-y-3">
                {config.footerServices.map((service) => (
                  <li key={service}>
                    <a href="#servicos" className="text-sm text-gray-400 transition-colors hover:text-white">
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:flex-1">
              <h4 className="mb-6 text-lg font-semibold">Informações legais</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/politica-de-privacidade" className="text-sm text-gray-400 transition-colors hover:text-white">
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a href="/termos-de-uso" className="text-sm text-gray-400 transition-colors hover:text-white">
                    Termos de Uso
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5">
          <div className="container py-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} B&W Store. Todos os direitos reservados.
              </p>
              <p className="max-w-xl text-xs text-gray-600">
                A B&W Store é uma empresa independente. {config.legalDevices} Este serviço não possui vínculo com a Apple Inc.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <a
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a Bew Store pelo WhatsApp"
        onClick={handleWhatsAppClick}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-black/30 transition-transform duration-200 hover:scale-110 md:bottom-6 md:right-6 md:h-16 md:w-16"
        style={{ background: "linear-gradient(135deg, #1A6B37, #145A2D)" }}
      >
        <WhatsAppIcon className="h-9 w-9 text-white md:h-10 md:w-10" />
      </a>
    </main>
  );
}

export type { Variant as ServiceCampaignVariant };
