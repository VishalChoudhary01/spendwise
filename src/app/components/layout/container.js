/*
 * Shared page container — the ONE content grid of the site.
 *
 * Owns max-width + horizontal padding only:
 *   max-w-7xl · px-5 sm:px-6 lg:px-8
 *
 * Vertical rhythm belongs to each section — pass py-* through
 * className only where the wrapper itself owns it (e.g. Footer).
 */
const Container = ({ children, className = '' }) => {
    return (
        <div className={`w-full mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 ${className}`}>
            {children}
        </div>
    )
}

export default Container