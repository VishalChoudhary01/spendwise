"use client";

import { useState } from "react";

export default function HeroBackgroundVideo({ enabled = true }) {
    const [ready, setReady] = useState(false);

    // Fallback: if autoplay already started before React attached its
    // event handlers, reveal the video immediately instead of waiting
    // (headless/quick-hydration cases never fire onPlaying).
    const handleRef = (node) => {
        if (node && !ready && node.readyState >= 3) setReady(true);
    };

    if (!enabled) return null;

    return (
        <>
            <video
                className="absolute inset-0 h-full w-full object-cover"
                src="/video/green_video.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
                tabIndex={-1}
                controls={false}
                disablePictureInPicture
                ref={handleRef}
                onCanPlay={() => setReady(true)}
                onPlaying={() => setReady(true)}
                style={{
                    opacity: ready ? 1 : 0,
                    transition: "opacity 1s ease",
                }} />
            {/* overlay */}
            <div aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(90deg,rgba(230,246,240,0.82)_0%,rgba(238,248,244,0.65)_40%,rgba(245,248,247,0.4)_75%,rgba(245,248,247,0.04)_100%)] dark:bg-[linear-gradient(90deg,rgba(11,17,16,0.7)_0%,rgba(11,17,16,0.46)_40%,rgba(11,17,16,0.16)_75%,rgba(11,17,16,0.06)_100%)]"/>
        </>
    );
}
