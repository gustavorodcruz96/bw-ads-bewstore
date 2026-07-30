"use client";

import { WHATSAPP_URL } from "@/lib/utm";
import { trackClickButton } from "@/lib/tracking";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function FloatingWhatsAppButton() {
  const handleClick = () => {
    trackClickButton({
      content_id: "whatsapp-floating-global",
      content_name: "WhatsApp CTA - Global Floating Button",
    });
  };

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Bew Store pelo WhatsApp"
      onClick={handleClick}
      className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-black/30 transition-transform duration-200 hover:scale-110 md:bottom-6 md:right-6 md:h-16 md:w-16"
      style={{ background: "linear-gradient(135deg, #1A6B37, #145A2D)" }}
    >
      <WhatsAppIcon className="h-9 w-9 text-white md:h-10 md:w-10" />
    </a>
  );
}
