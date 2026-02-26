import { interpolate, spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";

const features = [
    {
        title: "JSON Schema Built In",
        desc: "Generate full UIs from a single standard JSON schema.",
        icon: "{ }"
    },
    {
        title: "Conditional Fields",
        desc: "Built-in if/then logic to mount/unmount sub-fields.",
        icon: "⇄"
    },
    {
        title: "Multi-step Wizards",
        desc: "Paginate massive forms without managing step state.",
        icon: "→"
    },
    {
        title: "Bring Your Own UI",
        desc: "Headless design. Plug in shadcn, MUI, or vanilla CSS.",
        icon: "🎨"
    }
];

export const Scene3Features: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    return (
        <AbsoluteFill style={{ justifyContent: "center", padding: "80px 120px", backgroundColor: "#000" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, width: "100%", height: "100%" }}>
                {features.map((feature, i) => {
                    const delay = i * 12; // FASTER stagger
                    const scale = spring({
                        fps,
                        frame: frame - delay,
                        config: { damping: 14, stiffness: 200 },
                    });

                    const opacity = interpolate(
                        frame - delay,
                        [0, 8],
                        [0, 1],
                        { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
                    );

                    return (
                        <div
                            key={i}
                            style={{
                                backgroundColor: "#09090b",
                                border: "1px solid #27272a",
                                padding: 48,
                                borderRadius: 16,
                                transform: `scale(${scale}) translateY(${interpolate(opacity, [0, 1], [40, 0])}px)`,
                                opacity,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center"
                            }}
                        >
                            <div style={{
                                width: 64, height: 64, borderRadius: 12, backgroundColor: "#18181b",
                                border: "1px solid #27272a", display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 32, marginBottom: 24, color: "#fff"
                            }}>
                                {feature.icon}
                            </div>
                            <h3 style={{ fontSize: 36, fontWeight: 600, color: "#fafafa", margin: "0 0 16px 0", letterSpacing: "-0.02em" }}>
                                {feature.title}
                            </h3>
                            <p style={{ fontSize: 24, color: "#a1a1aa", lineHeight: 1.5, margin: 0 }}>
                                {feature.desc}
                            </p>
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};
