/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // Platform brand badges live in /public/images/svg/platform and are
    // rendered through next/image. The optimizer refuses SVG unless this
    // flag is on; only local, same-origin SVGs are served and Next wraps
    // them in a restrictive content-security-policy.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'none'; script-src 'none'; style-src 'unsafe-inline';",
  },
};

export default nextConfig;
