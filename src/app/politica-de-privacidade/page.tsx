import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | B&W Store",
  description:
    "Política de Privacidade da B&W Store para páginas de atendimento e campanhas.",
};

const sections = [
  {
    title: "1. Quem somos",
    body: [
      "A B&W Store realiza atendimento presencial em Belo Horizonte, na Rua Alagoas, 1050, Savassi. Esta página explica como tratamos informações relacionadas ao contato feito por nossas páginas de campanha.",
      "A B&W Store é uma empresa independente e não possui vínculo, autorização, patrocínio ou endosso da Apple Inc. As marcas Apple, iPad e Apple Watch são usadas apenas para identificar modelos compatíveis com os serviços informados.",
    ],
  },
  {
    title: "2. Informações que podemos tratar",
    body: [
      "Podemos tratar informações enviadas voluntariamente pelo usuário em canais de atendimento, como nome, telefone, modelo do aparelho, fotos enviadas pelo WhatsApp e descrição do problema.",
      "Também podemos registrar dados técnicos de navegação, como página acessada, parâmetros de campanha, horário do acesso, dispositivo, navegador e eventos de clique.",
    ],
  },
  {
    title: "3. Como usamos essas informações",
    body: [
      "Usamos as informações para responder solicitações, orientar sobre avaliação presencial, preparar proposta de serviço, melhorar a experiência do site e medir resultados de campanhas.",
      "Não vendemos dados pessoais. O compartilhamento ocorre apenas com ferramentas necessárias para atendimento, mensuração e operação, como WhatsApp, Leaper, Google Tag Manager, Google Ads e TikTok Pixel, quando aplicável.",
    ],
  },
  {
    title: "4. Cookies, pixels e mensuração",
    body: [
      "As páginas podem usar cookies, pixels e tecnologias semelhantes para mensuração de visitas, eventos de clique e origem da campanha.",
      "Parâmetros como UTM, gclid e identificadores de clique podem ser preservados para entender a origem do atendimento. Não solicitamos dados sensíveis diretamente nas páginas.",
    ],
  },
  {
    title: "5. Segurança e retenção",
    body: [
      "Usamos conexão HTTPS e medidas razoáveis para proteger as informações tratadas. Nenhum método de transmissão ou armazenamento é absolutamente seguro.",
      "As informações são mantidas pelo tempo necessário para atendimento, cumprimento de obrigações legais, prevenção de fraudes e melhoria dos serviços.",
    ],
  },
  {
    title: "6. Direitos do titular",
    body: [
      "Você pode solicitar acesso, correção, exclusão ou informações sobre o tratamento de seus dados pelos canais de contato abaixo.",
      "Contato: (31) 3889-0437, WhatsApp (31) 99074-2171 ou atendimento presencial na Rua Alagoas, 1050, Savassi, Belo Horizonte - MG.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="border-b border-white/10 bg-black py-16">
        <div className="container max-w-4xl">
          <a href="/" className="text-sm text-gray-400 transition-colors hover:text-white">
            B&W Store
          </a>
          <h1 className="mt-8 text-4xl font-bold tracking-tight md:text-5xl">
            Política de Privacidade
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
