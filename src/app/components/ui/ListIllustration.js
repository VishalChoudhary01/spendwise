export default function ListIllustration({ category, className = "h-12 w-12" }) {
  const strokeProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {category === "grocery" && (
        <>
          <path
            {...strokeProps}
            d="M15 26h34l-3 24.5a4.5 4.5 0 0 1-4.5 4H22.5a4.5 4.5 0 0 1-4.5-4L15 26Z"
          />
          <path {...strokeProps} d="M24 27v-6a8 8 0 0 1 16 0v6" />
          <circle cx="26" cy="38" r="1.6" fill="var(--color-warning)" stroke="none" />
          <circle cx="33" cy="44" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="40" cy="39" r="1.6" fill="currentColor" stroke="none" />
        </>
      )}
      {category === "birthday" && (
        <>
          <rect x="13" y="28" width="38" height="24" rx="3" {...strokeProps} />
          <path {...strokeProps} d="M32 28v24M13 34h38" />
          <path
            d="M32 29c-5 0-9-3-9-6.8 0-2.8 2.4-4.2 5.5-3.3 1.9.5 3 2.2 3.5 4.2.5-2 1.6-3.7 3.5-4.2C38.6 18 41 19.4 41 22.2 41 26 37 29 32 29Z"
            fill="var(--color-warning)"
            stroke="none"
          />
        </>
      )}
      {category === "travel" && (
        <>
          <rect x="14" y="20" width="36" height="32" rx="5" {...strokeProps} />
          <path {...strokeProps} d="M27 20v-3a5 5 0 0 1 10 0v3" />
          <path {...strokeProps} d="M22 52v3M42 52v3" />
          <circle cx="32" cy="37" r="2.5" fill="var(--color-warning)" stroke="none" />
        </>
      )}
      {category === "wishlist" && (
        <>
          <path
            {...strokeProps}
            d="M32 51S12 39 12 25.5C12 19 17 14 23 14c4 0 7.5 2 9 5 1.5-3 5-5 9-5 6 0 11 5 11 11.5C53 39 32 51 32 51Z"
          />
          <path
            d="M44 12l1.5 3.5L49 17l-3.5 1.5L44 22l-1.5-3.5L39 17l3.5-1.5L44 12Z"
            fill="var(--color-warning)"
            stroke="none"
          />
        </>
      )}
      {category === "office" && (
        <>
          <rect x="16" y="18" width="32" height="22" rx="3" {...strokeProps} />
          <path {...strokeProps} d="M22 40v8h20v-8M28 18v-2a4 4 0 0 1 8 0v2" />
          <circle cx="32" cy="30" r="2" fill="var(--color-warning)" stroke="none" />
        </>
      )}
      {category === "christmas" && (
        <>
          <path
            {...strokeProps}
            d="M32 8l-14 22h8l-6 10h28l-6-10h8L32 8Z"
          />
          <rect x="28" y="40" width="8" height="12" rx="1" {...strokeProps} />
          <path d="M32 14l1.5 3 3.5.5-2.5 2.4.6 3.5L32 21.5l-3.1 1.9.6-3.5L27 17.5l3.5-.5L32 14Z"
            fill="var(--color-warning)" stroke="none" />
        </>
      )}
      {category === "dewali" && (
        <>
          <ellipse cx="32" cy="50" rx="12" ry="4" {...strokeProps} />
          <path d="M26 50V32a6 6 0 0 1 12 0v18" {...strokeProps} />
          <path d="M32 14c-2 4-6 6-6 10a6 6 0 0 0 12 0c0-4-4-6-6-10Z"
            fill="var(--color-warning)" stroke="none" />
          <path d="M20 44l-4-2M44 44l4-2M32 46v-5" {...strokeProps} strokeWidth={1.5} />
        </>
      )}
      {category === "bachelor-room" && (
        <>
          <rect x="12" y="34" width="40" height="16" rx="3" {...strokeProps} />
          <path d="M16 50v4M48 50v4" {...strokeProps} />
          <rect x="18" y="24" width="16" height="10" rx="2" {...strokeProps} />
          <rect x="38" y="28" width="8" height="6" rx="1" {...strokeProps} />
          <circle cx="42" cy="30" r="1.5" fill="var(--color-warning)" stroke="none" />
        </>
      )}
    </svg>
  );
}
