export default function Button({ className = "", children, ...props }) {
    return (
        <button {...props} className={`` + className}>
            {children}
        </button>
    );
}
