import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import faviconBew from "./assets/favicon-bew.webp";

const existingFavicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;

if (existingFavicon) {
  existingFavicon.type = "image/webp";
  existingFavicon.href = faviconBew;
} else {
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/webp";
  link.href = faviconBew;
  document.head.appendChild(link);
}

createRoot(document.getElementById("root")!).render(<App />);
