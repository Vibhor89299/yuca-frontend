import { SEO } from '@/components/seo/SEO';
import { useEffect, useRef, useState } from 'react';
import bgImgHero from '@/assets/hero-img.png';
import candlesHero from '@/assets/candles_hero.jpeg';
import bowlHero from '@/assets/bowl_hero.jpeg'
import logo from '@/assets/logo.jpg';
import bg from '@/assets/bg.svg';
import { Button } from '@/components/ui/button';
import axiosinstance from '@/axiosinstance/axiosinstance';

import { useNavigate } from 'react-router-dom';
import { formatIndianPrice } from '@/utils/currency';

interface Product {
    _id: string;
    name: string;
    retailPrice: number;
    image: string;
}

export function LandingPage() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [newArrivals, setNewArrivals] = useState<Product[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await axiosinstance.get('/api/products/new-arrivals');
                setNewArrivals(response.data);
            } catch (error) {
                console.error('Error fetching new arrivals:', error);
            }
        };

        fetchNewArrivals();
    }, []);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-reveal, .scroll-reveal-fast').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, [newArrivals]);

    const landingSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "YUCA Lifestyle - Artisanal Home Decor",
        "description": "Discover YUCA's collection of handcrafted candles, bowls, and artisanal home decor",
        "url": "https://yucalifestyle.com/landing"
    };

    return (
        <>
            <SEO
                title="YUCA Lifestyle - Artisanal Home Decor"
                description="Discover YUCA's exclusive collection of handcrafted candles, bowls, and artisanal home decor pieces"
                keywords="yuca lifestyle, artisanal home decor, handcrafted candles, luxury bowls"
                url="https://yucalifestyle.com/landing"
                schema={landingSchema}
            />

            <div className="min-h-screen bg-blanket">
                {/* Hero Section */}
                <section className="relative h-screen w-full overflow-hidden">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${bgImgHero})`,
                            filter: 'brightness(0.7)'
                        }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-kimber/60 via-kimber/40 to-kimber/70" />

                    {/* Content */}
                    <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                        {/* YUCA Text - Top Left */}
                        {/* <div className="absolute top-8 left-8 md:top-12 md:left-12">
                            <h1 className="text-blanket text-2xl md:text-3xl tracking-[0.3em] font-light uppercase">
                                YUCA
                            </h1>
                        </div> */}

                        {/* Center Content - Logo and Tagline */}
                        <div className="flex flex-col items-center">
                            {/* Logo */}
                            <div className="mb-6 md:mb-8 scroll-reveal">
                                <img
                                    src={logo}
                                    alt="Brand logo"
                                    className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain"
                                />
                            </div>

                            {/* Tagline */}
                            <div className="scroll-reveal">
                                <p className="text-[#D4AF37] font-normal text-center" style={{ fontSize: '24px', lineHeight: '100%', letterSpacing: '2%' }}>
                                    A new era of mindful living
                                </p>
                            </div>
                        </div>

                        {/* Bottom Left Text */}
                        <div className="absolute bottom-12 left-8 md:bottom-16 md:left-12 max-w-sm md:max-w-md">
                            <p className="text-blanket text-left" style={{ fontSize: '24px', fontWeight: '400', lineHeight: '100%', letterSpacing: '2%' }}>
                                For those who choose slow over speed, meaning over noise.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Brand Introduction Section */}
                <section className="py-20 md:py-24 px-4 md:px-8 lg:px-16 bg-[#331D12] overflow-hidden">
                    <div className="max-w-7xl mx-auto flex flex-col items-end text-right">
                        {/* Title - YUCA */}
                        <div className="scroll-reveal mb-4 flex items-baseline">
                            <span className="text-blanket text-xs md:text-sm tracking-[0.2em] font-light mr-4 uppercase">at</span>
                            <h2 className="font-butler-regular text-7xl md:text-8xl lg:text-9xl text-blanket tracking-tight leading-none">
                                YUCA
                            </h2>
                        </div>

                        {/* Description */}
                        <div className="scroll-reveal max-w-2xl">
                            <p className="text-blanket/90 font-light leading-relaxed" style={{ fontSize: '18px', letterSpacing: '0.02em', lineHeight: '1.4' }}>
                                we create mindful objects born from nature and shaped by hand. Rooted in Indian craft, each piece celebrates imperfection, sustainability, and quiet luxury—transforming discarded materials into soulful designs that bring warmth, balance, and intention to modern living spaces.
                            </p>
                        </div>
                    </div>
                </section>
                <div style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}>
                    {/* Product Gallery - Horizontal Scroll */}
                    <section className="py-20 md:py-32 relative bg-transparent overflow-hidden">
                        <div className="max-w-[1440px] mx-auto flex items-start">
                            {/* Left Column - Vertical Label (Fixed Width, Absolute Precision) */}
                            <div className="w-12 md:w-16 lg:w-24 flex-shrink-0 flex flex-col items-center pt-24 md:pt-32 lg:pt-36">
                                <div className="writing-mode-vertical transform -rotate-180">
                                    <span
                                        className="text-kimber uppercase whitespace-nowrap"
                                        style={{
                                            fontFamily: "'Philosopher', sans-serif",
                                            fontWeight: '400',
                                            fontSize: '32px',
                                            lineHeight: '100%',
                                            letterSpacing: '0.05em',
                                            textAlign: 'center'
                                        }}
                                    >
                                        New For You
                                    </span>
                                </div>
                            </div>

                            {/* Right Column - Scrolling Container (Hard Cut Clipping) */}
                            <div
                                ref={scrollContainerRef}
                                className="flex-grow overflow-x-auto overflow-y-hidden scrollbar-hide"
                            >
                                <div className="flex gap-4 md:gap-6 pb-10">
                                    {newArrivals.map((product) => (
                                        <div
                                            key={product._id}
                                            className="flex-shrink-0 w-64 md:w-80 lg:w-96 scroll-reveal-fast"
                                            onClick={() => navigate(`/product/${product._id}`)}
                                        >
                                            <div className="bg-transparent overflow-hidden group cursor-pointer">
                                                {/* Product Image */}
                                                <div className="relative aspect-[3/4] overflow-hidden bg-mushroom/10 border border-kimber/5">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    />
                                                </div>

                                                {/* Product Info */}
                                                <div className="pt-6 text-center">
                                                    <h3 className="text-kimber text-sm md:text-base font-light tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-kimber text-lg font-medium mt-1">
                                                        {formatIndianPrice(product.retailPrice)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Candles Section - Split Layout */}
                    <section className="py-20 md:py-32 px-4 md:px-8 lg:px-16 bg-transparent">
                        <div className="max-w-[1440px] mx-auto">
                            <div className="grid md:grid-cols-[1.4fr_1fr] gap-12 md:gap-20 items-end">
                                {/* Left - Dark Block */}
                                <div
                                    className="scroll-reveal w-full overflow-hidden"
                                    style={{ aspectRatio: '840 / 600' }}
                                >
                                    <img
                                        src={candlesHero}
                                        alt="Candles collection"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Right - Content (Left Aligned, Bottom Aligned to the box) */}
                                <div className="scroll-reveal text-left flex flex-col items-start">
                                    <h2 className="text-5xl md:text-6xl text-kimber mb-6 tracking-tight uppercase" style={{ fontFamily: "'Philosopher', sans-serif" }}>
                                        CANDLES
                                    </h2>
                                    <p className="text-kimber/80 font-light leading-relaxed mb-10 max-w-sm" style={{ fontSize: '18px', lineHeight: '1.4' }}>
                                        Bring home the warmth of nature with our Fruity Coconut Shell Candle, hand-poured into real coconut shells. Infused with fresh, juicy fruit notes, this candle fills your space with a vibrant yet soothing aroma that feels uplifting and natural.
                                    </p>
                                    <Button onClick={() => navigate('/category/candles')} variant="link" className="p-0 flex items-center text-kimber text-sm tracking-[0.2em] font-medium uppercase group">
                                        <span>Shop All Candles</span>
                                        <span className="ml-4 transition-transform group-hover:translate-x-2">→</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Bowls Section - Split Layout (Reversed) */}
                    <section className="py-20 md:py-32 px-4 md:px-8 lg:px-16 bg-transparent">
                        <div className="max-w-[1440px] mx-auto">
                            <div className="grid md:grid-cols-[1fr_1.4fr] gap-12 md:gap-20 items-end">
                                {/* Left - Content (Right Aligned, Bottom Aligned to the box) */}
                                <div className="scroll-reveal text-left md:text-right flex flex-col items-start md:items-end order-2 md:order-1">
                                    <h2 className="text-5xl md:text-6xl text-kimber mb-6 tracking-tight uppercase" style={{ fontFamily: "'Philosopher', sans-serif" }}>
                                        BOWLS
                                    </h2>
                                    <p className="text-kimber/80 font-light leading-relaxed mb-10 max-w-sm" style={{ fontSize: '18px', lineHeight: '1.4' }}>
                                        Bring home the warmth of nature with our Fruity Coconut Shell Candle, hand-poured into real coconut shells. Infused with fresh, juicy fruit notes, this candle fills your space with a vibrant yet soothing aroma that feels uplifting and natural.
                                    </p>
                                    <Button onClick={() => navigate('/category/bowls')} variant="link" className="p-0 flex items-center text-kimber text-sm tracking-[0.2em] font-medium uppercase group">
                                        <span>Shop All Bowls</span>
                                        <span className="ml-4 transition-transform group-hover:translate-x-2">→</span>
                                    </Button>
                                </div>

                                {/* Right - Dark Block */}
                                <div
                                    className="scroll-reveal w-full overflow-hidden order-1 md:order-2"
                                    style={{ aspectRatio: '840 / 600' }}
                                >
                                    <img
                                        src={bowlHero}
                                        alt="Bowls collection"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
