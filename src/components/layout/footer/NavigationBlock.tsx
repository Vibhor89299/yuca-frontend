import { Link } from 'react-router-dom';
import { footerNavSections } from '../types/navigation';

export function NavigationBlock() {
    return (
        <div className="grid grid-cols-2 gap-12 md:gap-20">
            {footerNavSections.map((section) => (
                <div key={section.title} className="flex flex-col gap-4">
                    {/* Section Header */}
                    <h4
                        className="text-xs uppercase tracking-[0.15em] text-blanket/50 font-medium"
                        style={{ fontFamily: "'Afacad', sans-serif" }}
                    >
                        {section.title}
                    </h4>

                    {/* Links */}
                    <nav className="flex flex-col gap-2">
                        {section.links.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className="text-blanket/70 hover:text-oak text-sm tracking-wide transition-colors duration-200"
                                style={{ fontFamily: "'Afacad', sans-serif" }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            ))}
        </div>
    );
}
