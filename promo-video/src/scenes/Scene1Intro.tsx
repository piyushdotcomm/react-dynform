import { AbsoluteFill } from "remotion";
import { HeroGeometric } from "../components/ui/shape-landing-hero";

export const Scene1Intro: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: "var(--background)" }}>
            <HeroGeometric
                badge="react-dynform"
                title1="Ship faster with"
                title2="Dynamic Forms"
            />
        </AbsoluteFill>
    );
};
