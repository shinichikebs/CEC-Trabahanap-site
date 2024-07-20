export default function AnchorLink({
    className = "",
    href = "",
    children,
    ...props
}) {
    return (
        <a
            {...props}
            href={href}
            className={`px-4 py-2 text-xs uppercase tracking-widest ${className}`}
        >
            {children}
        </a>
    );
}
