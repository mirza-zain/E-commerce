'use client'

import Link from "next/link";
import { ShoppingBagIcon } from "@phosphor-icons/react";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

type Product = {
  id: number,
  name: string,
  description: string,
  image: string, 
  price: number,
  category: string, 
  stock: number
}

type Props = {
  limit? : number
}

export default function Products({limit}: Props) {

const [products, setProducts] = useState<Product[]>([])
const [error, setError] = useState("")
const [loading, setLoading] = useState(true)
const [selectedCategory, setSelectedCategory] = useState("all")

useEffect(() => {
  async function getProducts() {
    try {
      const response = await fetch("/api/product")
  
      if(!response.ok) throw new Error("Couldn't fetch product")
      
      const result = await response.json()

      setProducts(result)
      setLoading(false)
      
    } catch(error) {
      setError((error as Error).message)
    }
  }

  getProducts()

}, [])

const filteredProducts = selectedCategory === "all"
  ? products
  : products.filter((product) => product.category === selectedCategory)
const productToShow = limit ? filteredProducts.slice(0, limit) : filteredProducts
const { addToCart } = useCart()

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
              onClick={() => setSelectedCategory(category.value)}
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
                      <img src={items.image} className="w-full aspect-4/5 object-cover rounded-2xl shadow-sm shadow-black" alt="product 1" />
                      <p className="text-base text-neutral-500 mt-3">Zarb Store ©</p>
                      <div className="flex flex-col justify-center items-center gap-2 mt-1">
                          <h3 className="text-xl sm:text-2xl font-medium text-center">Zarb Offical {items.name} Perfume</h3>
                          <p className="text-lg sm:text-xl font-light">Rs {items.price}</p>
                      </div>
                    </Link>
                    <div className="flex flex-col gap-2 items-center mt-5 justify-center">
                      <button 
                        disabled={items.stock <= 0}
                        onClick={() => addToCart(items)} 
                        className="w-full py-4 text-base sm:text-lg font-medium flex items-center justify-center gap-2 border-2 rounded-md uppercase hover:bg-neutral-100 transition"
                      >
                        <ShoppingBagIcon className="size-6" />
                        {items.stock > 0 ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                </div>        
            ))
        }
      </div>
    </div>
  )
}
