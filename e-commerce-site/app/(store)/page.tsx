
import Link from "next/link";
import Image from "next/image";
import FeaturedItems from "./screens/SpecialItems";
import Blog from "./screens/Blog";
import FeaturedProducts from "./screens/FeaturedProducts";
import Reviews from "./screens/Reviews";

export default function Home() {
  return (
    <>
      <header className="relative overflow-hidden bg-[#FAF8F5]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#e6d8c6]/80 blur-3xl" />
          <div className="absolute top-1/4 right-0 h-96 w-96 rounded-full bg-[#d8cfc1]/65 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f3ede3]/60 via-transparent to-[#efe6da]/50" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neutral-300/80 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[88vh] w-full max-w-7xl items-center px-4 py-14 sm:px-8 lg:py-20">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-4 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-neutral-600 backdrop-blur-sm">
                Premium Fragrances • Pakistan
              </div>

              <h1 className="mt-6 font-[Gebuk] text-5xl font-black uppercase leading-[0.95] tracking-tight text-neutral-950 sm:text-7xl lg:text-8xl">
                Explore
                <span className="block text-neutral-700">Premium</span>
                <span className="block">Scent</span>
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg lg:mx-0 lg:text-xl font-light">
                Artisanal Extrait de Parfum crafted with concentrated perfume oils. Subtle up close, commanding from afar, and unforgettable once you leave.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <a
                  href="#featured"
                  className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-7 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:bg-neutral-800 hover:shadow-lg active:scale-[0.98]"
                >
                  <span>Explore Editions</span>
                  <span className="text-neutral-400">↓</span>
                </a>

                <a
                  href="#story"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white/70 px-7 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-neutral-800 backdrop-blur-sm transition-all duration-200 hover:border-neutral-900 hover:bg-white"
                >
                  The Zarb Standard
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-neutral-200/80 pt-6 text-xs sm:text-sm text-neutral-500 lg:justify-start">
                <span className="flex items-center gap-2">
                  <span className="text-neutral-700">✦</span> Extrait Concentration
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-neutral-700">✦</span> 12+ Hour Sillage
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-neutral-700">✦</span> Nationwide Delivery
                </span>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-[78%] w-[78%] rounded-full border border-neutral-200/70" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-[92%] w-[92%] rounded-full border border-neutral-200/40" />
              </div>

              <div className="relative rounded-[2.5rem] border border-white/70 bg-white/40 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:p-4">
                <div className="relative aspect-square w-[min(78vw,420px)] overflow-hidden rounded-[2rem] sm:w-[min(70vw,460px)] lg:w-[min(42vw,500px)]">
                  <Image
                    src="/images/topImage.jpg"
                    alt="Zarb Store premium fragrance"
                    fill
                    priority
                    sizes="(max-width: 1024px) 78vw, 42vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5" />
                </div>
              </div>
            </div>
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
            alt="Zarb Store promotion"
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
