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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon-bew.webp" />
        <script src="/tiktok-pixel.js" />
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
