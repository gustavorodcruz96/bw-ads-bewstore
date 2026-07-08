import type { Metadata } from "next";
import { ServiceCampaignPage } from "@/components/ads/ServiceCampaignPage";

export const metadata: Metadata = {
  title: "Manutenção de iPad em BH | Bew Store - Reparo Especializado",
  description:
    "Manutenção especializada para iPad em Belo Horizonte. Diagnóstico técnico, troca de vidro, tela, bateria e conectores com atendimento via WhatsApp.",
  keywords:
    "manutenção ipad bh, reparo ipad belo horizonte, assistência ipad bh, troca de tela ipad, troca de vidro ipad, bew store",
};

export default function IpadMaintenancePage() {
  return <ServiceCampaignPage variant="ipad-maintenance" />;
}
