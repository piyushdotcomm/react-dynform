import React from "react";
import { Circle } from "lucide-react";
import { cn } from "../../lib/utils";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Framer motion params
    // duration: 2.4s, delay
    // ease: [0.23, 0.86, 0.39, 0.96] cubic-bezier
    const startFrame = delay * fps;
    const durationFrames = 2.4 * fps;
    const opacityDurationFrames = 1.2 * fps;

    const progress = interpolate(frame - startFrame, [0, durationFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.23, 0.86, 0.39, 0.96),
    });

    const opacity = interpolate(frame - startFrame, [0, opacityDurationFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // motion.div y: [-150, 0], rotate: [rotate - 15, rotate]
    const y = interpolate(progress, [0, 1], [-150, 0]);
    const r = interpolate(progress, [0, 1], [rotate - 15, rotate]);

    // Floating animation
    // transition: { duration: 12, repeat: Infinity, ease: "easeInOut" }
    // y: [0, 15, 0]
    const floatProgress = (frame % (12 * fps)) / (12 * fps); // 0 to 1 over 12 seconds
    // Map to a sine wave starting at -Math.PI/2 to get a smooth 0 -> 1 -> 0 curve
    const floatY = (Math.sin(floatProgress * Math.PI * 2 - Math.PI / 2) + 1) / 2 * 15;

    return (
        <div
            className={cn("absolute", className)}
            style={{
                opacity,
                transform: `translateY(${y}px) rotate(${r}deg)`,
            }}
        >
            <div
                className="relative"
                style={{
                    width,
                    height,
                    transform: `translateY(${floatY}px)`,
                }}
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2 border-white/[0.15]",
                        "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                    )}
                />
            </div>
        </div>
    );
}

function HeroGeometric({
    badge = "react-dynform",
    title1 = "Elevate Your",
    title2 = "Dynamic Forms",
}: {
    badge?: string;
    title1?: string;
    title2?: string;
}) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const getFadeUpStyles = (i: number) => {
        // delay: 0.5 + i * 0.2
        const delayFrames = (0.5 + i * 0.2) * fps;
        const durationFrames = 1 * fps;

        const progress = interpolate(frame - delayFrames, [0, durationFrames], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.25, 0.4, 0.25, 1),
        });

        return {
            opacity: progress,
            transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
        };
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

            <div className="absolute inset-0 overflow-hidden">
                <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    gradient="from-indigo-500/[0.15]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                />

                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    gradient="from-rose-500/[0.15]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                />

                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    gradient="from-violet-500/[0.15]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                />

                <ElegantShape
                    delay={0.6}
                    width={200}
                    height={60}
                    rotate={20}
                    gradient="from-amber-500/[0.15]"
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                />

                <ElegantShape
                    delay={0.7}
                    width={150}
                    height={40}
                    rotate={-25}
                    gradient="from-cyan-500/[0.15]"
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div
                        style={getFadeUpStyles(0)}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
                    >
                        <Circle className="h-2 w-2 fill-rose-500/80" />
                        <span className="text-sm text-white/60 tracking-wide">
                            {badge}
                        </span>
                    </div>

                    <div style={getFadeUpStyles(1)}>
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                                {title1}
                            </span>
                            <br />
                            <span
                                className={cn(
                                    "bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 "
                                )}
                            >
                                {title2}
                            </span>
                        </h1>
                    </div>

                    <div style={getFadeUpStyles(2)}>
                        <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
                            The schema-driven dynamic form engine. Built directly for your custom UI components.
                        </p>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
        </div>
    );
}

export { HeroGeometric };
