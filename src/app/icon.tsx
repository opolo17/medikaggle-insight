import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="55%" stop-color="#2dd4bf"/>
      <stop offset="100%" stop-color="#10b981"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="7" fill="#0b1120"/>
  <rect x="1" y="1" width="30" height="30" rx="6" fill="none" stroke="url(#brand)" stroke-width="1" opacity="0.35"/>
  <path d="M5 19h3.2l1.6-5.5 2.4 9 2.4-11 2.2 8.5H19l1.2-3.5" fill="none" stroke="url(#brand)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="22" y="21" width="2.5" height="6" rx="0.8" fill="#10b981"/>
  <rect x="25.5" y="23" width="2.5" height="4" rx="0.8" fill="#38bdf8"/>
</svg>`;

export default function Icon() {
  const src = `data:image/svg+xml,${encodeURIComponent(ICON_SVG)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1120",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={32} height={32} alt="" />
      </div>
    ),
    { ...size },
  );
}
