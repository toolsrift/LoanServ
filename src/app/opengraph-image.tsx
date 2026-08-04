import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — compare and apply for loans`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded OG image using the Ledger palette. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0C231E",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              background: "#0a1c18",
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #1c3a32",
            }}
          >
            <svg width="50" height="50" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="12.5" stroke="#22C58B" strokeWidth="2.5" fill="none" />
              <g stroke="#F7F6F1" strokeWidth="2.4" strokeLinecap="round" fill="none">
                <path d="M15.5 14.5h9" />
                <path d="M15.5 18.5h9" />
                <path d="M22.5 14.5c0 4-1.7 6-6 6h-1l7 6" />
              </g>
              <circle cx="30.5" cy="10" r="2.4" fill="#F6A623" />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#F7F6F1" }}>
            <span>Loan</span>
            <span style={{ color: "#22C58B" }}>Serv</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 68, fontWeight: 700, color: "#F7F6F1", lineHeight: 1.05, maxWidth: 900 }}>
            See your EMI first. Then apply with clarity.
          </div>
          <div style={{ fontSize: 30, color: "#9db3aa", maxWidth: 860 }}>
            Compare &amp; apply for loans across 30+ banks &amp; NBFCs — AP · Telangana · Bangalore · Chennai
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: "#F6A623", color: "#0C231E", fontSize: 26, fontWeight: 700, padding: "12px 28px", borderRadius: 14 }}>
            loanserv.in
          </div>
          <div style={{ fontSize: 22, color: "#9db3aa" }}>DSA facilitator · not a lender</div>
        </div>
      </div>
    ),
    size,
  );
}
