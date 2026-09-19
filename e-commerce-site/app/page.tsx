import Blog from "./screens/Blog";
import FeaturedItems from "./screens/FeaturedItems";
import Products from "./screens/Products";

export default function Home() {
  return (
    <>
      <header className="mt-10 w-full min-h-screen p-2">
        <div className="flex justify-center items-center">
          <div className="w-1/2 text-center mx-10">
            <h1 className=" text-8xl font-bold tracking-[0.2] uppercase">Explore Premium Scent</h1>
            <button className="bg-black hover:bg-gray-500 duration-300 ease-in-out text-white px-10 py-5 text-2xl font-semibold rounded-md mt-10 uppercase" >Shop Now</button>
          </div>
          <div className="w-1/2 flex justify-center items-center">
              <img src="/images/icon2.png" className="w-3/5 object-cover rounded-full border" alt="icon" />
          </div>
        </div>
      </header>
      <FeaturedItems />
      <Blog />
      <Products />
    </>
  );
}
