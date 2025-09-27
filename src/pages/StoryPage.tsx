import type React from "react"
import { useCallback,  useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown, Leaf, Heart, Globe, Sparkles, Users} from "lucide-react"

import {  useNavigate } from "react-router-dom"
const ethosData = [
  {
    id: 1,
    title: "Rooted in Earth",
    subtitle: "What comes from the earth returns to the earth.",
    description:
      "Materials: bamboo, jute, clay, cotton. Visual feel: raw textures, muted earth tones. Sustainability is not a trend here — it's a return to source.",
    icon: Leaf,
    image: "/natural-bamboo-and-clay-materials-in-warm-earth-to.jpg",
  },
  {
    id: 2,
    title: "Crafted with Intention",
    subtitle: "Made slow, for those who live slow.",
    description:
      "Hand-touched, artisan-crafted, not mass-produced. Conscious design decisions: simplicity, function, beauty. You sell rituals, not just products — e.g., a bamboo tumbler becomes a slow morning companion.",
    icon: Heart,
    image: "/artisan-hands-crafting-bamboo-products-with-intent.jpg",
  },
  {
    id: 3,
    title: "Modern India with Ancient Soul",
    subtitle: "Inspired by the past, designed for the now.",
    description:
      "Indian influence is subtle: reflected in tone, material, spirit. Avoids stereotypes—celebrates the elegance of restraint. Perfect for global Indians who seek balance between identity and minimalism.",
    icon: Globe,
    image: "/modern-minimalist-indian-design-with-ancient-patte.jpg",
  },
  {
    id: 4,
    title: "Sensory Living",
    subtitle: "Touch. Sip. Breathe. Feel.",
    description:
      "The brand honors raw textures, natural scents, and simple daily actions. It invites users to slow down and be present. Aligns beautifully with wellness, Ayurveda, yoga, and mindful consumption.",
    icon: Sparkles,
    image: "/hands-touching-natural-textures-tea-ceremony-mindf.jpg",
  },
  {
    id: 5,
    title: "Cultural Continuity",
    subtitle: "Carrying forward the portrait of a time.",
    description:
      "YUCA becomes a storyteller — of Indian wisdom, crafts, and the rhythms of nature. Every product can have a micro-story, rooted in a region, ritual, or ancient habit.",
    icon: Users,
    image: "/traditional-indian-crafts-and-wisdom-passed-throug.jpg",
  },
]

export default function OurStoryPage() {
  const [currentEthos, setCurrentEthos] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const stackContainerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const navigate = useNavigate()
  
  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY)

    if (stackContainerRef.current) {
      const container = stackContainerRef.current
      const containerTop = container.offsetTop
      const containerHeight = container.offsetHeight
      const windowHeight = window.innerHeight
      
      // Calculate scroll progress more accurately
      const scrollableHeight = containerHeight - windowHeight
      const scrollProgress = Math.max(0, Math.min(1, (window.scrollY - containerTop) / scrollableHeight))

      // Calculate which ethos should be active based on scroll progress
      // Use (ethosData.length - 1) to prevent going beyond the last item
      const activeIndex = Math.floor(scrollProgress * (ethosData.length - 1))
      const clampedIndex = Math.max(0, Math.min(activeIndex, ethosData.length - 1))

      // Only update if we're within the container bounds and index has changed
      if (clampedIndex !== currentEthos && scrollProgress >= 0 && scrollProgress <= 1) {
        setCurrentEthos(clampedIndex)
      }
    }
  }, [currentEthos])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
          }
        })
      },
      { threshold: 0.2, rootMargin: "-50px 0px" },
    )

    const scrollElements = document.querySelectorAll(".scroll-reveal, .scroll-reveal-fast")
    scrollElements.forEach((el) => {
      if (observerRef.current) {
        observerRef.current.observe(el)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  const scrollToEthos = useCallback(() => {
    if (stackContainerRef.current) {
      stackContainerRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])


  return (
    <div className="min-h-screen bg-blanket scrollbar-hide">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden luxury-gradient-hero">
        <div
          className="absolute inset-0 parallax-slow"
          style={{ "--scroll-y": `${scrollY * 0.3}px` } as React.CSSProperties}
        >
          <img
            src="/serene-natural-landscape-with-bamboo-and-earth-ton.jpg"
            alt="YUCA luxury natural background"
            className="w-full h-full object-cover opacity-30"
            loading="eager"
          />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="scroll-reveal">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-kimber mb-6 text-balance">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl text-khakiMoss mb-8 font-light max-w-2xl mx-auto text-pretty">
              A soulful lifestyle brand that invites you to live consciously, feel deeply, and stay rooted.
            </p>
            <p className="text-lg text-kimber/70 mb-12 max-w-3xl mx-auto text-pretty leading-relaxed">
              For the modern seeker who loves India, but doesn't want it loud. For those who choose slow over speed,
              meaning over noise.
            </p>
            <Button onClick={scrollToEthos} className="luxury-button px-8 py-4 rounded-full text-lg group">
              Discover Our Ethos
              <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center space-y-2 animate-bounce">
            <div className="w-6 h-10 border-2 border-oak rounded-full flex justify-center">
              <div className="w-1 h-3 bg-oak rounded-full mt-2 animate-pulse"></div>
            </div>
            <span className="text-xs text-oak font-medium tracking-wider uppercase">Scroll</span>
          </div>
        </div>
      </section>
      <div ref={stackContainerRef} className="stack-container mb-6" style={{ height: `${(ethosData.length - 1) * 100 + 100}vh` }}>
      {ethosData.map((ethos, index) => {
          const isActive = index === currentEthos
          const isPast = index < currentEthos

          return (
            <div
              key={ethos.id}
              className={`stack-item ${isPast ? "exiting" : "entering"}`}
              style={{
                zIndex: ethosData.length - index,
                background: index % 2 === 0 ? "#f2e0cf" : "#faf8f6",
              }}
            >
              <div className="max-w-7xl mx-auto px-6 w-full">
                <div
                  className={`grid lg:grid-cols-2 gap-16 items-center ${
                    index % 2 === 0 ? "" : "lg:grid-flow-col-dense"
                  }`}
                >
                  {/* Content */}
                  <div className={`space-y-8 ${index % 2 === 0 ? "" : "lg:col-start-2"}`}>
                    <div className={`scroll-reveal-fast ${isActive ? "revealed" : ""}`}>
                      {/* <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 bg-autumnFern rounded-full flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-blanket" />
                        </div>
                        <span className="text-sm font-medium text-khakiMoss tracking-wider uppercase">
                          Ethos {String(index + 1).padStart(2, "0")}
                        </span>
                      </div> */}

                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-oak mb-6 text-balance">
                        {ethos.title}
                      </h2>

                      <p className="text-xl md:text-2xl text-autumnFern font-medium mb-8 text-pretty">
                        "{ethos.subtitle}"
                      </p>

                      <p className="text-lg text-kimber/80 leading-relaxed text-pretty max-w-xl">{ethos.description}</p>

                      <div className="pt-8">
                        <div className="w-20 h-1 bg-oak rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  <div className={`relative ${index % 2 === 0 ? "" : "lg:col-start-1"}`}>
                    <div className={`scroll-reveal-fast ${isActive ? "revealed" : ""}`}>
                      <div className="relative overflow-hidden rounded-2xl luxury-shadow">
                        <img
                          src={ethos.image || "/placeholder.svg"}
                          alt={ethos.title}
                          className="w-full h-[500px] md:h-[600px] object-cover transition-transform duration-700 hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-kimber/20 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {/* Summary Section */}
      <section className="py-[20] bg-kimber text-blanket relative z-10">
        <div className="flex justify center items-center max-w-4xl h-[60vh] mx-auto mt-8  py-6 px-6 text-center">
          <div className="scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-8 text-balance">In Summary: YUCA is...</h2>
            <p className="text-xl leading-relaxed mb-12 text-pretty opacity-90">
              A soulful lifestyle brand that invites you to live consciously, feel deeply, and stay rooted. It's for the
              modern seeker who loves India, but doesn't want it loud. It's for those who choose slow over speed,
              meaning over noise.
            </p>
            <Button onClick={()=>navigate('/category/kosha')} className="bg-oak hover:bg-oak-600 text-blanket px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
              Explore Our Products
            </Button>
          </div>
        </div>
      </section>
      <nav
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block"
        aria-label="Ethos navigation"
      >
        <div className="space-y-4">
          {ethosData.map((ethos, index) => (
            <div key={index} className="flex items-center group">
              <button
                onClick={() => {
                  if (stackContainerRef.current) {
                    const scrollTarget = stackContainerRef.current.offsetTop + index * window.innerHeight
                    window.scrollTo({ top: scrollTarget, behavior: "smooth" })
                  }
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentEthos === index
                    ? "bg-autumnFern scale-125 shadow-lg"
                    : "bg-oak/40 hover:bg-oak/60 hover:scale-110"
                }`}
                aria-label={`Go to ${ethos.title} section`}
                aria-current={currentEthos === index ? "true" : "false"}
              />
            </div>
          ))}
        </div>
      </nav>
    </div>
  )
}
