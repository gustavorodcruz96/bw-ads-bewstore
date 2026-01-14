import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Carolina M.",
    role: "Empresária",
    content: "Quebrei a tela do meu iPhone 14 Pro e em menos de 1 hora já estava com ele novinho. Atendimento impecável!",
    rating: 5,
  },
  {
    name: "Rafael S.",
    role: "Advogado",
    content: "Preço justo, peças de qualidade e garantia de verdade. Já indiquei para vários amigos. Super recomendo!",
    rating: 5,
  },
  {
    name: "Juliana P.",
    role: "Arquiteta",
    content: "Meu iPad ficou perfeito após a troca de tela. Profissionais muito competentes e atenciosos.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="depoimentos" className="py-20 md:py-28 bg-background">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Depoimentos
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            O que nossos clientes dizem
          </h2>
          <p className="text-lg text-muted-foreground">
            A satisfação dos nossos clientes é nossa maior conquista.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-card rounded-2xl p-8 shadow-card border border-border"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Google Rating */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-secondary">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="font-semibold text-foreground">5.0</span>
            <span className="text-muted-foreground">no Google</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
