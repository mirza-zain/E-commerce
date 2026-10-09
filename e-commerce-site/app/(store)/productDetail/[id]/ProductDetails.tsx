'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";

type Props = {
  id: string
}

type Product =  {
  id: number
  name: string,
  image: string | null,
  description: string,
  category: string,
  price: number,
  stock: number
  variants: ProductVariant[]
}

type ProductVariant = {
  label: string
  price: number
  stock: number
}

export default function DetailProduct({id}: Props) {
    const [prodDetail, setProdDetail] = useState<Product | null>(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const {addToCart, cart} = useCart()
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

    useEffect(() => {
        const getProd = async () => {
            try {
                const response = await fetch(`/api/productDetail/${id}`)
                if(!response.ok) throw new Error("Product Not Found")
                const items = await response.json()
                setProdDetail(items[0])
                setSelectedVariant(items[0].variants?.[0] ?? null)

            } catch(error) {
                setError((error as Error).message)
            } finally {
                setLoading(false)
            }
        }
        getProd()
        
    }, [id])

    if (loading) return <p>Loading....</p>
    if (error) return <p>Error Loading...</p>
    if (!prodDetail) return <p>Product Not Found</p>

    const activePrice = selectedVariant?.price ?? Number(prodDetail.price)
    const activeStock = selectedVariant?.stock ?? Number(prodDetail.stock)
    const selectedQuantity = cart.find(item =>
      item.id === prodDetail.id && item.variantLabel === selectedVariant?.label
    )?.quantity ?? 0
 
  return (
    <section className="w-full min-h-[80vh] flex items-center justify-center py-10 sm:py-16 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
        {/* Product Image */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg aspect-square relative rounded-3xl overflow-hidden shadow-md border border-neutral-200">
            <Image
              src= {prodDetail.image!}
              alt={prodDetail.name}
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
            Rs {activePrice}
          </p>

          {prodDetail.variants?.length > 0 && (
            <div className="mt-6 w-full max-w-md">
              <p className="mb-2 text-sm font-semibold text-neutral-700">Choose Size</p>
              <div className="flex flex-wrap gap-2">
                {prodDetail.variants.map((variant) => (
                  <button
                    key={variant.label}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                      selectedVariant?.label === variant.label
                        ? "border-black bg-black text-white"
                        : "border-neutral-300 hover:border-black"
                    }`}
                  >
                    {variant.label} - Rs {variant.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="w-full max-w-md flex flex-col sm:flex-row items-center gap-4 mt-8">
            <button 
              disabled={activeStock <= 0}
              onClick={() => addToCart({
                ...prodDetail,
                price: activePrice,
                stock: activeStock,
                variantLabel: selectedVariant?.label
              })}
              aria-label={selectedQuantity > 0 ? `${selectedQuantity} selected, add another ${prodDetail.name}` : `Add ${prodDetail.name} to cart`}
              className={`w-full sm:w-1/2 py-4 px-6 text-base sm:text-lg font-semibold uppercase rounded-lg border-2 transition-all duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${selectedQuantity > 0 ? "border-black bg-black text-white hover:bg-neutral-800" : "border-black bg-transparent text-black hover:bg-neutral-100"}`}  
            >
              {activeStock > 0 ? (selectedQuantity > 0 ? `Added ${selectedQuantity}` : "Add to Cart") : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
