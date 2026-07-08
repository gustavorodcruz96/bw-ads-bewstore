import type { Metadata } from "next";
import { ServiceCampaignPage } from "@/components/ads/ServiceCampaignPage";

export const metadata: Metadata = {
  title: "Troca de Tela iPad em BH | Bew Store",
  description:
    "Troca de tela de iPad em Belo Horizonte para falhas de imagem, touch irregular, manchas, linhas e impactos. Avaliação e orçamento via WhatsApp.",
  keywords:
    "troca de tela ipad bh, tela ipad quebrada, touch ipad falhando, conserto ipad belo horizonte, bew store",
};

export default function IpadScreenPage() {
  return <ServiceCampaignPage variant="ipad-screen" />;
}
