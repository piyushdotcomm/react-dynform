import { interpolate, useCurrentFrame, useVideoConfig, AbsoluteFill, Easing } from "remotion";
import React from "react";
import DisplayCards from "../components/ui/display-cards";

const featureCards = [
    {
        iconName: "Layers",
        title: "JSON Schema",
        description: "Full UIs from a single JSON schema",
        date: "Core Feature",
        titleClassName: "text-blue-400",
    },
    {
        iconName: "GitBranch",
        title: "Conditional Fields",
        description: "If/then logic to show/hide fields",
        date: "Built-in",
        titleClassName: "text-emerald-400",
    },
    {
        iconName: "Sparkles",
        title: "Multi-step Wizards",
        description: "Paginate forms without managing state",
        date: "Zero Config",
        titleClassName: "text-violet-400",
    },
    {
        iconName: "Paintbrush",
        title: "Bring Your Own UI",
        description: "Plug in shadcn, MUI, or vanilla CSS",
        date: "Headless",
        titleClassName: "text-amber-400",
    },
];

export const Scene3Features: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Scene is 105 frames (3.5s at 30fps)
    // Schedule: fade in cards, then "hover" each one sequentially
    const fadeIn = interpolate(frame, [0, 15], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const scale = interpolate(frame, [0, 20], [0.92, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.25, 0.4, 0.25, 1),
    });

    // Each card gets "hovered" for ~18 frames with 4-frame overlap
    const hoverDuration = 18;
    const hoverGap = 14;
    const hoverStart = 20; // Start hovering after fade-in

    let activeIndex = -1;
    let activeProgress = 0;

    for (let i = 0; i < featureCards.length; i++) {
        const cardStart = hoverStart + i * hoverGap;
        const cardEnd = cardStart + hoverDuration;

        if (frame >= cardStart && frame < cardEnd) {
            activeIndex = i;
            // Ease in then ease out
            const mid = (cardStart + cardEnd) / 2;
            if (frame < mid) {
                activeProgress = interpolate(frame, [cardStart, mid], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.25, 0.4, 0.25, 1),
                });
            } else {
                activeProgress = interpolate(frame, [mid, cardEnd], [1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.25, 0.4, 0.25, 1),
                });
            }
            break;
        }
    }

    // Title fade
    const titleOpacity = interpolate(frame, [0, 10], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill className="flex items-center justify-center bg-[#030303]">
            <div
                style={{
                    opacity: fadeIn,
                    transform: `scale(${scale})`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 60,
                }}
            >
                <h2
                    className="text-6xl font-bold tracking-tight text-white"
                    style={{ opacity: titleOpacity }}
                >
                    Packed with Features
                </h2>

                <DisplayCards
                    cards={featureCards}
                    activeIndex={activeIndex}
                    activeProgress={activeProgress}
                />
            </div>
        </AbsoluteFill>
    );
};
