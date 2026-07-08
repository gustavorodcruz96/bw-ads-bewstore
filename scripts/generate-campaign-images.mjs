import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outDir = path.resolve("src/assets/generated-campaigns");
const width = 1920;
const height = 1080;

const crackPaths = [
  "M0 0 L-120 -80 M0 0 L-72 90 M0 0 L86 -100 M0 0 L126 58 M0 0 L-160 18",
  "M0 0 L-90 -34 L-172 -22 M0 0 L-38 118 L-76 196 M0 0 L98 -46 L178 -92 M0 0 L142 98",
  "M0 0 L-46 -132 M0 0 L66 -162 M0 0 L-126 84 M0 0 L42 122 L78 188",
];

function bgSvg({ accent = "#d2a89b", label = "" }) {
  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#050505"/>
        <stop offset="0.42" stop-color="#0c0b0a"/>
        <stop offset="1" stop-color="#17110f"/>
      </linearGradient>
      <radialGradient id="spot" cx="72%" cy="42%" r="52%">
        <stop offset="0" stop-color="${accent}" stop-opacity=".26"/>
        <stop offset=".42" stop-color="${accent}" stop-opacity=".08"/>
        <stop offset="1" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
        <feComponentTransfer>
          <feFuncA type="table" tableValues="0 .08"/>
        </feComponentTransfer>
      </filter>
      <filter id="blur"><feGaussianBlur stdDeviation="28"/></filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect width="100%" height="100%" fill="url(#spot)"/>
    <path d="M0 765 C320 710 468 850 728 800 C1020 742 1230 665 1920 748 L1920 1080 L0 1080 Z" fill="#0a0a0a"/>
    <path d="M760 742 C1040 694 1270 690 1600 738" stroke="${accent}" stroke-width="2" opacity=".25" fill="none"/>
    <ellipse cx="1280" cy="812" rx="520" ry="82" fill="#000" opacity=".34" filter="url(#blur)"/>
    <rect width="100%" height="100%" filter="url(#grain)" opacity=".55"/>
    <text x="-9999" y="-9999">${label}</text>
  </svg>`;
}

function iPadSvg({ mode }) {
  const cracked = mode === "glass";
  const screenIssue = mode === "screen";
  const hoverPanel = screenIssue
    ? `<g transform="translate(1120 285) rotate(-8)">
        <rect x="0" y="0" width="520" height="348" rx="34" fill="url(#glass)" stroke="#f5eee9" stroke-opacity=".22" stroke-width="2"/>
        <path d="M24 52 C190 12 332 18 490 84" stroke="#fff" stroke-opacity=".28" stroke-width="3" fill="none"/>
        <path d="M84 286 C224 326 358 314 474 262" stroke="#d2a89b" stroke-opacity=".26" stroke-width="2" fill="none"/>
      </g>`
    : "";
  const cracks = cracked
    ? `<g transform="translate(420 250)" stroke="#fff" stroke-opacity=".74" stroke-width="3" fill="none">
        ${crackPaths.map((d) => `<path d="${d}"/>`).join("")}
        <circle r="18" fill="#fff" opacity=".18"/>
      </g>`
    : "";
  const screenContent = screenIssue
    ? `<rect x="0" y="0" width="760" height="502" rx="38" fill="#070707"/>
       <path d="M76 126 H680 M76 232 H604 M76 338 H650" stroke="#2b2b2b" stroke-width="16" stroke-linecap="round"/>
       <path d="M110 430 C260 372 440 506 646 398" stroke="#d2a89b" stroke-opacity=".28" stroke-width="8" fill="none"/>`
    : `<rect x="0" y="0" width="760" height="502" rx="38" fill="#121314"/>
       <rect x="88" y="112" width="584" height="276" rx="28" fill="#191817" stroke="#4b3b34" stroke-width="2"/>
       <path d="M128 186 H632 M128 260 H554 M128 332 H610" stroke="#302a27" stroke-width="18" stroke-linecap="round"/>`;
  const glassLift = cracked
    ? `<g transform="translate(244 92) rotate(-3)">
        <rect x="0" y="0" width="430" height="288" rx="30" fill="url(#glass)" stroke="#fff" stroke-opacity=".24" stroke-width="2"/>
        <path d="M44 64 C160 20 298 28 392 78" stroke="#fff" stroke-opacity=".35" stroke-width="4" fill="none"/>
        <path d="M76 248 C190 288 308 276 392 230" stroke="#d2a89b" stroke-opacity=".28" stroke-width="3" fill="none"/>
      </g>`
    : "";

  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="edge" x1="0" x2="1">
        <stop offset="0" stop-color="#1b1c1f"/>
        <stop offset=".5" stop-color="#f2eee8"/>
        <stop offset="1" stop-color="#111214"/>
      </linearGradient>
      <linearGradient id="glass" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity=".34"/>
        <stop offset=".35" stop-color="#ffffff" stop-opacity=".08"/>
        <stop offset="1" stop-color="#030303" stop-opacity=".28"/>
      </linearGradient>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="40" stdDeviation="38" flood-color="#000" flood-opacity=".72"/>
      </filter>
      <filter id="toolShadow"><feDropShadow dx="0" dy="12" stdDeviation="9" flood-color="#000" flood-opacity=".55"/></filter>
    </defs>
    <g transform="translate(970 248) rotate(-8)" filter="url(#shadow)">
      <rect x="-35" y="-35" width="830" height="572" rx="58" fill="url(#edge)"/>
      <rect x="-20" y="-20" width="800" height="542" rx="50" fill="#050505"/>
      ${screenContent}
      <path d="M52 76 C250 18 470 40 716 100" stroke="#fff" stroke-width="5" stroke-opacity=".20" fill="none"/>
      <path d="M650 28 C700 38 734 62 764 100" stroke="#d2a89b" stroke-width="4" stroke-opacity=".38" fill="none"/>
      ${cracks}
      ${glassLift}
    </g>
    ${hoverPanel}
    <g transform="translate(1180 830) rotate(-8)" filter="url(#toolShadow)" opacity=".9">
      <rect width="360" height="22" rx="11" fill="#1b1b1b"/>
      <rect x="244" y="5" width="88" height="12" rx="6" fill="#d2a89b" opacity=".75"/>
    </g>
    <g transform="translate(1468 780) rotate(22)" filter="url(#toolShadow)" opacity=".86">
      <rect width="260" height="18" rx="9" fill="#111"/>
      <circle cx="28" cy="9" r="22" fill="#222"/>
    </g>
  </svg>`;
}

function watchSvg() {
  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="case" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#303033"/>
        <stop offset=".42" stop-color="#0c0c0d"/>
        <stop offset="1" stop-color="#656160"/>
      </linearGradient>
      <linearGradient id="strap" x1="0" x2="1">
        <stop offset="0" stop-color="#090909"/>
        <stop offset=".55" stop-color="#24211f"/>
        <stop offset="1" stop-color="#070707"/>
      </linearGradient>
      <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="44" stdDeviation="42" flood-color="#000" flood-opacity=".75"/>
      </filter>
    </defs>
    <g transform="translate(1150 136) rotate(-13)" filter="url(#shadow)">
      <path d="M222 18 C444 -42 612 78 594 254 C582 392 454 456 292 438 C128 420 12 314 34 180 C50 82 112 44 222 18Z" fill="url(#strap)" opacity=".76"/>
      <path d="M426 368 C598 500 552 704 370 836 C314 876 260 896 202 894 C268 800 300 700 278 590 C262 506 214 438 146 380 Z" fill="url(#strap)" opacity=".92"/>
      <rect x="0" y="160" width="520" height="520" rx="132" fill="url(#case)"/>
      <rect x="36" y="196" width="448" height="448" rx="102" fill="#050505"/>
      <rect x="64" y="224" width="392" height="392" rx="82" fill="#111"/>
      <path d="M96 314 C180 250 308 236 410 286" stroke="#fff" stroke-opacity=".18" stroke-width="5" fill="none"/>
      <path d="M348 178 h48 c28 0 52 24 52 52 v10" stroke="#d2a89b" stroke-width="6" stroke-opacity=".34" fill="none"/>
      <g transform="translate(262 412)" stroke="#fff" stroke-opacity=".78" stroke-width="4" fill="none">
        ${crackPaths.map((d) => `<path d="${d}"/>`).join("")}
        <circle r="22" fill="#fff" opacity=".18"/>
      </g>
      <rect x="512" y="318" width="56" height="116" rx="24" fill="#1f1f1f"/>
      <circle cx="540" cy="278" r="42" fill="#211f1e" stroke="#d2a89b" stroke-width="8"/>
    </g>
  </svg>`;
}

async function renderComposite(file, foreground, options = {}) {
  const accent = options.accent ?? "#d2a89b";
  const bg = await sharp(Buffer.from(bgSvg({ accent, label: file }))).png().toBuffer();
  const fg = await sharp(Buffer.from(foreground)).png().toBuffer();

  await sharp(bg)
    .composite([
      { input: fg, left: 0, top: 0 },
      {
        input: Buffer.from(`
          <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="copy" x1="0" x2=".72">
                <stop offset="0" stop-color="#000" stop-opacity=".82"/>
                <stop offset=".48" stop-color="#000" stop-opacity=".48"/>
                <stop offset="1" stop-color="#000" stop-opacity="0"/>
              </linearGradient>
              <linearGradient id="vignette" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stop-color="#000" stop-opacity=".2"/>
                <stop offset=".55" stop-color="#000" stop-opacity="0"/>
                <stop offset="1" stop-color="#000" stop-opacity=".44"/>
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#copy)" opacity=".78"/>
            <rect width="100%" height="100%" fill="url(#vignette)"/>
          </svg>`),
      },
    ])
    .webp({ quality: 88 })
    .toFile(path.join(outDir, file));
}

await fs.mkdir(outDir, { recursive: true });

await renderComposite("ipad-maintenance-hero.webp", iPadSvg({ mode: "maintenance" }));
await renderComposite("ipad-glass-hero.webp", iPadSvg({ mode: "glass" }));
await renderComposite("ipad-screen-hero.webp", iPadSvg({ mode: "screen" }));
await renderComposite("apple-watch-glass-hero.webp", watchSvg(), { accent: "#c89b7d" });

console.log(`Generated campaign images in ${outDir}`);
