'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
    id: string
}

export default function DetailProduct({id}: Props) {
    const [prodDetail, setProdDetail] = useState({
        name: "",
        price: "",
        description: "",
        image: ""
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const getProd = async () => {
            try {
                const response = await fetch(`/api/productDetail/${id}`)
                if(!response.ok) throw new Error("Product Not Found")
                const items = await response.json()
                setProdDetail(items)
            } catch(error) {
                setError((error as Error).message)
            } finally {
                setLoading(false)
            }
        }
        getProd()
    }, [id])

    {if (loading) return <p>Loading....</p>}
    {if (error)return <p>Error Loading...</p>}
  return (
    <section className="w-full min-h-[80vh] flex items-center justify-center py-10 sm:py-16 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
        {/* Product Image */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg aspect-square relative rounded-3xl overflow-hidden shadow-md border border-neutral-200">
            <Image
              src= {prodDetail.image}
              alt="Zarb Official La Rose Divine"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 500px"
              priority
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left">
          <span className="text-xs sm:text-sm uppercase tracking-widest text-neutral-500 font-medium">
            Zarb Official ©
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-3 text-neutral-900 leading-tight">
            Zarb Official {prodDetail.name}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed max-w-xl text-center lg:text-left">
            {prodDetail.description}
          </p>
          <p className="mt-6 text-2xl sm:text-3xl font-semibold text-neutral-900">
            Rs {prodDetail.price}
          </p>

          {/* Action Buttons */}
          <div className="w-full max-w-md flex flex-col sm:flex-row items-center gap-4 mt-8">
            <Link href={`/payment?id=${id}`} className="w-full sm:w-1/2 py-4 px-6 text-base sm:text-lg font-semibold uppercase bg-black hover:bg-neutral-800 text-white rounded-lg border-2 border-black transition-all active:scale-[0.98]">Buy Now</Link>
            <Link 
              href={`/payment?id=${id}`} 
              className="w-full sm:w-1/2 py-4 px-6 flex items-center justify-center text-center text-base sm:text-lg font-semibold uppercase bg-black hover:bg-neutral-800 text-white rounded-lg border-2 border-black transition-all active:scale-[0.98]"
            >
              Buy Now
            </Link>
            <button className="w-full sm:w-1/2 py-4 px-6 text-base sm:text-lg font-semibold uppercase bg-transparent hover:bg-neutral-100 text-black rounded-lg border-2 border-black transition-all active:scale-[0.98]">
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
