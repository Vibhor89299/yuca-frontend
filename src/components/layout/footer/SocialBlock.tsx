import { Instagram, Mail } from 'lucide-react';
import { socialLinks } from '../types/navigation';

export function SocialBlock() {
    const iconMap = {
        instagram: Instagram,
        email: Mail,
    };

    return (
        <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
                const Icon = iconMap[link.platform as keyof typeof iconMap];
                if (!Icon) return null;

                return (
                    <a
                        key={link.platform}
                        href={link.href}
                        target={link.platform === 'email' ? undefined : '_blank'}
                        rel={link.platform === 'email' ? undefined : 'noopener noreferrer'}
                        aria-label={link.label}
                        className="text-blanket/50 hover:text-blanket/80 transition-opacity duration-200"
                    >
                        <Icon className="h-5 w-5" />
                    </a>
                );
            })}
        </div>
    );
}
