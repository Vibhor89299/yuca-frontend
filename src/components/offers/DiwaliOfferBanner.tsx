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
  // Set your Launch Sale end date (IST). Update if needed.
  const offerEnd = useMemo(() => new Date('2025-12-31T23:59:59+05:30').getTime(), []);
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
    <section className="relative w-full bg-blanket/5 py-6 sm:py-8 md:py-12">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="rounded-2xl bg-gradient-to-r from-kimber/15 via-blanket/15 to-kimber/10 backdrop-blur-md border border-blanket/30 shadow-lg shadow-kimber/10 ring-1 ring-blanket/20 px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-7 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-5">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2 mb-2 sm:mb-0">
            <span className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] text-autumnFern">Grand Launch</span>
            <span className="rounded-full bg-blanket/25 text-kimber text-[9px] sm:text-[10px] md:text-xs px-1.5 sm:px-2 py-0.5">Limited Time</span>
            <span className="rounded-full bg-blanket/25 text-kimber text-[9px] sm:text-[10px] md:text-xs px-1.5 sm:px-2 py-0.5">Exclusive</span>
          </div>
          <div className="text-left">
            <h3 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-semibold text-kimber drop-shadow-sm leading-tight">
              Launch Sale — Special Introductory Prices
            </h3>
            <p className="text-xs sm:text-sm text-kimber/90 mt-1 leading-relaxed">
              Discover our handcrafted artisanal collection. Be among the first to experience luxury & sustainability.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6 w-full lg:w-auto">
          <div className="flex items-center gap-1.5 sm:gap-2 text-kimber">
            <CountdownPill label="Days" value={timeLeft.days} />
            <SeparatorDot />
            <CountdownPill label="Hours" value={timeLeft.hours} />
            <SeparatorDot />
            <CountdownPill label="Mins" value={timeLeft.minutes} />
            <SeparatorDot />
            <CountdownPill label="Secs" value={timeLeft.seconds} />
          </div>

          <Button asChild size="sm" className="luxury-button w-full sm:w-auto" aria-label="Shop Launch Sale">
            <Link to="/category/kosha">Shop Launch Sale</Link>
          </Button>
        </div>
        </div>
      </div>
    </section>
  );
}

function CountdownPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center min-w-[3rem] sm:min-w-[3.5rem]">
      <div className="rounded-md bg-blanket/25 px-2 sm:px-2.5 py-1 text-kimber tabular-nums text-sm sm:text-base md:text-lg font-semibold shadow-sm">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[9px] sm:text-[10px] md:text-xs text-kimber/80 mt-0.5">{label}</span>
    </div>
  );
}

function SeparatorDot() {
  return <span className="text-kimber/50">:</span>;
}

export default DiwaliOfferBanner;



