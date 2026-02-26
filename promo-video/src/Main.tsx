import { Sequence, AbsoluteFill, useVideoConfig } from "remotion";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Features } from "./scenes/Scene3Features";
import { Scene4UseCases } from "./scenes/Scene4UseCases";
import { Scene5Outro } from "./scenes/Scene5Outro";

export const Main: React.FC = () => {
    const { fps } = useVideoConfig(); // 30 fps

    // Total 510 frames (17s) - Slightly longer to show the outro
    // Scene 1 Intro: 0 - 2.5s (75f)
    // Scene 2 Code: 2.5s - 7s (135f)
    // Scene 3 Grid: 7s - 10.5s (105f)
    // Scene 4 Uses: 10.5s - 13.5s (90f)
    // Scene 5 Out: 13.5s - 17s (105f)

    return (
        <AbsoluteFill style={{ backgroundColor: "#000", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Sequence from={0} durationInFrames={75}>
                <Scene1Intro />
            </Sequence>

            <Sequence from={75} durationInFrames={135}>
                <Scene2Problem />
            </Sequence>

            <Sequence from={210} durationInFrames={105}>
                <Scene3Features />
            </Sequence>

            <Sequence from={315} durationInFrames={90}>
                <Scene4UseCases />
            </Sequence>

            <Sequence from={405} durationInFrames={105}>
                <Scene5Outro />
            </Sequence>
        </AbsoluteFill>
    );
};
