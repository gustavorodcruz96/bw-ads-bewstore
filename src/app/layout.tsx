import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "@/index.css";
import Script from "next/script";

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
        {pixelId && (
          <Script id="tiktok-pixel" strategy="afterInteractive">
            {`
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;
                var ttq=w[t]=w[t]||[];
                ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
                ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
                for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
                ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
                ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var i=document.createElement("script");i.type="text/javascript",i.async=!0,i.src=r+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(i,a)};
                ttq.load('${pixelId}');
                ttq.page();
              }(window, document, 'ttq');
            `}
          </Script>
        )}
      </head>
      <body suppressHydrationWarning className={`${montserrat.variable} font-montserrat antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
