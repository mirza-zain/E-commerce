'use client'

import { ShoppingBagIcon } from "@phosphor-icons/react";

export default function Products() {
  return (
    <div className="w-full py-20 px-10 p-5">
      <h2 className="text-5xl font-medium text-center mb-12">FEATURED FRAGRANCES</h2>
      <div className="grid grid-cols-4 gap-10 p-2">
        <div className="w-full">
            <img src="/images/prod1.png" className="w-full h-3/5 object-cover rounded-2xl shadow-sm shadow-black" alt="product 1" />
            <p className="text-base">Zarb Store ©</p>
            <div className="flex flex-col justify-center items-center gap-2">
                <h3 className="text-2xl font-medium mt-2">Zarb Official La Rose Divine</h3>
                <p className="text-xl font-lgiht">Rs.2,500</p>
                <button className="w-full py-3 text-xl flex items-center justify-center gap-2 border-2 rounded-md uppercase"><ShoppingBagIcon size={30} /> Add to Cart</button>
                <button className="w-full py-3 text-xl border-2 rounded-md bg-black text-white uppercase">Buy It Now</button>
            </div>
        </div>
        <div className="w-full">
            <img src="/images/prod1.png" className="w-full h-3/5 object-cover rounded-2xl shadow-sm shadow-black" alt="product 1" />
            <p className="text-base">Zarb Store ©</p>
            <div className="flex flex-col justify-center items-center gap-2">
                <h3 className="text-2xl font-medium mt-2">Zarb Official La Rose Divine</h3>
                <p className="text-xl font-lgiht">Rs.2,500</p>
                <button className="w-full py-3 text-xl flex items-center justify-center gap-2 border-2 rounded-md uppercase"><ShoppingBagIcon size={30} /> Add to Cart</button>
                <button className="w-full py-3 text-xl border-2 rounded-md bg-black text-white uppercase">Buy It Now</button>
            </div>
        </div>
        <div className="w-full">
            <img src="/images/prod1.png" className="w-full h-3/5 object-cover rounded-2xl shadow-sm shadow-black" alt="product 1" />
            <p className="text-base">Zarb Store ©</p>
            <div className="flex flex-col justify-center items-center gap-2">
                <h3 className="text-2xl font-medium mt-2">Zarb Official La Rose Divine</h3>
                <p className="text-xl font-lgiht">Rs.2,500</p>
                <button className="w-full py-3 text-xl flex items-center justify-center gap-2 border-2 rounded-md uppercase"><ShoppingBagIcon size={30} /> Add to Cart</button>
                <button className="w-full py-3 text-xl border-2 rounded-md bg-black text-white uppercase">Buy It Now</button>
            </div>
        </div>
        <div className="w-full">
            <img src="/images/prod1.png" className="w-full h-3/5 object-cover rounded-2xl shadow-sm shadow-black" alt="product 1" />
            <p className="text-base">Zarb Store ©</p>
            <div className="flex flex-col justify-center items-center gap-2">
                <h3 className="text-2xl font-medium mt-2">Zarb Official La Rose Divine</h3>
                <p className="text-xl font-lgiht">Rs.2,500</p>
                <button className="w-full py-3 text-xl flex items-center justify-center gap-2 border-2 rounded-md uppercase"><ShoppingBagIcon size={30} /> Add to Cart</button>
                <button className="w-full py-3 text-xl border-2 rounded-md bg-black text-white uppercase">Buy It Now</button>
            </div>
        </div>
      </div>
    </div>
  )
}
