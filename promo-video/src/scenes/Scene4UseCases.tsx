import { interpolate, useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";

const useCases = [
    "E-commerce Checkouts",
    "User Onboarding",
    "Admin Dashboards",
    "Survey Builders",
    "Dynamic Configurations"
];

export const Scene4UseCases: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    return (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#000", padding: "80px" }}>
            <h2
                style={{
                    fontSize: 60,
                    color: "#fff",
                    marginBottom: 60,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    opacity: interpolate(frame, [0, 10], [0, 1])
                }}
            >
                Built for every use case.
            </h2>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20, maxWidth: 1200 }}>
                {useCases.map((useCase, i) => {
                    const delay = i * 6; // Fast pop in
                    const scale = interpolate(
                        frame - delay,
                        [0, 8],
                        [0.8, 1],
                        { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
                    );

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
                                padding: "24px 48px",
                                borderRadius: 999,
                                fontSize: 32,
                                fontWeight: 500,
                                color: "#fafafa",
                                boxShadow: "0 0 30px rgba(255,255,255,0.02)",
                                transform: `scale(${scale})`,
                                opacity
                            }}
                        >
                            {useCase}
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};
