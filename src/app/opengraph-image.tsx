import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Manish P — Software Developer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: "#18181b",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    padding: "80px",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Subtle grid pattern */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />

                {/* Green accent line top-left */}
                <div
                    style={{
                        position: "absolute",
                        top: "0",
                        left: "80px",
                        width: "3px",
                        height: "120px",
                        background: "#33E092",
                        borderRadius: "0 0 2px 2px",
                    }}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative" }}>
                    <p
                        style={{
                            color: "#71717a",
                            fontSize: "16px",
                            fontFamily: "monospace",
                            letterSpacing: "0.25em",
                            textTransform: "uppercase",
                            margin: 0,
                        }}
                    >
                        manishp.dev
                    </p>

                    <h1
                        style={{
                            color: "#fafafa",
                            fontSize: "80px",
                            fontWeight: "700",
                            margin: 0,
                            lineHeight: 1.05,
                        }}
                    >
                        Manish P
                    </h1>

                    <p
                        style={{
                            color: "#a1a1aa",
                            fontSize: "26px",
                            margin: 0,
                            maxWidth: "680px",
                            lineHeight: 1.5,
                        }}
                    >
                        Software developer, technical writer & open-source maintainer
                    </p>

                    <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                        {["C++", "Python", "React", "Cloud Native"].map((tag) => (
                            <span
                                key={tag}
                                style={{
                                    background: "#27272a",
                                    border: "1px solid #3f3f46",
                                    borderRadius: "6px",
                                    padding: "6px 14px",
                                    color: "#a1a1aa",
                                    fontSize: "15px",
                                    fontFamily: "monospace",
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Bottom-right accent */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "80px",
                        right: "80px",
                        width: "120px",
                        height: "3px",
                        background: "#33E092",
                        borderRadius: "2px",
                    }}
                />
            </div>
        ),
        { ...size }
    )
}
