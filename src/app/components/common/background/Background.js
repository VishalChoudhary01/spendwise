"use client";

const DEFAULT_ORBS = [
    {
        id: "teal",
        position: "top-left",
        size: "24rem",
        blur: "120px",
        color: "var(--brand-teal)",
        opacity: 0.08,
    },
    {
        id: "orange",
        position: "bottom-right",
        size: "20rem",
        blur: "110px",
        color: "var(--brand-orange)",
        opacity: 0.05,
    },
];

const POSITION_CLASSES = {
    "top-left": "-left-24 top-1/4",
    "top-right": "-right-24 top-1/4",
    "bottom-left": "-left-24 bottom-0",
    "bottom-right": "-right-16 bottom-0",
    "center-left": "-left-24 top-1/2 -translate-y-1/2",
    "center-right": "-right-24 top-1/2 -translate-y-1/2",
    center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
};

export default function Background({
    orbs = DEFAULT_ORBS,
    grid = true,
    gridSize = 44,
    gridOpacity = 0.05,
    className = "",
}) {
    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
        >
            {/* Orbs */}
            {orbs.map((orb) => (
                <div
                    key={orb.id}
                    className={`absolute rounded-full ${POSITION_CLASSES[orb.position]} ${orb.className || ""
                        }`}
                    style={{
                        width: orb.size,
                        height: orb.size,
                        backgroundColor: orb.color,
                        opacity: orb.opacity,
                        filter: `blur(${orb.blur})`,
                    }}
                />
            ))}

            {/* Grid */}
            {grid && (
                <div className=" absolute inset-0 dark:[background-image: linear-gradient( to_right, rgba(255,255,255,0.04)_1px, transparent_1px ), linear-gradient( to_bottom, rgba(255,255,255,0.04)_1px, transparent_1px ) ] " style={{ backgroundImage: ` linear-gradient( to right, rgba(11,36,28,${gridOpacity}) 1px, transparent 1px ), linear-gradient( to bottom, rgba(11,36,28,${gridOpacity}) 1px, transparent 1px ) `, backgroundSize: `${gridSize}px ${gridSize}px`, maskImage: "radial-gradient(ellipse at center, black 10%, transparent 68%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 10%, transparent 68%)", }} />
            )}
        </div>
    );
}