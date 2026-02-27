import { Sequence, AbsoluteFill, useVideoConfig } from "remotion";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Features } from "./scenes/Scene3Features";
import { Scene4UseCases } from "./scenes/Scene4UseCases";
import { Scene5Outro } from "./scenes/Scene5Outro";

export const Main: React.FC = () => {
    const { fps } = useVideoConfig(); // 30 fps

    // Total 735 frames (24.5s)
    // Scene 1 Intro: 0 - 2.5s (75f)
    // Scene 2 Code: 2.5s - 7s (135f)
    // Scene 3 Grid: 7s - 15s (240f) // Expanded from 3.5s to 8s
    // Scene 4 Uses: 15s - 18s (90f)
    // Scene 5 Out: 18s - 24.5s (195f)

    return (
        <AbsoluteFill style={{ backgroundColor: "var(--background)", color: "var(--foreground)", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Sequence from={0} durationInFrames={75}>
                <Scene1Intro />
            </Sequence>

            <Sequence from={75} durationInFrames={135}>
                <Scene2Problem />
            </Sequence>

            <Sequence from={210} durationInFrames={240}>
                <Scene3Features />
            </Sequence>

            <Sequence from={450} durationInFrames={90}>
                <Scene4UseCases />
            </Sequence>

            <Sequence from={540} durationInFrames={195}>
                <Scene5Outro />
            </Sequence>
        </AbsoluteFill>
    );
};
