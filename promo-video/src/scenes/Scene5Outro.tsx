import { interpolate, useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";

export const Scene5Outro: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Fast typing effect
    const command = "npm install @piyushdotcom/react-dynform";
    const lettersToShow = Math.floor(
        interpolate(frame, [5, fps * 1.5], [0, command.length], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
        })
    );

    const textToShow = command.slice(0, lettersToShow);

    const opacity = interpolate(
        frame,
        [0, 10],
        [0, 1],
        { extrapolateRight: "clamp" }
    );

    return (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#000", opacity }}>
            <div
                style={{
                    backgroundColor: "#09090b",
                    padding: "32px 64px",
                    borderRadius: 12,
                    border: "1px solid #27272a",
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    boxShadow: "0 0 50px rgba(255,255,255,0.03)"
                }}
            >
                <span style={{ color: "#71717a", fontSize: 40, fontFamily: "'JetBrains Mono', monospace" }}>$</span>
                <span style={{ color: "#fafafa", fontSize: 40, fontFamily: "'JetBrains Mono', monospace", minWidth: 950 }}>
                    {textToShow}
                    <span style={{
                        display: "inline-block",
                        width: 20,
                        height: 40,
                        backgroundColor: "#fff",
                        verticalAlign: "bottom",
                        marginLeft: 8,
                        opacity: frame % 20 < 10 ? 1 : 0
                    }} />
                </span>
            </div>

            <div style={{
                marginTop: 60,
                color: "#a1a1aa",
                fontSize: 28,
                letterSpacing: "0.05em",
                opacity: interpolate(frame, [fps * 1.5, fps * 2], [0, 1], { extrapolateRight: "clamp" })
            }}>
                PIYUSHDOTCOMM / REACT-DYNFORM
            </div>
        </AbsoluteFill>
    );
};
