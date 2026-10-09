'use client'

import Link from "next/link";
import Image from "next/image";
import { CaretLeftIcon, CaretRightIcon, ShoppingBagIcon } from "@phosphor-icons/react";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

type Product = {
  id: number,
  name: string,
  description: string,
  image: string, 
  price: number,
  category: string, 
  stock: number,
  variants: { label: string, price: number, stock: number }[]
}

type Props = {
  limit? : number
}

export default function Products({limit}: Props) {

const [products, setProducts] = useState<Product[]>([])
const [error, setError] = useState("")
const [loading, setLoading] = useState(true)
const [selectedCategory, setSelectedCategory] = useState("all")
const [currentPage, setCurrentPage] = useState(1)
const [totalPages, setTotalPages] = useState(1)

useEffect(() => {
  async function getProducts() {
    setLoading(true)
    try {
      const pageSize = limit ?? 8
      const response = await fetch(`/api/product?catalog=true&page=${limit ? 1 : currentPage}&pageSize=${pageSize}&category=${selectedCategory}`)
  
      if(!response.ok) throw new Error("Couldn't fetch product")
      
      const result: { products: Product[], totalPages: number } = await response.json()

      setProducts(result.products)
      setTotalPages(result.totalPages)
      setLoading(false)
      
    } catch(error) {
      setError((error as Error).message)
    }
  }

  getProducts()

}, [currentPage, limit, selectedCategory])

const productToShow = products
const { addToCart, cart } = useCart()

if(error) return <p>There is Error Loading Data</p>
if(loading) return <p>Loading.....</p>

  return (
    <div className="p-5">
        <div className="mb-10 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter products by category">
          {[
            { value: "all", label: "All" },
            { value: "mens", label: "Men" },
            { value: "women", label: "Women" },
            { value: "unisex", label: "Unisex" },
          ].map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => {
                setSelectedCategory(category.value)
                setCurrentPage(1)
              }}
              className={`rounded-full border px-5 py-2.5 text-sm font-medium transition sm:px-6 ${
                selectedCategory === category.value
                  ? "border-black bg-black text-white"
                  : "border-neutral-300 bg-transparent text-neutral-600 hover:border-black hover:text-black"
              }`}
              aria-pressed={selectedCategory === category.value}
            >
              {category.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {
            productToShow.map(items => (
                <div className="w-full flex flex-col" key={items.id}>
                    <Link href={`/productDetail/${items.id}`}>
                      <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl shadow-sm shadow-black">
                        <Image
                          src={items.image}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover"
                          alt={`${items.name} perfume`}
                        />
                      </div>
                      <p className="text-base text-neutral-500 mt-3">Zarb Store ©</p>
                      <div className="flex flex-col justify-center items-center gap-2 mt-1">
                          <h3 className="text-xl sm:text-2xl font-medium text-center">Zarb Offical {items.name} Perfume</h3>
                          <p className="text-lg sm:text-xl font-light">
                            {items.variants?.length
                              ? `From Rs ${Math.min(...items.variants.map((variant) => variant.price))}`
                              : `Rs ${items.price}`}
                          </p>
                      </div>
                    </Link>
                    <div className="flex flex-col gap-2 items-center mt-5 justify-center">
                      {items.variants?.length ? (
                        <Link
                          href={`/productDetail/${items.id}`}
                          className="w-full py-4 text-base sm:text-lg font-medium flex items-center justify-center border-2 border-black rounded-md uppercase transition-all duration-150 hover:bg-neutral-100"
                        >
                          Choose Size
                        </Link>
                      ) : (() => {
                        const selectedQuantity = cart.find(item => item.id === items.id)?.quantity ?? 0

                        return (
                      <button 
                        disabled={items.stock <= 0}
                        onClick={() => addToCart(items)} 
                        aria-label={selectedQuantity > 0 ? `${selectedQuantity} selected, add another ${items.name}` : `Add ${items.name} to cart`}
                        className={`w-full py-4 text-base sm:text-lg font-medium flex items-center justify-center gap-2 border-2 rounded-md uppercase transition-all duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${selectedQuantity > 0 ? "border-black bg-black text-white hover:bg-neutral-800" : "border-black hover:bg-neutral-100"}`}
                      >
                        <ShoppingBagIcon className="size-6" />
                        {items.stock > 0 ? (selectedQuantity > 0 ? `Added ${selectedQuantity}` : "Add to Cart") : "Out of Stock"}
                      </button>
                        )
                      })()}
                    </div>
                </div>        
            ))
        }
      </div>
      {!limit && totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Product pages">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => page - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CaretLeftIcon className="size-4" />
            Previous
          </button>
          <span className="px-3 text-sm text-neutral-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((page) => page + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <CaretRightIcon className="size-4" />
          </button>
        </nav>
      )}
    </div>
  )
}
