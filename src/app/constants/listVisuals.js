// app/constants/listVisuals.js

export const LIST_VISUALS = {
    grocery: {
        label: "Grocery",
        stage: "bg-cyan-50/70 dark:bg-cyan-400/[0.055]",
        glow: "bg-cyan-400/[0.14] dark:bg-cyan-300/[0.08]",
        secondaryGlow: "bg-teal-300/[0.08] dark:bg-teal-300/[0.045]",
        dot: "bg-accent/35",
        line: "bg-accent/20",
    },

    office: {
        label: "Workspace",
        stage: "bg-sky-50/70 dark:bg-sky-400/[0.055]",
        glow: "bg-sky-400/[0.13] dark:bg-sky-300/[0.08]",
        secondaryGlow: "bg-indigo-300/[0.08] dark:bg-indigo-300/[0.045]",
        dot: "bg-accent/35",
        line: "bg-accent/20",
    },

    birthday: {
        label: "Birthday",
        stage: "bg-amber-50/75 dark:bg-amber-400/[0.055]",
        glow: "bg-amber-300/[0.16] dark:bg-amber-300/[0.08]",
        secondaryGlow: "bg-orange-300/[0.08] dark:bg-orange-300/[0.045]",
        dot: "bg-amber-400/45",
        line: "bg-amber-400/20",
    },

    travel: {
        label: "Travel",
        stage: "bg-blue-50/70 dark:bg-blue-400/[0.055]",
        glow: "bg-blue-400/[0.13] dark:bg-blue-300/[0.08]",
        secondaryGlow: "bg-cyan-300/[0.08] dark:bg-cyan-300/[0.045]",
        dot: "bg-accent/35",
        line: "bg-accent/20",
    },

    wishlist: {
        label: "Wishlist",
        stage: "bg-rose-50/65 dark:bg-rose-400/[0.05]",
        glow: "bg-rose-300/[0.12] dark:bg-rose-300/[0.07]",
        secondaryGlow: "bg-pink-300/[0.08] dark:bg-pink-300/[0.04]",
        dot: "bg-amber-400/40",
        line: "bg-rose-400/20",
    },

    christmas: {
        label: "Christmas",
        stage: "bg-red-50/70 dark:bg-red-400/[0.055]",
        glow: "bg-red-300/[0.14] dark:bg-red-300/[0.08]",
        secondaryGlow: "bg-green-300/[0.08] dark:bg-green-300/[0.045]",
        dot: "bg-red-400/45",
        line: "bg-red-400/20",
    },

    dewali: {
        label: "Dewali",
        stage: "bg-amber-50/70 dark:bg-amber-400/[0.055]",
        glow: "bg-amber-300/[0.15] dark:bg-amber-300/[0.08]",
        secondaryGlow: "bg-orange-300/[0.08] dark:bg-orange-300/[0.045]",
        dot: "bg-amber-400/45",
        line: "bg-amber-400/20",
    },
    holi: {
        label: "Holi",
        stage: "bg-fuchsia-50/70 dark:bg-fuchsia-400/[0.055]",
        glow: "bg-pink-400/[0.14] dark:bg-pink-300/[0.08]",
        secondaryGlow: "bg-orange-300/[0.08] dark:bg-orange-300/[0.045]",
        dot: "bg-pink-400/45",
        line: "bg-pink-400/20",
    },
    "bachelor-room": {
        label: "Room Setup",
        stage: "bg-slate-50/70 dark:bg-slate-400/[0.055]",
        glow: "bg-slate-300/[0.12] dark:bg-slate-300/[0.07]",
        secondaryGlow: "bg-zinc-300/[0.08] dark:bg-zinc-300/[0.045]",
        dot: "bg-slate-400/40",
        line: "bg-slate-400/20",
    },
};

export function getListVisual(category) {
    return LIST_VISUALS[category] ?? LIST_VISUALS.grocery;
}

