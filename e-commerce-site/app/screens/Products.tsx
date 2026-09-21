'use client'
import detailProduct from "../productDetail/[id]/page"
import { ShoppingBagIcon } from "@phosphor-icons/react";
import { ProductDetails } from "../testData/productDetails"

export default function Products() {
  return (
    <div className="w-full py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-center mb-10 md:mb-14">FEATURED FRAGRANCES</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {
            ProductDetails.map(items => (
                <div className="w-full flex flex-col" key={items.id}>
                    <img src={items.image} className="w-full aspect-[4/5] object-cover rounded-2xl shadow-sm shadow-black" alt="product 1" />
                    <p className="text-base text-neutral-500 mt-3">Zarb Store ©</p>
                    <div className="flex flex-col justify-center items-center gap-2 mt-1">
                        <h3 className="text-xl sm:text-2xl font-medium text-center">Zarb Offical {items.name} Perfume</h3>
                        <p className="text-lg sm:text-xl font-light">{items.price}</p>
                        <button onClick={detailProduct} className="w-full py-3 text-base sm:text-lg font-medium flex items-center justify-center gap-2 border-2 rounded-md uppercase hover:bg-neutral-100 transition"><ShoppingBagIcon className="size-6" /> Add to Cart</button>
                        <button className="w-full py-3 text-base sm:text-lg font-medium border-2 rounded-md bg-black text-white uppercase hover:bg-neutral-800 transition">Buy It Now</button>
                    </div>
                </div>        
            ))
        }
      </div>
    </div>
  )
}
