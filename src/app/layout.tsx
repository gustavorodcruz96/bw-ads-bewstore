import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "@/index.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Bew Store | iPhones Seminovos com Garantia",
  description:
    "iPhones seminovos com garantia e procedência. Os melhores preços de BH. Atendimento especializado via WhatsApp.",
  keywords: "iphone seminovo, iphone usado, belo horizonte, bew store, apple",
};

// TikTok Pixel inline script - safe: pixelId is a server env var, not user input
function TikTokPixelScript({ pixelId }: { pixelId: string }) {
  const scriptContent = `!function (w, d, t) {
w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
ttq.load('${pixelId}');
ttq.page();
}(window, document, 'ttq');`;

  // pixelId comes from process.env (server-only), not user input - safe to inline
  return <script dangerouslySetInnerHTML={{ __html: scriptContent }} />;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon-bew.webp" />
        {pixelId && <TikTokPixelScript pixelId={pixelId} />}
      </head>
      <body
        suppressHydrationWarning
        className={`${montserrat.variable} font-montserrat antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
