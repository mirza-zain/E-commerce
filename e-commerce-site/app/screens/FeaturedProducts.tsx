import Products from "../component/Products";

export default function FeaturedProducts() {
  return (
    <div className="w-full py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-center mb-10 md:mb-14">FEATURED FRAGRANCES</h2>
      <Products limit={4} />
    </div>
  )
}
