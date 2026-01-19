import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

import imgIphone from "@/assets/batery-iphone.webp";
import imgBateriaBew from "@/assets/bateria-iphone-bew.webp";
import imgIpad from "@/assets/ipad-batery.webp";
import imgWatch from "@/assets/applewatch-batery.webp";

const services = [
  {
    title: "Bateria para iPhone",
    description: "Saúde 100% e alta durabilidade.",
    image: imgIphone,
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-2",
    bgGradient: "from-zinc-900 to-zinc-950",
    imageStyle: "w-full h-[50%] md:h-[60%] absolute bottom-6 md:bottom-0 left-0 object-contain object-bottom",
  },
  {
    title: "Bateria para iPad",
    description: "Autonomia para o dia todo.",
    image: imgIpad,
    colSpan: "md:col-span-2",
    rowSpan: "md:row-span-1",
    bgGradient: "from-zinc-900 to-black",
    imageStyle: "w-[50%] md:w-[45%] absolute right-2 bottom-0 object-contain",
  },
  {
    title: "Bateria Apple Watch",
    description: "Seu relógio sempre ativo.",
    image: imgWatch,
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1",
    bgGradient: "from-zinc-800 to-zinc-900",
    imageStyle: "w-[65%] h-[65%] absolute right-4 bottom-0 object-contain object-bottom-right",
  },
  {
    title: "Diagnóstico Completo",
    description: "Análise de ciclos e consumo.",
    image: imgBateriaBew,
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1",
    bgGradient: "from-zinc-800 to-zinc-950",
    imageStyle: "w-[60%] h-[60%] absolute right-2 bottom-2 object-contain object-bottom-right",
  },
];

const ServicesSection = () => {
  const whatsappLink =
    "https://wa.me/5531990742171?text=Ol%C3%A1%2C%20vi%20o%20an%C3%BAncio%20e%20quero%20um%20or%C3%A7amento%20de%20troca%20da%20bateria%20do%20meu%20aparelho%20Apple%21%20%23BT25B";

  return (
    <section
      id="servicos"
      className="relative z-20 -mt-8 md:-mt-12 rounded-t-[3rem] bg-gray-50/80 backdrop-blur-xl shadow-[0_-20px_60px_rgba(0,0,0,0.1)] py-20 md:py-32 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            Especialidades
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-6 tracking-tight">
            Nossos Serviços
          </h2>
          <p className="text-lg text-gray-600 font-light">
            Tecnologia de ponta para devolver a autonomia ao seu dispositivo Apple.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[340px] md:auto-rows-[280px] gap-5 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <a
              key={service.title}
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative group overflow-hidden rounded-[2rem] bg-gradient-to-br ${service.bgGradient} border border-white/5 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${service.colSpan} ${service.rowSpan} block`}
            >
              {/* Content Container */}
              <div className="relative z-20 h-full flex flex-col p-8">
                <div className="flex justify-between items-start mb-4">
                  <div className="max-w-[60%]">
                    <h3 className="text-2xl font-semibold text-white leading-tight mb-2">
                      {service.title}
                    </h3>
                    <p className="text-zinc-400 text-sm font-medium">
                      {service.description}
                    </p>
                  </div>
                  <div
                    className="flex items-center justify-center rounded-full bg-gradient-to-br from-white/20 via-white/5 to-transparent border border-white/20 group-hover:from-white/30 group-hover:to-white/10 text-white group-hover:bg-white/5 shadow-lg backdrop-blur-sm w-10 h-10 shrink-0 transition-all"
                  >
                    <Plus className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Image Container */}
              <div className={`absolute transition-transform duration-700 ease-out group-hover:scale-105 ${service.imageStyle}`}>
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-auto drop-shadow-2xl opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                />
              </div>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />
            </a>
          ))}
        </div>

        <div className="text-center mt-20">
          <Button
            asChild
            size="lg"
            className="px-10 py-8 text-lg gap-2"
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

export default ServicesSection;
