import type { Metadata } from "next";
import { ServiceCampaignPage } from "@/components/ads/ServiceCampaignPage";

export const metadata: Metadata = {
  title: "Manutenção, Vidro e Tela de iPad em BH | Bew Store",
  description:
    "Manutenção de iPad em Belo Horizonte, troca de vidro e troca de tela com diagnóstico técnico, proposta transparente e atendimento via WhatsApp.",
  keywords:
    "manutenção ipad bh, troca de vidro ipad bh, troca de tela ipad bh, avaliação ipad belo horizonte, bew store",
};

export default function IpadMaintenancePage() {
  return <ServiceCampaignPage variant="ipad-maintenance" />;
}
