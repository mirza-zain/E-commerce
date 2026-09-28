export default function FeaturedItems() {
  return (
    <div className="w-full py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase">Signature Lines</h1>
            <p className="text-sm sm:text-base md:text-xl font-medium mt-2 text-neutral-600">Explore our curated Collections — From Special Blends to Exclusive Collection</p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col justify-center items-center text-center">
                <img src="/images/feature1.png" alt="feature 1" className="w-full max-w-xs sm:max-w-sm aspect-square object-cover rounded-3xl shadow-sm" />
                <h2 className="text-2xl sm:text-3xl font-semibold mt-4 underline decoration-2">Executive</h2>
                <p className="text-lg sm:text-xl font-medium mt-1 text-neutral-600">Command the Room</p>             
            </div>
            <div className="flex flex-col justify-center items-center text-center">
                <img src="/images/feature2.png" alt="feature 2" className="w-full max-w-xs sm:max-w-sm aspect-square object-cover rounded-3xl shadow-sm" />
                <h2 className="text-2xl sm:text-3xl font-semibold mt-4 underline decoration-2">Maverick</h2>
                <p className="text-lg sm:text-xl font-medium mt-1 text-neutral-600">Rules Don't Apply</p>             
            </div>
            <div className="flex flex-col justify-center items-center text-center">
                <img src="/images/feature3.png" alt="feature 3" className="w-full max-w-xs sm:max-w-sm aspect-square object-cover rounded-3xl shadow-sm" />
                <h2 className="text-2xl sm:text-3xl font-semibold mt-4 underline decoration-2">Touch of Pink</h2>
                <p className="text-lg sm:text-xl font-medium mt-1 text-neutral-600">Sweet Danger</p>             
            </div>
        </div>
    </div>
  )
}
