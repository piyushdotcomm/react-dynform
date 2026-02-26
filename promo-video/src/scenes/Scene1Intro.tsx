import { interpolate, spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";

export const Scene1Intro: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Snappy entrance
    const titleY = spring({
        fps,
        frame,
        config: { damping: 14, stiffness: 200 },
    });

    const subtitleOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" });
    const subtitleY = interpolate(frame, [10, 25], [20, 0], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#000", color: "#fff" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", width: "100%", height: "100%", transform: `translateY(${interpolate(titleY, [0, 1], [50, 0])}px)` }}>
                <div style={{
                    border: "1px solid #333",
                    padding: "8px 16px",
                    borderRadius: "999px",
                    fontSize: 24,
                    fontWeight: 500,
                    color: "#a1a1aa", // shadcn muted
                    marginBottom: 30,
                    opacity: titleY
                }}>
                    Introducing
                </div>
                <h1
                    style={{
                        fontSize: 100,
                        fontWeight: 800,
                        letterSpacing: "-0.04em",
                        margin: 0,
                        opacity: titleY,
                        color: "#fff"
                    }}
                >
                    react-dynform
                </h1>
                <h2
                    style={{
                        fontSize: 40,
                        fontWeight: 400,
                        color: "#a1a1aa", // shadcn muted foreground
                        marginTop: 24,
                        opacity: subtitleOpacity,
                        transform: `translateY(${subtitleY}px)`,
                        letterSpacing: "-0.02em"
                    }}
                >
                    The schema-driven dynamic form engine.
                </h2>
            </div>
        </AbsoluteFill>
    );
};
