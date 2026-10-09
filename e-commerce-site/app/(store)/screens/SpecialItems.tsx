import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, SparkleIcon } from "@phosphor-icons/react/dist/ssr";

type SignatureEdition = {
  id: string;
  name: string;
  edition: string;
  category: string;
  tagline: string;
  notes: string;
  image: string;
  alt: string;
};

const editions: SignatureEdition[] = [
  {
    id: "la-rose-divine",
    name: "LA ROSE DIVINE",
    edition: "Edition 01",
    category: "Opulent Floral Bouquet",
    tagline: "A luminous, opulent floral masterpiece inspired by J'adore",
    notes: "Damascena Rose • Sambac Jasmine • Ylang-Ylang",
    image: "/images/featurev1.png",
    alt: "Zarb Official La Rose Divine Perfume",
  },
  {
    id: "executive",
    name: "EXECUTIVE",
    edition: "Edition 02",
    category: "Woody Aromatic & Amber",
    tagline: "A power-packed, professional scent made to dominate the room",
    notes: "Crisp Bergamot • Smoked Cedarwood • Rich Amber",
    image: "/images/featurev2.png",
    alt: "Zarb Official Executive Perfume",
  },
  {
    id: "sea-mist",
    name: "SEA MIST",
    edition: "Edition 03",
    category: "Fresh Aquatic & Floral",
    tagline: "A fresh, watery fragrance inspired by Victoria's Secret Aqua Kiss",
    notes: "Cool Waters • Rain-Kissed Freesia • Sheer Musk",
    image: "/images/featurev3.png",
    alt: "Zarb Official Sea Mist Perfume",
  },
];

export default function FeaturedItems() {
  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200/80 text-neutral-700 text-xs font-semibold tracking-widest uppercase">
          <SparkleIcon className="size-3.5 text-amber-600" />
          <span>Private Reserve Collection</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-neutral-950 font-[Gebuk]">
          Signature Lines
        </h2>

        <p className="text-sm sm:text-base md:text-lg font-medium text-neutral-600 leading-relaxed pt-1">
          Explore our private blends — olfactory masterpieces formulated with concentrated oils and rare accords, engineered for lasting distinction.
        </p>
      </div>

      {/* 3-Column Luxury Product Card Grid */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {editions.map((item) => (
          <Link
            key={item.id}
            href="/product"
            className="group relative flex flex-col rounded-3xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-black transition-all duration-500"
          >
            {/* Image Box */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-100">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
              />

              {/* Floating Luxury Edition Badge */}
              <div className="absolute top-3.5 left-3.5 bg-black/85 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                {item.edition}
              </div>

              {/* Arrow Pill on Hover */}
              <div className="absolute bottom-3.5 right-3.5 flex size-9 items-center justify-center rounded-full bg-white/95 text-neutral-900 shadow-md opacity-90 group-hover:scale-110 group-hover:bg-black group-hover:text-white transition-all duration-300">
                <ArrowUpRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* Content Details */}
            <div className="flex flex-col flex-1 pt-5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                {item.category}
              </span>

              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-neutral-900 group-hover:text-black transition">
                {item.name}
              </h3>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-2">
                {item.tagline}
              </p>

              {/* Scent Accord Notes */}
              <div className="pt-3 mt-auto border-t border-neutral-100 flex items-center justify-between text-xs">
                <div className="text-[11px] text-neutral-500 font-medium truncate pr-2">
                  <span className="font-semibold text-neutral-700">Notes: </span>
                  <span>{item.notes}</span>
                </div>

                <span className="text-xs font-bold text-black uppercase tracking-wider whitespace-nowrap group-hover:underline decoration-1 underline-offset-4">
                  Shop Now
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
