
import Link from "next/link";
import Image from "next/image";
import FeaturedItems from "./screens/SpecialItems";
import Blog from "./screens/Blog";
import FeaturedProducts from "./screens/FeaturedProducts";
import Reviews from "./screens/Reviews";

export default function Home() {
  return (
    <>
      <header className="mx-auto flex min-h-[85vh] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-8">
        <div className="flex w-full flex-col-reverse items-center justify-between gap-10 lg:flex-row">
          <div className="w-full text-center lg:w-1/2 lg:text-left">
            <h1 className="text-4xl font-bold uppercase leading-tight tracking-wider sm:text-6xl lg:text-7xl xl:text-8xl">Explore Premium Scent</h1>
            <Link href="/product" className="mt-8 inline-block rounded-md bg-black px-8 py-4 text-xl font-semibold uppercase tracking-wide text-white transition duration-300 ease-in-out hover:bg-neutral-800 sm:px-10 sm:py-5 sm:text-2xl">
              Shop Now
            </Link>
          </div>
          <div className="flex w-full items-center justify-center lg:w-1/2">
            <Image src="/images/icon2.png" width={520} height={520} priority className="aspect-square w-4/5 max-w-md rounded-full border-2 border-neutral-200 object-cover shadow-lg sm:w-3/5 lg:w-4/5" alt="Zarb perfume" />
          </div>
        </div>
      </header>
      <div id="featured">
        <FeaturedItems />
      </div>
      <Blog />
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
