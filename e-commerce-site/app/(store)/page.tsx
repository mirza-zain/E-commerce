
import Link from "next/link";
import Image from "next/image";
import FeaturedItems from "./screens/SpecialItems";
import Blog from "./screens/Blog";
import FeaturedProducts from "./screens/FeaturedProducts";
import Reviews from "./screens/Reviews";

export default function Home() {
  return (
    <>
      <header className="mx-auto flex min-h-[85vh] w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-8">
        <div className="flex w-full flex-col-reverse items-center justify-between gap-10 lg:flex-row">
          <div className="w-full text-center lg:w-1/2 lg:text-left">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold text-neutral-500 mb-3">
              Haute Parfumerie • Pakistan
            </p>
            <h1 className="text-4xl font-black uppercase leading-tight tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl font-[Gebuk]">
              Explore Premium Scent
            </h1>
            <p className="mt-4 text-base sm:text-lg lg:text-xl text-neutral-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Artisanal Extrait de Parfum formulated with concentrated perfume oils. Subtle up close, commanding from afar, and unforgettable once you leave.
            </p>

            {/* Editorial Discovery Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="#featured"
                className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-xs sm:text-sm font-semibold tracking-widest uppercase text-white hover:bg-neutral-800 transition-all duration-200 shadow-sm active:scale-[0.98]"
              >
                <span>Explore Editions</span>
                <span className="text-neutral-400">↓</span>
              </a>

              <a
                href="#story"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white/80 px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-widest uppercase text-neutral-800 hover:border-black hover:bg-white transition-all duration-200"
              >
                <span>The Zarb Standard</span>
              </a>
            </div>

            {/* Luxury Accreditation Badges */}
            <div className="mt-10 pt-6 border-t border-neutral-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-5 sm:gap-6 text-xs text-neutral-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="text-amber-700">✦</span> Extrait Concentration
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-amber-700">✦</span> 12+ Hour Sillage
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-amber-700">✦</span> Express Nationwide Delivery
              </span>
            </div>
          </div>

          <div className="flex w-full items-center justify-center lg:w-1/2">
            <Image 
              src="/images/icon2.png" 
              width={520} 
              height={520} 
              priority 
              className="aspect-square w-4/5 max-w-md rounded-full border-2 border-neutral-200 object-cover shadow-lg sm:w-3/5 lg:w-4/5" 
              alt="Zarb Official luxury perfume bottle" 
            />
          </div>
        </div>
      </header>

      <div id="featured">
        <FeaturedItems />
      </div>

      <div id="story">
        <Blog />
      </div>
      <section className="w-full px-4 py-8 sm:px-8 sm:py-12">
        <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-2xl bg-neutral-100 shadow-sm sm:rounded-3xl" style={{ aspectRatio: "728 / 90" }}>
          <Image
            src="/images/promo-strip-1456x180@2x.png"
            alt="Zarb Official promotion"
            fill
            sizes="(max-width: 728px) 100vw, 728px"
            className="object-cover"
          />
        </div>
      </section>
      <FeaturedProducts />
      <Reviews />
    </>
  );
}
