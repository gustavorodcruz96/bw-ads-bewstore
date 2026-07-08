import type { Metadata } from "next";
import { ServiceCampaignPage } from "@/components/ads/ServiceCampaignPage";

export const metadata: Metadata = {
  title: "Troca de Vidro iPad em BH | Bew Store",
  description:
    "Troca de vidro de iPad em Belo Horizonte com avaliação técnica, acabamento cuidadoso, proposta transparente e atendimento via WhatsApp.",
  keywords:
    "troca de vidro ipad bh, vidro ipad quebrado, conserto vidro ipad belo horizonte, bew store ipad",
};

export default function IpadGlassPage() {
  return <ServiceCampaignPage variant="ipad-glass" />;
}
