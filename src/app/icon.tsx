import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Branded favicon — ink rounded square with a mint ascending chevron. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0C231E",
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="46" height="46" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="12.5" stroke="#0E5A4A" strokeWidth="2.5" fill="none" />
          <g stroke="#F7F6F1" strokeWidth="2.4" strokeLinecap="round" fill="none">
            <path d="M15.5 14.5h9" />
            <path d="M15.5 18.5h9" />
            <path d="M22.5 14.5c0 4-1.7 6-6 6h-1l7 6" />
          </g>
          <circle cx="30.5" cy="10" r="2.4" fill="#F6A623" />
        </svg>
      </div>
    ),
    size,
  );
}
