import { Link } from 'react-router-dom';
import { policyLinks } from '../types/navigation';

export function PoliciesBlock() {
    return (
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
            {policyLinks.map((link, index) => (
                <span key={link.href} className="flex items-center">
                    <Link
                        to={link.href}
                        className="text-blanket/50 hover:text-blanket/70 text-[13px] tracking-wide transition-colors duration-200"
                        style={{ fontFamily: "'Afacad', sans-serif" }}
                    >
                        {link.label}
                    </Link>
                    {index < policyLinks.length - 1 && (
                        <span className="text-blanket/30 ml-4">·</span>
                    )}
                </span>
            ))}
        </div>
    );
}
