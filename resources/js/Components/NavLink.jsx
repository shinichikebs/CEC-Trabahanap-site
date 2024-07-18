import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, href= "", className = '', children, ...props }) {
    return (
        <Link
            {...props}
            href={href}
            className={ 
                `p-2 text-sm font-medium + ${className}` 
            } 
        >
            {children}
        </Link>
    );
}
