import { useState, useEffect } from "react";
import type { StaticImageData } from "next/image";
import img42 from "@/assets/imgi_42_2025-04-03.webp";
import img44 from "@/assets/imgi_44_2025-04-03.webp";
import img70 from "@/assets/imgi_70_unnamed.webp";
import img74 from "@/assets/imgi_74_unnamed.webp";

const images: StaticImageData[] = [img42, img44, img70, img74];

const BewSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload images to prevent flickering
  useEffect(() => {
    images.forEach((imgData) => {
      const img = new Image();
      img.src = imgData.src;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden w-full max-w-[1920px] mx-auto">
      {/* Background Decorative Elements - Light Mode */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-gray-50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gray-50 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column: Image Carousel */}
            <div className="relative">
              <div className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-square rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden bg-gray-100 group">
                {images.map((src, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                      index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  >
                    <img
                      src={src.src}
                      alt={`B&W Store Ambiente ${index + 1}`}
                      className="w-full h-full object-cover will-change-opacity"
                    />
                    {/* Subtle Gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-transparent pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Content */}
            <div className="flex flex-col justify-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-xs font-semibold tracking-wider uppercase w-fit">
                B&W Experience
              </div>
              
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight leading-[1.1]">
                  Um ambiente <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500">
                    pensado para você.
                  </span>
                </h2>
                
                <div className="space-y-6 text-lg text-gray-600 font-light leading-relaxed">
                  <p>
                    Na B&W Store, redefinimos o conceito de assistência técnica. Acreditamos que a excelência técnica deve vir acompanhada de transparência absoluta e conforto excepcional.
                  </p>
                  
                  <p>
                    Nossa estrutura conta com um laboratório moderno e visível, onde cada procedimento é realizado com precisão cirúrgica diante dos seus olhos. Um espaço onde tecnologia e bem-estar se encontram.
                  </p>
                </div>
              </div>

              {/* CTA or Decorative Element */}
              <div className="flex items-center gap-4 pt-2">
                 <div className="h-px w-12 bg-gray-300" />
                 <span className="text-sm text-gray-400 font-medium tracking-widest uppercase">Savassi • BH</span>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
};

export default BewSection;
