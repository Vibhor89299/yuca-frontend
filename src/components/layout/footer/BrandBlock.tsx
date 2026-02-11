import { Link } from 'react-router-dom';
import YucaLogo from '../../../assets/logo.jpg';

interface BrandBlockProps {
    tagline?: string;
}

const defaultTagline = 'Mindful objects shaped by hand and nature.';

export function BrandBlock({ tagline = defaultTagline }: BrandBlockProps) {
    return (
        <div className="flex flex-col items-center md:items-start gap-4">
            {/* Logo + Brand Name */}
            <Link to="/" className="flex items-center gap-3 group">
                <div className="h-14 w-14 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105">
                    <img
                        src={YucaLogo}
                        alt="YUCA Logo"
                        className="h-full w-full object-cover"
                    />
                </div>
                <span
                    className="text-2xl font-semibold text-blanket tracking-wider"
                    style={{ fontFamily: "'Afacad', sans-serif" }}
                >
                    YUCA
                </span>
            </Link>

            {/* Tagline */}
            <p className="text-blanket/60 text-[15px] leading-relaxed max-w-xs text-center md:text-left">
                {tagline}
            </p>
        </div>
    );
}
