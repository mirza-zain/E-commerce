import Products from "../component/Products";

export default function page() {
  return (
    <section className="w-full py-16 px-16 mt-2">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-center mb-10 md:mb-14 uppercase">Shop Best FRAGRANCES</h2>
      <Products />      
    </section>
  )
}
