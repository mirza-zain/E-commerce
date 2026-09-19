
export default function FeaturedItems() {
  return (
    <div className="w-full py-16">
        <div className="text-center">
            <h1 className="text-5xl font-extrabold text-center uppercase">Signature Lines</h1>
            <p className="text-xl font-medium mt-2">Explore our curated Collections — From Special Blends to Exclusive Collection</p>
        </div>
        <div className="mt-10 flex justify-center items-center">
            <div className="flex flex-col justify-center items-center">
                <img src="/images/feature1.png" alt="feature 1" className="w-4/5 object-cover rounded-4xl" />
                <h2 className="text-3xl font-semibold mt-2 underline decoration-2">Executive</h2>
                <p className="text-xl font-medium mt-2">Command the Room</p>             
            </div>
             <div className="flex flex-col justify-center items-center">
                <img src="/images/feature2.png" alt="feature 1" className="w-4/5 object-cover rounded-4xl" />
                <h2 className="text-3xl font-semibold mt-2 underline decoration-2">Maverick</h2>
                <p className="text-xl font-medium mt-2">Rules Don't Apply</p>             
            </div>
             <div className="flex flex-col justify-center items-center">
                <img src="/images/feature3.png" alt="feature 1" className="w-4/5 object-cover rounded-4xl" />
                <h2 className="text-3xl font-semibold mt-2 underline decoration-2">Touch of Pink</h2>
                <p className="text-xl font-medium mt-2">Sweet Danger</p>             
            </div>
        </div>
    </div>
  )
}
