import { Link } from 'react-router-dom';
import YucaLogo from '../../../assets/logo.jpg';

interface LogoModuleProps {
    variant?: 'compact' | 'full';
    isTransparent?: boolean;
}

export function LogoModule({ variant = 'compact', isTransparent = false }: LogoModuleProps) {
    const logoSize = variant === 'full' ? 'h-12 w-12' : 'h-10 w-10';
    const textColor = isTransparent ? 'text-blanket' : 'text-blanket';

    return (
        <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0 group"
            aria-label="YUCA Home"
        >
            <div className={`rounded-full ${logoSize} overflow-hidden transition-transform duration-300 group-hover:scale-105`}>
                <img
                    src={YucaLogo}
                    alt="YUCA Logo"
                    className="h-full w-full object-cover rounded-full"
                />
            </div>
            <span
                className={`text-xl font-butler font-extralight ${textColor} tracking-wider transition-opacity duration-200`}
            >
                YUCA
            </span>
        </Link>
    );
}
