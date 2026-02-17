interface AnnouncementStripProps {
    message?: string;
}

const defaultMessage = 'Pan-India delivery · Crafted in small batches';

export function AnnouncementStrip({ message = defaultMessage }: AnnouncementStripProps) {
    return (
        <div className="announcement-strip bg-kimber border-b border-oak/10">
            <div className="container mx-auto px-4">
                <p className="text-center text-blanket/70 py-2 text-[11px] tracking-[0.08em] uppercase">
                    {message}
                </p>
            </div>
        </div>
    );
}
