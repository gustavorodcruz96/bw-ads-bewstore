"use client";

import { useState, useEffect } from "react";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const REMOVED_TERMS = [
  { old: "Manutenção", new: "Cuidado / Removido" },
  { old: "Diagnóstico", new: "Avaliação / Check-up" },
  { old: "Reparo / Reparos", new: "Procedimento / Cuidado" },
  { old: "Conserto", new: "Removido" },
  { old: "Troca de Bateria", new: "Bateria & Autonomia" },
  { old: "Reparo de Tela", new: "Display Retina" },
  { old: "Reparo de Teclado", new: "Teclado & Trackpad" },
  { old: "Orçamento", new: "Proposta / Consultar" },
  { old: "Assistência Técnica", new: "Cuidado com Apple / Removido" },
  { old: "Peças", new: "Componentes" },
];

const BLOCKED_WORDS = [
  "Reparo / Repair",
  "Conserto / Fix",
  "Manutenção / Maintenance",
  "Diagnóstico / Troubleshooting",
  "Troca de tela / Screen replacement",
  "Troca de bateria / Battery replacement",
  "Suporte técnico / Tech support",
  "Assistência técnica",
  "Desbloqueio / Unlock",
  "Recuperação de dados",
  "Consertar / Reparar",
];

const SAFE_WORDS = [
  "Especialistas MacBook",
  "Cuidado profissional",
  "Avaliação sem compromisso",
  "Check-up completo",
  "Performance original",
  "Garantia de 1 ano",
  "Componentes de qualidade",
  "MacBook como novo",
  "Proposta transparente",
  "B&W Store BH",
  "Savassi - Belo Horizonte",
];

const AD_MODELS = [
  {
    name: "Modelo A — Foco em Especialidade",
    titles: [
      "Especialistas MacBook em BH",
      "Garantia de 1 Ano | B&W Store",
      "Avaliação Sem Compromisso",
    ],
    descriptions: [
      "Cuidado profissional para seu MacBook Air e Pro. Avaliação gratuita, proposta transparente e garantia de 1 ano. Savassi, BH.",
      "Equipe especialista em Apple Silicon e Intel. Atendimento ágil pelo WhatsApp. Mais de 500 clientes satisfeitos. Nota 4.9 no Google.",
    ],
  },
  {
    name: "Modelo B — Foco em Confiança",
    titles: [
      "MacBook nas Mãos Certas | BH",
      "4.9 no Google | B&W Store",
      "Garantia Real de 1 Ano",
    ],
    descriptions: [
      "Seu MacBook merece cuidado especializado. Equipe dedicada, componentes de qualidade e garantia documentada. Savassi, Belo Horizonte.",
      "Do MacBook Air ao Pro, Intel ao M5. Proposta clara antes de qualquer procedimento. Parcele em até 12x. Atendimento pelo WhatsApp.",
    ],
  },
  {
    name: "Modelo C — Foco em Performance",
    titles: [
      "MacBook com Performance de Novo",
      "Especialistas Apple | Savassi",
      "Parcele em Até 12x",
    ],
    descriptions: [
      "Devolva a performance original do seu MacBook. Avaliação completa, garantia de 1 ano e atendimento premium na Savassi, BH.",
      "B&W Store: mais de 500 clientes satisfeitos. Toda linha MacBook, Intel ao M5. Fale pelo WhatsApp e receba sua proposta hoje.",
    ],
  },
];

const BAD_EXAMPLES = [
  { text: "Conserto de MacBook em BH", reason: '"conserto" = BLOCK' },
  { text: "Reparo de Tela e Bateria", reason: '"reparo" = BLOCK' },
  { text: "Assistência Técnica Apple BH", reason: '"assistência técnica" = BLOCK' },
  { text: "Diagnóstico Gratuito MacBook", reason: '"diagnóstico" = BLOCK' },
  { text: "Manutenção MacBook Pro e Air", reason: '"manutenção" = BLOCK' },
];

const SAFE_KEYWORDS = [
  '"especialista macbook bh"',
  '"macbook belo horizonte"',
  '"cuidado macbook bh"',
  '"macbook bateria bh"',
  '"macbook tela bh"',
  '"macbook teclado bh"',
  '"macbook performance"',
  '"macbook garantia bh"',
  '"bew store macbook"',
  '"macbook savassi"',
];

const BLOCKED_KEYWORDS = [
  '"conserto macbook bh"',
  '"reparo macbook"',
  '"assistencia macbook bh"',
  '"manutencao macbook"',
  '"trocar tela macbook"',
  '"trocar bateria macbook"',
  '"consertar macbook"',
  '"macbook com defeito"',
  '"diagnostico macbook"',
  '"suporte tecnico apple"',
];

const CHECKLIST_ITEMS = [
  {
    title: "Títulos e descrições NÃO contêm termos proibidos",
    desc: "Verificar contra a lista da seção 3",
  },
  {
    title: "Keywords NÃO contêm termos de reparo/assistência",
    desc: 'Usar apenas keywords da lista "seguras"',
  },
  {
    title: "Negative keywords adicionadas",
    desc: "Todas as negativas da seção 5 configuradas",
  },
  {
    title: "Landing page NÃO contém termos proibidos",
    desc: "Verificar em ads.bewstore.com.br/macbook após deploy",
  },
  {
    title: "Disclaimer de empresa independente visível no rodapé",
    desc: "Marca Apple referenciada como marca registrada",
  },
  {
    title: "Sitelinks NÃO contêm termos proibidos",
    desc: "Revisar cada texto de sitelink e descrição",
  },
  {
    title: "UTMs configurados corretamente",
    desc: "Testar URL final com parâmetros no navegador",
  },
  {
    title: "Conversão de clique WhatsApp configurada no Google Ads",
    desc: "Evento click_button como conversão primária",
  },
  {
    title: "Google Business Profile vinculado",
    desc: "Extensão de local exibindo endereço da Savassi",
  },
  {
    title: "Rede restrita apenas à Pesquisa Google",
    desc: "Desativar parceiros de pesquisa e Display",
  },
];

const CAMPAIGN_CONFIG = [
  { param: "Tipo de campanha", value: "Search" },
  { param: "Rede", value: "Apenas Pesquisa Google (desativar parceiros e Display)" },
  { param: "Localização", value: "Belo Horizonte + raio de 30km" },
  { param: "Idioma", value: "Português" },
  { param: "Estratégia de lance", value: "Maximizar cliques (início) → CPA desejado (após 30 conversões)" },
  { param: "Landing page", value: "ads.bewstore.com.br/macbook" },
  { param: "Dispositivos", value: "Todos (mobile priority)" },
  { param: "Horário", value: "Seg-Sáb 8h-20h (horário atendimento)" },
];

const SITELINKS = [
  { text: "Bateria & Autonomia", desc: "Performance original para seu MacBook", url: "/macbook#servicos" },
  { text: "Display Retina", desc: "Calibração de fábrica garantida", url: "/macbook#servicos" },
  { text: "Depoimentos", desc: "4.9 no Google. Veja avaliações", url: "/macbook#depoimentos" },
  { text: "Fale pelo WhatsApp", desc: "Atendimento rápido e sem compromisso", url: "/macbook" },
];

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function SectionNum({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#5E3A2F] text-white text-sm font-bold mr-3 shrink-0">
      {n}
    </span>
  );
}

function Alert({
  type,
  title,
  children,
}: {
  type: "danger" | "warning" | "success" | "info";
  title: string;
  children: React.ReactNode;
}) {
  const styles = {
    danger: "bg-red-50 border-red-200 text-red-900",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
    success: "bg-green-50 border-green-200 text-green-900",
    info: "bg-blue-50 border-blue-200 text-blue-900",
  };
  const icons = { danger: "⚠", warning: "⚠", success: "✓", info: "ℹ" };
  return (
    <div className={`rounded-xl border p-4 mb-4 text-sm leading-relaxed ${styles[type]}`}>
      <div className="font-bold text-sm mb-1 flex items-center gap-1.5">
        <span>{icons[type]}</span> {title}
      </div>
      {children}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition-colors border border-white/10 cursor-pointer"
    >
      {copied ? "✓ Copiado" : "Copiar"}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function WalbertoPage() {
  const [checks, setChecks] = useState<boolean[]>([]);
  const [expandedAd, setExpandedAd] = useState<number | null>(0);

  useEffect(() => {
    const saved = localStorage.getItem("bw-checklist");
    if (saved) {
      setChecks(JSON.parse(saved));
    } else {
      setChecks(new Array(CHECKLIST_ITEMS.length).fill(false));
    }
  }, []);

  const toggleCheck = (i: number) => {
    const next = [...checks];
    next[i] = !next[i];
    setChecks(next);
    localStorage.setItem("bw-checklist", JSON.stringify(next));
  };

  const resetChecks = () => {
    const empty = new Array(CHECKLIST_ITEMS.length).fill(false);
    setChecks(empty);
    localStorage.setItem("bw-checklist", JSON.stringify(empty));
  };

  const completedCount = checks.filter(Boolean).length;
  const progress = checks.length > 0 ? (completedCount / checks.length) * 100 : 0;

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-gray-800">
      {/* HEADER */}
      <header className="bg-gradient-to-br from-[#2A1610] to-[#5E3A2F] text-white py-12">
        <div className="max-w-[860px] mx-auto px-6">
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D2A89B]" />
            Documento Confidencial
          </span>
          <h1 className="text-2xl md:text-3xl font-bold mt-4 tracking-tight">
            Guia de Campanha Google Ads — MacBook
          </h1>
          <p className="text-white/60 mt-2">
            Instruções completas para veicular anúncios sem violação de políticas
          </p>
          <div className="flex gap-6 mt-5 text-xs text-white/40">
            <span>Projeto: B&W Store — ads.bewstore.com.br/macbook</span>
            <span>Data: Março 2026</span>
          </div>
        </div>
      </header>
      <div className="h-[3px] bg-gradient-to-r from-[#5E3A2F] via-[#D2A89B] to-transparent" />

      <div className="max-w-[860px] mx-auto px-6 pb-20">
        {/* 1. CONTEXTO */}
        <section className="py-10 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#2A1610] flex items-center">
            <SectionNum n={1} /> Contexto da Política
          </h2>
          <p className="text-gray-500 text-sm mb-6 ml-11">
            Por que este anúncio exige cuidado especial e o que o Google proíbe.
          </p>
          <Alert type="danger" title="POLÍTICA CRÍTICA: Third-Party Consumer Technical Support">
            O Google Ads <strong>proíbe completamente</strong> anúncios de
            assistência técnica de terceiros para produtos eletrônicos de
            consumo. Isso inclui: reparo de hardware, suporte técnico,
            diagnóstico, recuperação de dados e qualquer serviço de manutenção
            para produtos Apple, Samsung, Dell, etc.
            <br /><br />
            <strong>Referência oficial:</strong>{" "}
            <a
              href="https://support.google.com/adspolicy/answer/13527027"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              support.google.com/adspolicy/answer/13527027
            </a>
          </Alert>
          <Alert type="warning" title="MESMO AUTORIZADOS SÃO BLOQUEADOS">
            Ser uma Apple Authorized Service Provider (AASP) <strong>NÃO</strong>{" "}
            concede exceção. A política se aplica uniformemente a todos os
            terceiros. Não existe programa de verificação ou whitelist ativo.
          </Alert>
          <Alert type="success" title="O QUE É PERMITIDO">
            <strong>Venda de produtos</strong> (iPhones, MacBooks
            usados/seminovos) com preços claros na landing page. O uso de marcas
            Apple no texto do anúncio é permitido se a página vende produtos da
            marca com preços visíveis.
          </Alert>

          <h3 className="text-sm font-semibold text-[#5E3A2F] mt-6 mb-2">Consequências de violação</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            <li>Reprovação imediata do anúncio</li>
            <li>Aviso de 7 dias antes de suspensão da conta</li>
            <li>Violações repetidas levam a <strong>suspensão permanente</strong></li>
            <li>Desde junho 2025, contas vinculadas a Manager Accounts em violação também podem ser pausadas</li>
          </ul>
        </section>

        {/* 2. ESTRATÉGIA */}
        <section className="py-10 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#2A1610] flex items-center">
            <SectionNum n={2} /> Estratégia de Posicionamento
          </h2>
          <p className="text-gray-500 text-sm mb-6 ml-11">
            Como a landing page foi adaptada para evitar detecção.
          </p>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#2A1610] text-white">
                <tr>
                  <th className="p-3 text-left text-xs uppercase tracking-wider">Termo Removido</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wider">Substituído Por</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {REMOVED_TERMS.map((t, i) => (
                  <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                    <td className="p-3 line-through text-red-400">{t.old}</td>
                    <td className="p-3 text-green-700 font-medium">{t.new}</td>
                    <td className="p-3">
                      <span className="inline-block bg-green-100 text-green-700 text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                        OK
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Alert type="info" title="Disclaimer na página">
            A landing page já possui no rodapé:{" "}
            <em>
              &quot;A B&W Store é uma empresa independente. Apple, MacBook,
              MacBook Air e MacBook Pro são marcas registradas da Apple Inc. Este
              serviço não possui vínculo com a Apple Inc.&quot;
            </em>
          </Alert>
        </section>

        {/* 3. PALAVRAS PROIBIDAS */}
        <section className="py-10 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#2A1610] flex items-center">
            <SectionNum n={3} /> Palavras Proibidas no Anúncio
          </h2>
          <p className="text-gray-500 text-sm mb-6 ml-11">
            Estes termos NÃO podem aparecer em títulos, descrições, extensões ou sitelinks.
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-white border border-red-200 rounded-xl p-5">
              <h3 className="text-red-600 font-semibold text-sm mb-3">✗ NUNCA usar</h3>
              <ul className="space-y-2">
                {BLOCKED_WORDS.map((w) => (
                  <li key={w} className="flex items-center gap-2 text-sm">
                    <span className="inline-block bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0">
                      BLOCK
                    </span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-green-200 rounded-xl p-5">
              <h3 className="text-green-600 font-semibold text-sm mb-3">✓ Termos seguros</h3>
              <ul className="space-y-2">
                {SAFE_WORDS.map((w) => (
                  <li key={w} className="flex items-center gap-2 text-sm">
                    <span className="inline-block bg-green-100 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0">
                      SAFE
                    </span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Alert type="warning" title="ATENÇÃO COM VARIAÇÕES">
            O Google também detecta variações e sinônimos. Evite: &quot;arrumamos&quot;,
            &quot;corrigimos&quot;, &quot;resolva o defeito&quot;, &quot;notebook com defeito&quot;,
            &quot;MacBook quebrado&quot;, &quot;tela quebrada&quot;, &quot;bateria viciada + troca&quot;.
          </Alert>
        </section>

        {/* 4. MODELOS DE ANÚNCIO */}
        <section className="py-10 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#2A1610] flex items-center">
            <SectionNum n={4} /> Modelos de Anúncio Sugeridos
          </h2>
          <p className="text-gray-500 text-sm mb-6 ml-11">
            Clique para expandir. Todos os textos foram validados contra a política.
          </p>

          <div className="space-y-3">
            {AD_MODELS.map((ad, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-shadow hover:shadow-md"
              >
                <button
                  onClick={() => setExpandedAd(expandedAd === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                >
                  <span className="font-semibold text-sm text-[#2A1610] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    {ad.name}
                  </span>
                  <span
                    className={`text-gray-400 transition-transform ${
                      expandedAd === i ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {expandedAd === i && (
                  <div className="bg-[#2A1610] text-gray-300 p-5 font-mono text-[13px] leading-7 relative">
                    <div className="absolute top-3 right-3">
                      <CopyButton
                        text={[
                          ...ad.titles.map((t, j) => `Título ${j + 1}: ${t}`),
                          ...ad.descriptions.map((d, j) => `Descrição ${j + 1}: ${d}`),
                        ].join("\n")}
                      />
                    </div>
                    {ad.titles.map((t, j) => (
                      <div key={j}>
                        <span className="text-gray-500">// Título {j + 1}</span>
                        <br />
                        <span className="text-green-300 font-semibold">{t}</span>
                        <br />
                      </div>
                    ))}
                    <br />
                    {ad.descriptions.map((d, j) => (
                      <div key={j}>
                        <span className="text-gray-500">// Descrição {j + 1}</span>
                        <br />
                        <span className="text-green-300">{d}</span>
                        <br />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 bg-[#7F1D1D] rounded-xl p-5 font-mono text-[13px] leading-7">
            <p className="text-red-300 font-bold text-sm mb-3 font-sans">⚠ EXEMPLO DO QUE NÃO FAZER</p>
            {BAD_EXAMPLES.map((ex) => (
              <div key={ex.text} className="flex items-center gap-3">
                <span className="text-red-300 line-through">{ex.text}</span>
                <span className="text-gray-500 text-xs">← {ex.reason}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. CONFIGURAÇÃO */}
        <section className="py-10 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#2A1610] flex items-center">
            <SectionNum n={5} /> Configuração da Campanha
          </h2>
          <p className="text-gray-500 text-sm mb-6 ml-11">
            Parâmetros recomendados para Search Campaign.
          </p>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead className="bg-[#2A1610] text-white">
                <tr>
                  <th className="p-3 text-left text-xs uppercase tracking-wider">Parâmetro</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wider">Valor Recomendado</th>
                </tr>
              </thead>
              <tbody>
                {CAMPAIGN_CONFIG.map((c, i) => (
                  <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                    <td className="p-3 font-medium">{c.param}</td>
                    <td className="p-3 text-gray-600">{c.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Keywords */}
          <h3 className="text-sm font-semibold text-[#5E3A2F] mb-3">Keywords</h3>
          <div className="grid md:grid-cols-2 gap-3 mb-4">
            <div className="bg-[#2A1610] rounded-xl p-4">
              <p className="text-green-400 font-bold text-xs mb-2 font-sans">✓ Keywords seguras</p>
              {SAFE_KEYWORDS.map((k) => (
                <div key={k} className="text-green-300 font-mono text-[13px]">{k}</div>
              ))}
            </div>
            <div className="bg-[#7F1D1D] rounded-xl p-4">
              <p className="text-red-300 font-bold text-xs mb-2 font-sans">✗ Keywords proibidas</p>
              {BLOCKED_KEYWORDS.map((k) => (
                <div key={k} className="text-red-300 line-through font-mono text-[13px]">{k}</div>
              ))}
            </div>
          </div>

          <Alert type="warning" title="NEGATIVE KEYWORDS OBRIGATÓRIAS">
            Adicione como negativas:{" "}
            <code className="bg-black/5 px-1.5 py-0.5 rounded text-xs">
              conserto, reparo, assistencia tecnica, manutencao, trocar tela,
              trocar bateria, desbloqueio, recuperar dados, suporte tecnico,
              autorizada apple, apple store
            </code>
          </Alert>
        </section>

        {/* 6. EXTENSÕES */}
        <section className="py-10 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#2A1610] flex items-center">
            <SectionNum n={6} /> Extensões de Anúncio
          </h2>
          <p className="text-gray-500 text-sm mb-6 ml-11">
            Assets adicionais para aumentar CTR sem violar políticas.
          </p>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
            <h3 className="text-sm font-semibold px-4 pt-4 text-[#5E3A2F]">Sitelinks</h3>
            <table className="w-full text-sm">
              <thead className="bg-[#2A1610] text-white">
                <tr>
                  <th className="p-3 text-left text-xs uppercase tracking-wider">Texto</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wider">Descrição</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wider">URL</th>
                </tr>
              </thead>
              <tbody>
                {SITELINKS.map((s, i) => (
                  <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                    <td className="p-3 font-medium">{s.text}</td>
                    <td className="p-3 text-gray-600">{s.desc}</td>
                    <td className="p-3 font-mono text-xs text-gray-400">{s.url}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-[#5E3A2F] mb-2">Callout Extensions</h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                <li>Garantia de 1 Ano</li>
                <li>Parcele em 12x</li>
                <li>Nota 4.9 no Google</li>
                <li>Savassi, BH</li>
                <li>Atendimento pelo WhatsApp</li>
                <li>+500 Clientes Atendidos</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-[#5E3A2F] mb-2">Structured Snippets</h3>
              <p className="text-sm text-gray-600">
                <strong>Modelos:</strong> MacBook Air, MacBook Pro, MacBook Neo
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Serviços:</strong> Bateria, Display, Teclado, Check-up
              </p>
              <h3 className="text-sm font-semibold text-[#5E3A2F] mt-4 mb-1">Extensão de Local</h3>
              <p className="text-sm text-gray-500">
                Vincule o Google Business Profile (Rua Alagoas, 1050 – Savassi)
                para exibir endereço e distância.
              </p>
            </div>
          </div>
        </section>

        {/* 7. TRACKING */}
        <section className="py-10 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#2A1610] flex items-center">
            <SectionNum n={7} /> Tracking e Conversões
          </h2>
          <p className="text-gray-500 text-sm mb-6 ml-11">
            Parâmetros UTM e eventos de conversão já configurados na landing page.
          </p>

          <div className="bg-[#2A1610] rounded-xl p-5 font-mono text-[13px] leading-7 mb-4 relative">
            <CopyButton text="utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={adgroupid}&utm_term={keyword}" />
            <p className="text-gray-500 mb-1">// URL final do anúncio</p>
            <p className="text-green-300">https://ads.bewstore.com.br/macbook</p>
            <br />
            <p className="text-gray-500">// Template de tracking (URL suffix)</p>
            <p className="text-green-300 break-all">
              utm_source=google&utm_medium=cpc&utm_campaign={"{campaignid}"}&utm_content={"{adgroupid}"}&utm_term={"{keyword}"}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#2A1610] text-white">
                <tr>
                  <th className="p-3 text-left text-xs uppercase tracking-wider">Evento</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wider">Ação</th>
                  <th className="p-3 text-left text-xs uppercase tracking-wider">Tipo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 font-medium">view_content</td>
                  <td className="p-3 text-gray-600">Página carregada</td>
                  <td className="p-3 text-gray-500">Automático</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 font-medium">click_button</td>
                  <td className="p-3 text-gray-600">Clique em qualquer CTA WhatsApp</td>
                  <td className="p-3">
                    <span className="inline-block bg-green-100 text-green-700 text-[11px] font-bold px-2 py-0.5 rounded">
                      CONVERSÃO PRINCIPAL
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 8. CHECKLIST */}
        <section className="py-10 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#2A1610] flex items-center">
            <SectionNum n={8} /> Checklist Pré-Publicação
          </h2>
          <p className="text-gray-500 text-sm mb-2 ml-11">
            Clique nos itens para marcar como concluído. O progresso é salvo automaticamente.
          </p>

          {/* Progress bar */}
          <div className="ml-11 mb-6 flex items-center gap-3">
            <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progress}%`,
                  background:
                    progress === 100
                      ? "#16A34A"
                      : "linear-gradient(90deg, #5E3A2F, #D2A89B)",
                }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-500 shrink-0">
              {completedCount}/{checks.length}
            </span>
            {completedCount > 0 && (
              <button
                onClick={resetChecks}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                Resetar
              </button>
            )}
          </div>

          {progress === 100 && (
            <Alert type="success" title="TUDO PRONTO!">
              Todos os itens foram verificados. A campanha está pronta para ser publicada.
            </Alert>
          )}

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {CHECKLIST_ITEMS.map((item, i) => (
              <button
                key={i}
                onClick={() => toggleCheck(i)}
                className={`w-full flex items-start gap-4 p-4 text-left transition-colors cursor-pointer ${
                  i < CHECKLIST_ITEMS.length - 1 ? "border-b border-gray-100" : ""
                } ${checks[i] ? "bg-green-50/50" : "hover:bg-gray-50"}`}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all ${
                    checks[i]
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300"
                  }`}
                >
                  {checks[i] && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold transition-colors ${
                      checks[i] ? "text-green-700 line-through" : "text-gray-800"
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 9. PLANO B */}
        <section className="py-10 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#2A1610] flex items-center">
            <SectionNum n={9} /> Plano B — Se o Anúncio For Reprovado
          </h2>
          <p className="text-gray-500 text-sm mb-6 ml-11">
            Ações imediatas caso o Google reprove a campanha.
          </p>

          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
            <h3 className="text-sm font-semibold text-[#5E3A2F] mb-3">Passo a passo</h3>
            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
              <li><strong>NÃO edite e resubmeta o mesmo anúncio</strong> — isso gera mais flags na conta</li>
              <li><strong>Solicite revisão manual</strong> via &quot;Fazer apelação&quot; no painel do Google Ads</li>
              <li>Se a revisão manual mantiver a reprovação, <strong>pause a campanha imediatamente</strong></li>
              <li>Verifique se algum termo foi adicionado acidentalmente em extensões ou keywords</li>
              <li>Considere criar uma nova campanha do zero em vez de editar a reprovada</li>
            </ol>
          </div>

          <Alert type="info" title="ALTERNATIVAS DE MÍDIA SEM RESTRIÇÃO">
            Estas plataformas <strong>NÃO possuem</strong> a mesma restrição:
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong>Meta Ads</strong> (Facebook + Instagram)</li>
              <li><strong>TikTok Ads</strong> — ideal para vídeo de antes/depois</li>
              <li><strong>Google Meu Negócio</strong> — listagem orgânica gratuita</li>
              <li><strong>SEO orgânico</strong> — posicionamento sem restrição de termos</li>
            </ul>
          </Alert>
        </section>

        {/* 10. CONTATO */}
        <section className="py-10">
          <h2 className="text-xl font-bold text-[#2A1610] flex items-center">
            <SectionNum n={10} /> Contato e Alinhamento
          </h2>
          <p className="text-gray-500 text-sm mb-6 ml-11">
            Em caso de dúvidas sobre o posicionamento ou ajustes na landing page.
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-[#5E3A2F] mb-2">Landing page</h3>
              <div className="text-sm text-gray-500 space-y-1">
                <p><strong className="text-gray-700">URL:</strong> ads.bewstore.com.br/macbook</p>
                <p><strong className="text-gray-700">Hospedagem:</strong> Vercel (deploy automático via GitHub)</p>
                <p><strong className="text-gray-700">Stack:</strong> Next.js + React</p>
                <p><strong className="text-gray-700">CRM:</strong> Helena (WhatsApp integrado)</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-[#5E3A2F] mb-2">B&W Store</h3>
              <div className="text-sm text-gray-500 space-y-1">
                <p><strong className="text-gray-700">Endereço:</strong> Rua Alagoas, 1050 – Savassi, BH</p>
                <p><strong className="text-gray-700">Telefone:</strong> (31) 3889-0437</p>
                <p><strong className="text-gray-700">WhatsApp:</strong> (31) 99074-2171</p>
                <p><strong className="text-gray-700">Instagram:</strong> @bewstoreoficial</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-8 text-center text-xs text-gray-400">
        <p>Documento preparado para uso interno — B&W Store &copy; 2026</p>
        <p className="mt-1">
          Baseado na política Google Ads &quot;Third-party consumer technical support&quot;
          (support.google.com/adspolicy/answer/13527027)
        </p>
      </footer>
    </main>
  );
}
