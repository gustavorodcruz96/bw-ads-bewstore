import type { Metadata } from "next";
import { ServiceCampaignPage } from "@/components/ads/ServiceCampaignPage";

export const metadata: Metadata = {
  title: "Troca de Vidro Apple Watch em BH | Bew Store",
  description:
    "Troca de vidro de Apple Watch em Belo Horizonte com avaliação técnica, acabamento cuidadoso, teste de touch e atendimento via WhatsApp.",
  keywords:
    "troca de vidro apple watch bh, vidro apple watch quebrado, avaliação apple watch belo horizonte, bew store",
};

export default function AppleWatchGlassPage() {
  return <ServiceCampaignPage variant="apple-watch-glass" />;
}
