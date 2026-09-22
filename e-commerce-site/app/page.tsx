import Blog from "./screens/Blog";
import FeaturedItems from "./screens/SpecialItems";
import Products from "./screens/FeaturedProducts";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <header className="w-full min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="w-full flex flex-col-reverse lg:flex-row justify-between items-center gap-10">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-[0.05em] uppercase leading-tight">Explore Premium Scent</h1>
            <button className="bg-black hover:bg-neutral-800 duration-300 ease-in-out text-white px-8 py-4 sm:px-10 sm:py-5 text-xl sm:text-2xl font-semibold rounded-md mt-8 uppercase tracking-wide"><Link href={'/product'} >Shop Now</Link></button>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center items-center">
              <img src="/images/icon2.png" className="w-4/5 sm:w-3/5 lg:w-4/5 max-w-md aspect-square object-cover rounded-full border-2 border-neutral-200 shadow-lg" alt="icon" />
          </div>
        </div>
      </header>
      <FeaturedItems />
      <Blog />
      <Products />
    </>
  );
}
