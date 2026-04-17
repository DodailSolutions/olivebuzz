import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Olive Buzz — Safe School Social Platform"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#808b47",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.13), transparent 65%)",
          }}
        />
        {/* Bottom-right decoration circle */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        {/* Top-left decoration circle */}
        <div
          style={{
            position: "absolute",
            top: -60,
            left: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />

        {/* Logo icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 110,
            height: 110,
            borderRadius: 28,
            background: "#57714d",
            marginBottom: 32,
            boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
          }}
        >
          {/* Olive branch + "B" simplified icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#f2b239",
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.2)",
            }}
          />
        </div>

        {/* App name */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "white",
            letterSpacing: -2,
            marginBottom: 20,
            textShadow: "0 2px 20px rgba(0,0,0,0.2)",
          }}
        >
          Olive Buzz
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.88)",
            textAlign: "center",
            maxWidth: 780,
            lineHeight: 1.45,
            marginBottom: 44,
          }}
        >
          Safe, Private School Social Media &amp; News Platform
        </div>

        {/* Pill badges */}
        <div style={{ display: "flex", gap: 16 }}>
          {["Students", "Parents", "Teachers", "Schools"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 22px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.15)",
                color: "white",
                fontSize: 18,
                fontWeight: 600,
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            color: "rgba(255,255,255,0.6)",
            fontSize: 20,
            letterSpacing: 0.5,
          }}
        >
          olivebuzz.dodail.com
        </div>
      </div>
    ),
    { ...size },
  )
}
