import { useState } from "react";
import { Play } from "lucide-react";
import cesarFilho from "@/assets/cesar-filho.webp";
import fabiano from "@/assets/fabiano-menotti.webp";
import celso from "@/assets/celso.webp";

const videos = [
  {
    id: "VUD-y46fu80",
    image: cesarFilho,
    title: "César Filho",
  },
  {
    id: "R25c_h89KR0",
    image: fabiano,
    title: "Fabiano",
  },
  {
    id: "RM14u8q53Go",
    image: celso,
    title: "Celso Portiolli",
  },
];

interface VideoCardProps {
  video: {
    id: string;
    image: string;
    title: string;
  };
}

const VideoCard = ({ video }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative w-full rounded-[2rem] overflow-hidden shadow-xl border border-white/10 bg-black group isolate">
      <div className="relative w-full">
        {/* Imagem que define a altura do card */}
        <img 
          src={video.image} 
          alt={video.title} 
          className="w-full h-auto object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 block" 
        />
        
        {!isPlaying ? (
          <div 
            className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center cursor-pointer z-10"
            onClick={() => setIsPlaying(true)}
          >
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 transition-transform duration-300 group-hover:scale-110">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
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
};

const VideosSection = () => {
  return (
    <section className="py-20 md:py-32 bg-gray-50/50">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            Quem confia
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6 tracking-tight">
            Artistas na B&W Store
          </h2>
          <p className="text-lg text-gray-600 font-light">
            Veja quem já recuperou a performance do seu iPhone com a gente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideosSection;
