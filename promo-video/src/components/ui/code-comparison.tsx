import React from "react";
import { FileIcon } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Remotion-adapted CodeComparison component.
 * Original used shiki + next-themes which don't work in Remotion's
 * frame-by-frame renderer. This version uses static rendering with
 * Tailwind classes matching the dark Shadcn theme.
 */

interface CodeComparisonProps {
    beforeCode: string;
    afterCode: string;
    language: string;
    filename: string;
    beforeLabel?: string;
    afterLabel?: string;
    className?: string;
    style?: React.CSSProperties;
}

export function CodeComparison({
    beforeCode,
    afterCode,
    language,
    filename,
    beforeLabel = "before",
    afterLabel = "after",
    className,
    style,
}: CodeComparisonProps) {
    return (
        <div className={cn("mx-auto w-full", className)} style={style}>
            <div className="relative w-full overflow-hidden rounded-xl border border-white/[0.12]">
                <div className="relative grid grid-cols-2 divide-x divide-white/[0.12]">
                    {/* Before panel */}
                    <div>
                        <div className="flex items-center bg-white/[0.04] px-5 py-3 text-base text-white/70">
                            <FileIcon className="mr-3 h-5 w-5" />
                            {filename}
                            <span className="ml-auto font-medium text-white/40">{beforeLabel}</span>
                        </div>
                        <pre className="h-full overflow-hidden break-all bg-transparent p-6 font-mono text-[22px] leading-relaxed text-white/50">
                            {beforeCode}
                        </pre>
                    </div>
                    {/* After panel */}
                    <div>
                        <div className="flex items-center bg-white/[0.04] px-5 py-3 text-base text-white/70">
                            <FileIcon className="mr-3 h-5 w-5" />
                            {filename}
                            <span className="ml-auto font-medium text-white/40">{afterLabel}</span>
                        </div>
                        <pre className="h-full overflow-hidden break-all bg-transparent p-6 font-mono text-[26px] leading-relaxed text-white/90">
                            {afterCode}
                        </pre>
                    </div>
                </div>
                {/* VS badge */}
                <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-white/[0.08] border border-white/[0.15] text-sm font-bold text-white/80 backdrop-blur-sm">
                    VS
                </div>
            </div>
        </div>
    );
}
