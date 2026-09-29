'use client'

import { useEffect, useState } from "react";
import Form from "../(component)/Form";
import { TrashIcon } from "@phosphor-icons/react";
import Link from "next/link";

type Product = {
  id: number,
  name: string,
  description: string,
  category: string,
  price: number,
  stock: number,
  image: string | null,
}

export default function page() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function handleDelete(id: number) {
    const response = await fetch(`/api/productDetail/${id}`, {
      method: "DELETE"
    })
    if(!response.ok) {
      alert('Product could not be deleted')
      return
    }

    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== id))
    
  }

  useEffect(() =>  {
    async function getProducts() {
      try {
        const response = await fetch("/api/product")
        
        if(!response.ok) throw new Error("Error Fetching")
        
        const data = await response.json()
        
        setProducts(data)
        setLoading(false)

      } catch(error) {
        setError((error as Error).message)
      }
    }

    getProducts()

  }, [])
  
  if(loading) return <p>Loading Data Wait......</p>
  if(error) return <p>{error}</p>

  return (
    <div>
      <div>
        <h2>Add Product Details</h2>
        <Form />
      </div>
      <div>
        <h2>Manage Products Information</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              products.map(items => (
                <tr key={items.id}>
                  <td>{items.id}</td>
                  <td>{items.name}</td>
                  <td>{items.description}</td>
                  <td>{items.category}</td>
                  <td>Rs. {items.price}</td>
                  <td>{items.stock}</td>
                  <td>
                    <button onClick={() => handleDelete(items.id)}><TrashIcon size={20} /></button>
                    <Link href={"/editProduct"}></Link>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
