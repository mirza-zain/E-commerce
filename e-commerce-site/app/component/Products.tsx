'use client'

import Link from "next/link";
import { prodDetails } from "../testData/productDetails";
import { ShoppingBagIcon } from "@phosphor-icons/react";

type Props = {
  limit? : number
}

export default function Products({limit}: Props) {
const productToShow = limit ? prodDetails.slice(0, limit) : prodDetails
  return (
    <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {
            productToShow.map(items => (
                <div className="w-full flex flex-col" key={items.id}>
                    <Link href={`/productDetail/${items.id}`}>
                      <img src={items.image} className="w-full aspect-[4/5] object-cover rounded-2xl shadow-sm shadow-black" alt="product 1" />
                      <p className="text-base text-neutral-500 mt-3">Zarb Store ©</p>
                      <div className="flex flex-col justify-center items-center gap-2 mt-1">
                          <h3 className="text-xl sm:text-2xl font-medium text-center">Zarb Offical {items.name} Perfume</h3>
                          <p className="text-lg sm:text-xl font-light">Rs {items.price}</p>
                      </div>
                    </Link>
                    <div className="flex flex-col gap-2 items-center mt-5 justify-center">
                      <button className="w-full py-3 text-base sm:text-lg font-medium flex items-center justify-center gap-2 border-2 rounded-md uppercase hover:bg-neutral-100 transition"><ShoppingBagIcon className="size-6" /> Add to Cart</button>
                      <button className="w-full py-3 text-base sm:text-lg font-medium border-2 rounded-md bg-black text-white uppercase hover:bg-neutral-800 transition">Buy It Now</button>
                      <Link 
                        href={`/payment?id=${items.id}`}
                        className="w-full py-3 text-base sm:text-lg font-medium border-2 rounded-md bg-black text-white uppercase hover:bg-neutral-800 transition flex items-center justify-center text-center"
                      >
                        Buy It Now
                      </Link>
                    </div>
                </div>        
            ))
        }
      </div>
    </div>
  )
}
