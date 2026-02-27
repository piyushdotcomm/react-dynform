import React from "react";
import { cn } from "../../lib/utils";
import { Sparkles, Layers, GitBranch, Paintbrush } from "lucide-react";

/**
 * Remotion-adapted DisplayCards component.
 * Original used CSS hover transitions which don't work in Remotion.
 * This version accepts an `activeIndex` prop to simulate the hover
 * popup effect frame-by-frame.
 */

const IconMap: Record<string, React.FC<any>> = {
    Sparkles,
    Layers,
    GitBranch,
    Paintbrush,
};

interface DisplayCardProps {
    className?: string;
    iconName?: string;
    title?: string;
    description?: string;
    date?: string;
    iconClassName?: string;
    titleClassName?: string;
    isActive?: boolean;
    /** 0-1 progress for the "hover" lift animation */
    activeProgress?: number;
}

function DisplayCard({
    className,
    iconName = "Sparkles",
    title = "Featured",
    description = "Discover amazing content",
    date = "Just now",
    iconClassName = "text-blue-500",
    titleClassName = "text-blue-500",
    isActive = false,
    activeProgress = 0,
}: DisplayCardProps) {
    const Icon = IconMap[iconName] || Sparkles;

    // Simulate hover: lift up, remove grayscale, remove overlay
    const liftY = isActive ? -40 * activeProgress : 0;
    const grayscale = isActive ? 1 - activeProgress : 1;
    const overlayOpacity = isActive ? 1 - activeProgress : 1;
    const borderColor = isActive
        ? `rgba(255,255,255,${0.1 + 0.15 * activeProgress})`
        : "rgba(255,255,255,0.1)";

    return (
        <div
            className={cn(
                "relative flex h-44 w-[28rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 px-5 py-4",
                className
            )}
            style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(8px)",
                borderColor,
                transform: `skewY(-8deg) translateY(${liftY}px)`,
                filter: `grayscale(${grayscale * 100}%)`,
                transition: "none", // No CSS transitions in Remotion
            }}
        >
            {/* Overlay that fades out on "hover" */}
            <div
                className="absolute inset-0 rounded-xl"
                style={{
                    background: "rgba(9,9,11,0.5)",
                    opacity: isActive ? 0 : overlayOpacity,
                    pointerEvents: "none",
                }}
            />
            <div className="relative z-10 flex items-center gap-2">
                <span className="inline-block rounded-full bg-blue-800 p-1.5">
                    <Icon className="size-5 text-blue-300" />
                </span>
                <p className={cn("text-xl font-medium", titleClassName)}>{title}</p>
            </div>
            <p className="relative z-10 whitespace-nowrap text-xl text-white/80">{description}</p>
            <p className="relative z-10 text-white/40">{date}</p>
        </div>
    );
}

interface DisplayCardsProps {
    cards: DisplayCardProps[];
    /** Index of the card currently being "hovered" (-1 for none) */
    activeIndex?: number;
    /** 0-1 progress for the active card's animation */
    activeProgress?: number;
}

export default function DisplayCards({
    cards,
    activeIndex = -1,
    activeProgress = 0,
}: DisplayCardsProps) {
    return (
        <div
            className="grid place-items-center"
            style={{ gridTemplateAreas: "'stack'" }}
        >
            {cards.map((cardProps, index) => {
                // Stacking offsets
                const translateX = index * 80;
                const translateY = index * 50;

                return (
                    <div
                        key={index}
                        style={{
                            gridArea: "stack",
                            transform: `translateX(${translateX}px) translateY(${translateY}px)`,
                        }}
                    >
                        <DisplayCard
                            {...cardProps}
                            isActive={index === activeIndex}
                            activeProgress={index === activeIndex ? activeProgress : 0}
                        />
                    </div>
                );
            })}
        </div>
    );
}

export { DisplayCard };
