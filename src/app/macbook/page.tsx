"use client";

import { useEffect, useState, useRef } from "react";
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
  Wrench,
  Search,
  ChevronDown,
  MessageCircle,
  MapPin,
  Phone,
  Instagram,
  Menu,
  X,
  Plus,
  Play,
  CreditCard,
  ThumbsUp,
  Battery,
  Monitor,
  Cpu,
  Keyboard,
} from "lucide-react";

import bewLogo from "@/assets/bew-logo.png";
import img42 from "@/assets/imgi_42_2025-04-03.webp";
import img44 from "@/assets/imgi_44_2025-04-03.webp";
import img70 from "@/assets/imgi_70_unnamed.webp";
import img74 from "@/assets/imgi_74_unnamed.webp";
import macbookProMockup from "@/assets/Macbook/076330438244a523c412dded0649f3a7.jpg";
import rodrigoFaro from "@/assets/Macbook/rodrigo-faro-scaled.webp";
import macbookDuo from "@/assets/Macbook/17a0be17b66b8cfca4b1591599f51d5a.jpg";
import macbookDuoDark from "@/assets/Macbook/441970bd662214533542a54e9536d5fd.jpg";
import macbookRepair from "@/assets/Macbook/700e8d5e4a80e0be997cb614796eaeb1.jpg";
import macbookAirBlue from "@/assets/Macbook/7d66c734771fd1eab1a6a8247f81ac08.jpg";
import cesarFilhoImg from "@/assets/cesar-filho.webp";
import fabianoImg from "@/assets/fabiano-menotti.webp";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MACBOOK_WHATSAPP_MESSAGE =
  "Olá! Preciso de manutenção para meu MacBook. Gostaria de agendar um diagnóstico! 💻";

const STORE_IMAGES = [img42, img44, img70, img74];

const BENTO_SERVICES = [
  {
    title: "Troca de Bateria",
    description: "Autonomia original para MacBook Air e Pro — ciclos zerados, duração real.",
    image: macbookAirBlue,
    icon: Battery,
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-2",
  },
  {
    title: "Reparo de Tela",
    description: "Display Retina com calibração de fábrica. Liquid Retina e ProMotion.",
    image: macbookDuo,
    icon: Monitor,
    colSpan: "md:col-span-2",
    rowSpan: "md:row-span-1",
  },
  {
    title: "Reparo de Teclado",
    description: "Butterfly e Magic Keyboard — teclas, backlight e trackpad.",
    image: macbookDuoDark,
    icon: Keyboard,
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1",
  },
  {
    title: "Diagnóstico Completo",
    description: "Análise técnica com relatório detalhado de hardware e software.",
    image: macbookRepair,
    icon: Cpu,
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1",
  },
];

const BENEFITS = [
  {
    icon: Shield,
    title: "Garantia real em serviços",
    description:
      "Garantia documentada de 1 ano em todos os serviços realizados.",
  },
  {
    icon: Clock,
    title: "Agilidade no atendimento",
    description:
      "Maioria dos reparos concluída em até 48 horas. Atendimento ágil pelo WhatsApp.",
  },
  {
    icon: Wrench,
    title: "Peças de qualidade",
    description:
      "Peças com especificação técnica compatível e alta durabilidade.",
  },
  {
    icon: CreditCard,
    title: "Parcelamento",
    description:
      "Parcelamos em até 12x no cartão. Aceitamos Pix com desconto.",
  },
  {
    icon: MapPin,
    title: "Centro de BH",
    description:
      "Localização privilegiada na Savassi, Belo Horizonte. Fácil acesso.",
  },
  {
    icon: ThumbsUp,
    title: "Clientes satisfeitos",
    description:
      "4.9 no Google com mais de 500 clientes atendidos em BH.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    icon: MessageCircle,
    title: "Fale conosco",
    description:
      "Clique no WhatsApp e descreva o problema do seu MacBook. Respondemos em minutos.",
  },
  {
    step: "2",
    icon: Search,
    title: "Diagnóstico técnico",
    description:
      "Nosso técnico avalia o equipamento e envia um orçamento claro, sem surpresas.",
  },
  {
    step: "3",
    icon: Wrench,
    title: "Reparo especializado",
    description:
      "Você aprova, a gente repara. Prazo e garantia informados antes de iniciar.",
  },
  {
    step: "4",
    icon: CheckCircle,
    title: "MacBook pronto",
    description:
      "Seu MacBook passa por testes finais e é devolvido funcionando com garantia.",
  },
];

const VIDEOS = [
  { id: "VUD-y46fu80", image: cesarFilhoImg, title: "César Filho" },
  { id: "R25c_h89KR0", image: fabianoImg, title: "Fabiano" },
  { id: "rodrigo-faro-mp4", mp4: "https://pub-9f5ae7ae2f2f4419acfdfd64cd5218ff.r2.dev/IMG_0623.mp4", image: rodrigoFaro, title: "Rodrigo Faro" },
];

const TESTIMONIALS = [
  {
    name: "Isabela Mariana",
    role: "MacBook Air M1",
    content:
      "Meu MacBook Air estava desligando sozinho com 30% de bateria. Levei na B&W, fizeram o diagnóstico na hora e trocaram a bateria no mesmo dia. Voltou a durar o dia todo!",
    rating: 5,
  },
  {
    name: "Rodrigo Zieguelboim",
    role: 'MacBook Pro 14"',
    content:
      "O teclado do meu MacBook Pro tinha teclas falhando. Trocaram com peça de qualidade e ficou perfeito. Atendimento transparente, sem surpresas no valor.",
    rating: 5,
  },
  {
    name: "Welberte Martins",
    role: 'MacBook Pro 16"',
    content:
      "Tela trincou numa queda. Achei que seria carísimo, mas o orçamento foi muito justo e o reparo ficou impecável. Super recomendo!",
    rating: 5,
  },
];

const FAQS = [
  {
    q: "Vocês trabalham com todos os modelos de MacBook?",
    a: "Sim. Atendemos desde MacBook Air e Pro com processadores Intel até os modelos mais recentes com chips M4 e M5, incluindo o novo MacBook Neo.",
  },
  {
    q: "Como funciona o orçamento?",
    a: "O diagnóstico identifica o problema e geramos um orçamento detalhado. Você só paga se aprovar o serviço. Sem compromisso.",
  },
  {
    q: "Qual o prazo de reparo?",
    a: "A maioria dos reparos é concluída em até 48 horas após aprovação. Casos mais complexos como reparo de placa-mãe podem levar até 5 dias úteis.",
  },
  {
    q: "O reparo tem garantia?",
    a: "Sim. Todos os nossos serviços incluem garantia de 1 ano cobrindo peças e mão de obra.",
  },
  {
    q: "Vocês são uma assistência técnica autorizada Apple?",
    a: "Somos uma empresa independente especializada em manutenção Apple. Isso nos permite oferecer preços mais acessíveis com a mesma qualidade técnica.",
  },
  {
    q: "Onde fica a Bew Store?",
    a: "Rua Alagoas, 1050 – Savassi, Belo Horizonte - MG. O atendimento inicial é feito pelo WhatsApp para agilizar o processo.",
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden transition-colors hover:border-white/20">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="text-white font-medium pr-4 text-[15px]">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 ${
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
          <p className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

function VideoCard({
  video,
}: {
  video: { id: string; mp4?: string; image: { src: string }; title: string };
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black group isolate">
      <div className="relative w-full">
        <img
          src={video.image.src}
          alt={video.title}
          className={`w-full h-auto object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 block ${isPlaying ? "invisible" : ""}`}
        />
        {!isPlaying ? (
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center cursor-pointer z-10"
            onClick={() => setIsPlaying(true)}
          >
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
              <Play className="w-7 h-7 text-white fill-white ml-1" />
            </div>
          </div>
        ) : video.mp4 ? (
          <div className="absolute inset-0 z-20">
            <video
              src={video.mp4}
              autoPlay
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="absolute inset-0 z-20">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function MacbookPage() {
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const macbookUrl = process.env.NEXT_PUBLIC_HELENA_MACBOOK_URL;
    if (macbookUrl) {
      setWhatsappUrl(macbookUrl);
    } else {
      const utmData = captureUTMs();
      setWhatsappUrl(buildHelenaWhatsAppURL(utmData, MACBOOK_WHATSAPP_MESSAGE));
    }
    trackViewContent({
      content_id: "macbook-manutencao-lp",
      content_name: "MacBook Manutenção - Landing Page",
    });
  }, []);

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
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % STORE_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleWhatsAppClick = () => {
    trackClickButton({
      content_id: "whatsapp-cta-macbook",
      content_name: "WhatsApp CTA - MacBook Manutenção",
    });
  };

  const fallbackUrl =
    "https://api.helena.run/chat/v1/channel/wa/5531990742171?text=Ol%C3%A1!%20Preciso%20de%20manuten%C3%A7%C3%A3o%20para%20meu%20MacBook.%20Gostaria%20de%20agendar%20um%20diagn%C3%B3stico!%20%F0%9F%92%BB&utm_source=google&utm_medium=cpc";
  const ctaUrl = whatsappUrl || fallbackUrl;

  return (
    <main className="min-h-screen bg-black">

      {/* ================================================================
          HEADER
          ================================================================ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container flex items-center justify-between">
          <a href="#" className="flex items-center">
            <img src={bewLogo.src} alt="Bew Store" className="h-9" />
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: "#servicos", label: "Serviços" },
              { href: "#diferenciais", label: "Diferenciais" },
              { href: "#depoimentos", label: "Depoimentos" },
              { href: "#faq", label: "Dúvidas" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
            <Button asChild size="sm" className="gap-2" onClick={handleWhatsAppClick}>
              <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-4 w-4" />
                Orçamento
              </a>
            </Button>
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/5">
            <nav className="container py-6 flex flex-col gap-4">
              {[
                { href: "#servicos", label: "Serviços" },
                { href: "#diferenciais", label: "Diferenciais" },
                { href: "#depoimentos", label: "Depoimentos" },
                { href: "#faq", label: "Dúvidas" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-white font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Button asChild className="w-full gap-2 mt-2" onClick={handleWhatsAppClick}>
                <a href={ctaUrl} target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
                  <WhatsAppIcon className="h-4 w-4" />
                  Solicitar Orçamento
                </a>
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* ================================================================
          1. HERO — Full-width MacBook image, overlay text
          ================================================================ */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1600&q=85&auto=format"
            alt="MacBook Pro"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        </div>

        <div className="container relative z-10 pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-gray-300 text-sm font-medium mb-8 animate-fade-up border border-white/10"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Manutenção MacBook em BH
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6 animate-fade-up tracking-tight"
              style={{ animationDelay: "0.1s" }}
            >
              Seu MacBook
              <br />
              merece as
              <br />
              <span className="text-[#D2A89B]">mãos certas.</span>
            </h1>

            <p
              className="text-lg md:text-xl text-gray-300 mb-10 max-w-lg leading-relaxed animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              Diagnóstico técnico, orçamento transparente e garantia de 1 ano
              em todos os serviços. MacBook Air, Pro e Neo, Intel ao M5.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Button
                asChild
                size="lg"
                className="gap-3 text-base px-8 py-6"
                onClick={handleWhatsAppClick}
              >
                <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="h-5 w-5" />
                  Solicitar Diagnóstico
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base px-8 py-6 border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                <a href="#servicos">Ver Serviços</a>
              </Button>
            </div>

            <div
              className="flex flex-wrap gap-x-6 gap-y-3 mt-10 text-gray-400 text-sm animate-fade-up"
              style={{ animationDelay: "0.4s" }}
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#D2A89B]" /> Garantia 1 ano
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#D2A89B]" /> Orçamento sem compromisso
              </span>
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" /> 4.9 no Google
              </span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float z-10">
          <ChevronDown className="w-6 h-6 text-white/40" />
        </div>
      </section>

      {/* ================================================================
          2. SERVICES BENTO GRID — Light section
          ================================================================ */}
      <section
        id="servicos"
        className="relative py-24 md:py-32 bg-[#fafafa] overflow-hidden scroll-mt-16"
      >
        <div className="container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-[#9C5A3C] uppercase tracking-widest mb-4">
              Especialidades
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Nossos Serviços
            </h2>
            <p className="text-lg text-gray-500">
              Manutenção especializada para toda a linha MacBook — do Intel ao M5, incluindo o novo Neo.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[280px] md:auto-rows-[260px] gap-4 max-w-6xl mx-auto">
            {BENTO_SERVICES.map((service) => (
              <a
                key={service.title}
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className={`relative group overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${service.colSpan} ${service.rowSpan} block`}
              >
                {/* Image background */}
                <img
                  src={service.image.src}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 group-hover:via-black/50 transition-all duration-500" />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-7">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <service.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-auto">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-1">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {service.description}
                  </p>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-14">
            <Button
              asChild
              size="lg"
              className="px-10 py-7 text-base gap-2"
              onClick={handleWhatsAppClick}
            >
              <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-5 w-5" />
                Solicitar orçamento
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ================================================================
          4. CTA INTERMEDIÁRIO — MacBook background
          ================================================================ */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=1400&q=80&auto=format"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/70" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-gray-300 text-sm font-medium mb-8">
              <Search className="w-4 h-4 text-[#D2A89B]" />
              Diagnóstico técnico gratuito
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Não sabe qual<br />o problema?
            </h3>
            <p className="text-gray-300 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              Nosso diagnóstico técnico identifica exatamente o que seu
              MacBook precisa. Você recebe o orçamento antes de qualquer reparo.
            </p>
            <Button
              asChild
              size="lg"
              className="gap-3 text-lg px-10 py-7"
              onClick={handleWhatsAppClick}
            >
              <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-5 w-5" />
                Agendar Diagnóstico
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ================================================================
          5. HOW IT WORKS — Light
          ================================================================ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#9C5A3C] uppercase tracking-widest mb-4">
              Passo a passo
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como funciona?
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Do WhatsApp ao MacBook funcionando — simples e transparente.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {HOW_IT_WORKS.map((item, index) => (
              <div key={item.step} className="text-center relative">
                {index < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-px bg-gray-200" />
                )}
                <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mx-auto mb-5 relative z-10 shadow-sm">
                  <item.icon className="w-6 h-6 text-[#9C5A3C]" />
                </div>
                <div className="text-xs font-bold text-[#9C5A3C]/60 uppercase tracking-widest mb-2">
                  Passo {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          6. BEW EXPERIENCE — Light, store carousel
          ================================================================ */}
      <section className="py-24 md:py-32 bg-[#fafafa] relative overflow-hidden">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Carousel */}
            <div className="relative">
              <div className="relative w-full aspect-[4/5] md:aspect-square rounded-3xl shadow-2xl overflow-hidden bg-gray-100">
                {STORE_IMAGES.map((src, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                      index === carouselIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  >
                    <img
                      src={src.src}
                      alt={`B&W Store ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {STORE_IMAGES.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCarouselIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === carouselIndex
                          ? "bg-white w-6"
                          : "bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-xs font-semibold tracking-wider uppercase w-fit">
                B&W Experience
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-[1.1]">
                  Um ambiente
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-400">
                    pensado para você.
                  </span>
                </h2>

                <div className="space-y-5 text-lg text-gray-500 leading-relaxed">
                  <p>
                    Na B&W Store, redefinimos o conceito de assistência técnica.
                    Acreditamos que a excelência técnica deve vir acompanhada de
                    transparência absoluta e conforto excepcional.
                  </p>
                  <p>
                    Nosso laboratório é moderno e visível — cada procedimento no
                    seu MacBook é realizado com precisão. Um espaço onde
                    tecnologia e bem-estar se encontram.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="h-px w-12 bg-[#D2A89B]" />
                <span className="text-sm text-gray-400 font-medium tracking-widest uppercase">
                  Savassi • BH
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          7. SPECIALISTS — Dark, images of the team
          ================================================================ */}
      <section className="relative py-24 md:py-32 bg-zinc-950 overflow-hidden">
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
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-sm font-semibold text-[#D2A89B] uppercase tracking-widest mb-4">
              Equipe especialista
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Técnicos que entendem o seu MacBook
            </h2>
            <p className="text-gray-400 text-lg">
              Profissionais dedicados com experiência em Apple Silicon e Intel.
            </p>
          </div>

          {/* Block 1 — text left, image right */}
          <div className="grid gap-8 lg:grid-cols-[1.3fr,1fr] items-stretch max-w-6xl mx-auto">
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col justify-between">
              <div className="max-w-xl">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  Diagnóstico técnico especializado
                </h3>
                <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                  Cada atendimento começa com uma análise completa de hardware e
                  software. Identificamos o problema real — sem achismo, sem
                  surpresas no orçamento.
                </p>
                <ul className="space-y-4 text-gray-400">
                  {[
                    "Análise de hardware, bateria e ciclos de carga",
                    "Diagnóstico de placa-mãe e componentes internos",
                    "Orçamento detalhado antes de qualquer procedimento",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#D2A89B] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 flex flex-wrap gap-3 text-xs md:text-sm font-medium">
                {[
                  { icon: Award, label: "Técnicos especialistas" },
                  { icon: Shield, label: "Laboratório equipado" },
                  { icon: Clock, label: "Processo padronizado" },
                ].map((badge) => (
                  <span
                    key={badge.label}
                    className="inline-flex items-center rounded-full bg-white/5 px-4 py-2.5 text-gray-300 border border-white/10"
                  >
                    <badge.icon className="mr-2 h-4 w-4 text-[#D2A89B]" />
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="rounded-3xl p-1.5 h-full bg-gradient-to-br from-white/10 to-white/5 shadow-2xl">
                <div className="relative h-full w-full overflow-hidden rounded-[1.25rem]">
                  <img
                    src={macbookDuo.src}
                    alt="Técnico especialista Bew Store"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
              </div>
              <div className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 text-zinc-900 text-xs font-bold shadow-xl absolute -bottom-5 left-6 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Equipe especialista
              </div>
            </div>
          </div>

          {/* Block 2 — image left, text right */}
          <div className="mt-20 grid gap-8 md:grid-cols-2 items-center max-w-6xl mx-auto">
            <div className="relative group h-full min-h-[400px]">
              <div className="rounded-3xl p-1.5 h-full bg-gradient-to-tr from-white/10 to-white/5 shadow-2xl">
                <div className="relative h-full w-full overflow-hidden rounded-[1.25rem]">
                  <img
                    src={macbookRepair.src}
                    alt="Atendimento especializado Bew Store"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col justify-center h-full">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Acompanhamento do início ao fim
              </h3>
              <p className="text-gray-400 leading-relaxed text-lg mb-8">
                Da primeira mensagem à retirada do MacBook, você fala com alguém
                que entende o problema. Cada etapa é explicada com clareza.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  {
                    title: "Transparência total",
                    desc: "Você sabe exatamente o que será feito no seu equipamento.",
                  },
                  {
                    title: "Pós-venda ativo",
                    desc: "Garantia real e suporte contínuo após a entrega.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10"
                  >
                    <div className="mt-0.5 bg-[#D2A89B]/10 p-2 rounded-xl">
                      <ArrowRight className="h-4 w-4 text-[#D2A89B]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 flex justify-center">
            <Button
              asChild
              size="lg"
              className="px-10 py-7 text-base gap-2"
              onClick={handleWhatsAppClick}
            >
              <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-5 w-5" />
                Solicitar orçamento
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ================================================================
          7. BENEFITS — Light
          ================================================================ */}
      <section id="diferenciais" className="py-20 md:py-28 bg-[#fafafa] scroll-mt-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-[#9C5A3C] uppercase tracking-widest mb-4">
              Diferenciais
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Por que escolher a Bew Store?
            </h2>
            <p className="text-lg text-gray-500">
              Compromisso com qualidade, agilidade e a satisfação do cliente.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {BENEFITS.map((benefit, index) => (
              <div
                key={benefit.title}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg p-7 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5E3A2F] text-white shadow-md">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          8. VIDEOS — Light
          ================================================================ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-[#9C5A3C] uppercase tracking-widest mb-4">
              Quem confia
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Artistas na B&W Store
            </h2>
            <p className="text-lg text-gray-500">
              Veja quem já confiou na nossa assistência técnica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {VIDEOS.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          10. TESTIMONIALS — Dark
          ================================================================ */}
      <section id="depoimentos" className="py-20 md:py-28 bg-zinc-950 scroll-mt-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-[#D2A89B] uppercase tracking-widest mb-4">
              Depoimentos
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              O que nossos clientes dizem
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="bg-white/[0.03] rounded-3xl border border-white/10 p-8 flex flex-col h-full hover:border-white/20 transition-colors"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed text-[15px] flex-1">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-[#5E3A2F] flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          11. MACBOOK HIGHLIGHT CARD — Light
          ================================================================ */}
      <section className="py-20 md:py-28 bg-[#fafafa]">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-900 text-white shadow-2xl max-w-5xl mx-auto">
            {/* Background MacBook image */}
            <div className="absolute inset-0">
              <img
                src={macbookProMockup.src}
                alt=""
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/95 to-zinc-900/70" />
            </div>

            <div className="relative z-10 px-8 py-14 md:px-16 md:py-20">
              <div className="max-w-lg space-y-6">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                  Performance de novo,
                  <br />
                  <span className="text-[#D2A89B]">sem perder dados.</span>
                </h2>
                <p className="text-zinc-300 text-lg leading-relaxed max-w-md">
                  Diagnóstico técnico, peças de qualidade e instalação
                  profissional para devolver o desempenho original do seu
                  MacBook.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="gap-2 text-base px-8 py-6"
                  onClick={handleWhatsAppClick}
                >
                  <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="h-5 w-5" />
                    Solicitar orçamento agora
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          12. FAQ — Dark
          ================================================================ */}
      <section id="faq" className="py-20 md:py-28 bg-zinc-950 scroll-mt-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-[#D2A89B] uppercase tracking-widest mb-4">
                Tire suas dúvidas
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Perguntas Frequentes
              </h2>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          13. CTA FINAL — Dark gradient
          ================================================================ */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-[#3D221A]">
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
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Seu MacBook com problema?
              <br />
              <span className="text-[#F5E6E0]">A gente resolve.</span>
            </h2>
            <p className="text-xl text-[#D2A89B]/80 mb-10 max-w-xl mx-auto">
              Solicite seu orçamento agora pelo WhatsApp. Diagnóstico sem
              compromisso e garantia em todos os serviços.
            </p>

            <Button
              asChild
              size="lg"
              className="gap-3 text-lg px-10 py-7"
              onClick={handleWhatsAppClick}
            >
              <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-6 w-6" />
                Chamar no WhatsApp
              </a>
            </Button>

            <div className="mt-14 pt-8 border-t border-white/15">
              <p className="text-[#D2A89B]/60 text-sm mb-4">Formas de pagamento</p>
              <div className="flex flex-wrap justify-center gap-3">
                {["PIX", "Cartão de Crédito", "Cartão de Débito", "Dinheiro"].map(
                  (method) => (
                    <span
                      key={method}
                      className="px-4 py-2 rounded-full bg-white/10 text-[#F5E6E0] text-sm font-medium border border-white/10"
                    >
                      {method}
                    </span>
                  )
                )}
              </div>
            </div>

            <p className="mt-8 text-[#D2A89B]/40 text-sm">
              Atendimento de segunda a sábado, das 9h às 18h
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          14. FOOTER
          ================================================================ */}
      <footer className="bg-black text-white border-t border-white/5">
        <div className="container py-16">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:basis-[36%] lg:basis-[38%] md:min-w-[260px]">
              <img src={bewLogo.src} alt="B&W Store" className="h-12 mb-6" />
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Especialistas em manutenção de MacBook Air e Pro em Belo
                Horizonte. Qualidade, agilidade e garantia de 1 ano.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/bewstoreoficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Instagram className="h-5 w-5 text-gray-400" />
                </a>
              </div>
            </div>

            <div className="md:flex-1">
              <h4 className="font-semibold text-lg mb-6">Contato</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                  <span className="text-gray-400">
                    Rua Alagoas, 1050 – Savassi<br />Belo Horizonte – MG
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <a href="tel:+553138890437" className="text-gray-400 hover:text-white transition-colors">
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
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    (31) 99074-2171
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:flex-1">
              <h4 className="font-semibold text-lg mb-6">Serviços MacBook</h4>
              <ul className="space-y-3">
                {[
                  "Troca de Bateria",
                  "Reparo de Tela",
                  "Reparo de Teclado",
                  "Limpeza e Pasta Térmica",
                  "Diagnóstico Completo",
                  "Reparo de Placa-Mãe",
                ].map((service) => (
                  <li key={service}>
                    <a href="#servicos" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5">
          <div className="container py-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} B&W Store. Todos os direitos reservados.
              </p>
              <p className="text-gray-600 text-xs max-w-xl">
                Este serviço não possui vínculo com a Apple Inc. ou com qualquer
                assistência técnica autorizada Apple.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* ================================================================
          FLOATING WHATSAPP BUTTON
          ================================================================ */}
      <a
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a Bew Store pelo WhatsApp"
        onClick={handleWhatsAppClick}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg shadow-black/30 flex items-center justify-center transition-transform duration-200 hover:scale-110"
        style={{ background: "linear-gradient(135deg, #1A6B37, #145A2D)" }}
      >
        <WhatsAppIcon className="w-9 h-9 md:w-10 md:h-10 text-white" />
      </a>
    </main>
  );
}
