import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useState } from 'react';

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function DiwaliOfferBanner() {
  // Set your Diwali offer end date (IST). Update if needed.
  const offerEnd = useMemo(() => new Date('2025-11-05T23:59:59+05:30').getTime(), []);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => ({ days: 0, hours: 0, minutes: 0, seconds: 0 }));
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const distance = offerEnd - now;
      if (distance <= 0) {
        setExpired(true);
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [offerEnd]);

  if (expired) return null;

  return (
    <section className="relative w-full bg-blanket/5 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl bg-gradient-to-r from-kimber/15 via-blanket/15 to-kimber/10 backdrop-blur-md border border-blanket/30 shadow-lg shadow-kimber/10 ring-1 ring-blanket/20 px-4 md:px-6 py-5 md:py-7 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-autumnFern">Diwali Special</span>
              <span className="rounded-full bg-blanket/25 text-kimber text-[10px] md:text-xs px-2 py-0.5">Limited Time</span>
              <span className="rounded-full bg-blanket/25 text-kimber text-[10px] md:text-xs px-2 py-0.5">Sitewide</span>
            </div>
            <h3 className="text-xl md:text-3xl lg:text-4xl font-semibold text-kimber drop-shadow-sm">
              Diwali Luxury Sale — 10% OFF on all products
            </h3>
            <p className="text-xs md:text-sm text-kimber/90 mt-1">
              Elevate your home with our Luxury & Decorative collections. Offer auto‑applies at checkout.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-kimber">
            <CountdownPill label="Days" value={timeLeft.days} />
            <SeparatorDot />
            <CountdownPill label="Hours" value={timeLeft.hours} />
            <SeparatorDot />
            <CountdownPill label="Mins" value={timeLeft.minutes} />
            <SeparatorDot />
            <CountdownPill label="Secs" value={timeLeft.seconds} />
          </div>

          <Button asChild size="lg" className="luxury-button" aria-label="Shop Diwali Offers">
            <Link to="/category/kosha">Shop Diwali Offers</Link>
          </Button>
        </div>
        </div>
      </div>
    </section>
  );
}

function CountdownPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="rounded-md bg-blanket/25 px-2.5 py-1 text-kimber tabular-nums text-base md:text-lg font-semibold shadow-sm">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[10px] md:text-xs text-kimber/80">{label}</span>
    </div>
  );
}

function SeparatorDot() {
  return <span className="text-kimber/50">:</span>;
}

export default DiwaliOfferBanner;



