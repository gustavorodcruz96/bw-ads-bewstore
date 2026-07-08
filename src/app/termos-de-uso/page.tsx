import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso | B&W Store",
  description:
    "Termos de Uso das páginas de atendimento e campanhas da B&W Store.",
};

const sections = [
  {
    title: "1. Uso das páginas",
    body: [
      "As páginas da B&W Store têm finalidade informativa e de atendimento inicial. As informações exibidas não substituem avaliação técnica presencial do equipamento.",
      "Ao entrar em contato, o usuário declara que as informações fornecidas são verdadeiras e que possui autorização para solicitar avaliação do aparelho informado.",
    ],
  },
  {
    title: "2. Atendimento, orçamento e aprovação",
    body: [
      "Qualquer serviço depende de avaliação do modelo, estado do aparelho, disponibilidade de peças e aprovação prévia do orçamento.",
      "Prazos, valores, escopo e condições aplicáveis são informados antes da execução. O contato pelo WhatsApp não obriga contratação.",
    ],
  },
  {
    title: "3. Marcas e independência",
    body: [
      "A B&W Store é uma empresa independente. Não somos Apple Store, assistência autorizada Apple, nem representantes da Apple Inc.",
      "As marcas Apple, iPad e Apple Watch pertencem aos seus respectivos titulares e são usadas apenas para identificação de modelos compatíveis com os serviços informados.",
    ],
  },
  {
    title: "4. Garantias e limitações",
    body: [
      "Condições de garantia, quando aplicáveis, são informadas na proposta de serviço e podem variar conforme o procedimento, peça e estado do equipamento.",
      "Não prometemos resultado antes da avaliação. Alguns danos podem exigir procedimentos diferentes dos inicialmente descritos pelo usuário.",
    ],
  },
  {
    title: "5. Conteúdo e disponibilidade",
    body: [
      "Buscamos manter as informações atualizadas, mas podem ocorrer alterações de disponibilidade, prazos e condições sem aviso prévio.",
      "As imagens usadas nas páginas são ilustrativas e não representam necessariamente o estado exato de cada aparelho.",
    ],
  },
  {
    title: "6. Contato",
    body: [
      "Endereço: Rua Alagoas, 1050, Savassi, Belo Horizonte - MG.",
      "Telefone: (31) 3889-0437. WhatsApp: (31) 99074-2171.",
    ],
  },
];

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="border-b border-white/10 bg-black py-16">
        <div className="container max-w-4xl">
          <a href="/" className="text-sm text-gray-400 transition-colors hover:text-white">
            B&W Store
          </a>
          <h1 className="mt-8 text-4xl font-bold tracking-tight md:text-5xl">
            Termos de Uso
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-400">
            Última atualização: 8 de julho de 2026.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container max-w-4xl space-y-10">
          {sections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-400">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
