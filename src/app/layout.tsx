import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
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

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon-bew.webp" />
      </head>
      <body
        suppressHydrationWarning
        className={`${montserrat.variable} font-montserrat antialiased bg-background text-foreground`}
      >
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {children}

        {/* Google Tag Manager — beforeInteractive ensures execution before hydration */}
        {gtmId && (
          <Script
            id="gtm-script"
            strategy="beforeInteractive"
            src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
          />
        )}
        {gtmId && (
          <Script
            id="gtm-init"
            strategy="beforeInteractive"
          >{`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'})`}</Script>
        )}

        {/* TikTok Pixel */}
        <Script src="/tiktok-pixel.js" strategy="afterInteractive" />

        {/* Helena Widget */}
        <Script
          src="https://cdn.helena.run/scripts/widget/v2/h-widget-min.js"
          data-companyid="80256f32-1762-433d-a12a-a7fcb1b91598"
          data-widgetid="57e71c97-4bb3-45a2-966f-e79b4a746067"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
