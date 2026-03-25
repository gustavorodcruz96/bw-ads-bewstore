import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manutenção MacBook em BH | Bew Store - Diagnóstico e Reparo Especializado",
  description:
    "Manutenção especializada para MacBook em Belo Horizonte. Diagnóstico técnico, troca de bateria, tela e teclado. Orçamento transparente via WhatsApp. Modelos Air, Pro e Neo — M1, M2, M3, M4 e M5.",
  keywords:
    "manutenção macbook bh, reparo macbook belo horizonte, bew store, macbook air, macbook pro, macbook neo, bateria macbook, tela macbook, m5",
};

export default function MacbookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
