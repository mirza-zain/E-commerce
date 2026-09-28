'use client'

import React, { useState } from "react";

export default function Form() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    // image: ""
  })
  const [submitData, setSubmittedData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    // image: ""
  })
  const [serverError, setServerError] = useState("")

  function handleData(event: React.ChangeEvent<HTMLInputElement>) {
    const {name, value} = event.target
    setServerError("")
    setFormData({
      ...formData,
      [name] : name === "price" || name === "stock" ? Number(value) : value
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault()

      if(formData.name === "") return setServerError("Name is required")
      if(formData.description === "") return setServerError("Description is required")
      if(formData.price <= 0) return setServerError("Price is required")
      if(formData.stock <= 0) return setServerError("No of Items in Stock is required")
      // if(formData.image === "") newError.image  = "Image is required"

      const response = await fetch("/api/product", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(formData)
      })
      if(!response.ok) {
        throw new Error("Product not created")
      }
      const data = await response.json()
      
      setSubmittedData(data)
    
    } catch (error) {
      setServerError((error as Error).message)
    }
  }

  return (
    <>
      <form className="py-20 px-20 flex flex-col items-start gap-5" onSubmit={handleSubmit}>
        <label htmlFor="prodName">Product Name: </label>
        <input className="border py-2 px-2 text-base rounded-md" type="text" name="name" id="prodName" placeholder="Product Name" value={formData.name} onChange={handleData} />
        <label htmlFor="prodDes">Product Description: </label>
        <input className="border py-2 px-2 text-base rounded-md" type="text" name="description" id="prodDes" placeholder="Product Description" value={formData.description} onChange={handleData} />
        <label htmlFor="prodPrice">Product Price: </label>
        <input className="border py-2 px-2 text-base rounded-md" type="number" name="price" id="prodPrice" placeholder="Rs 2000" value={formData.price} onChange={handleData} />
        <label htmlFor="prodStock">No of Items in Stock: </label>
        <input className="border py-2 px-2 text-base rounded-md" type="number" name="stock" id="prodStock" placeholder="10" value={formData.stock} onChange={handleData} />
        {/* <label htmlFor="prodImage">Choose Image: </label>
        <input className="border py-2 px-2 text-base rounded-md" type="file" accept="image/*" name="image" id="prodImage" value={formData.image} onChange={handleData} />
        <div id="preview-container">
          <img id="image-preview" src="" alt="Image Preview" />
        </div> */}
        <button className="" type="submit">Submit</button>
      </form>
      {
        serverError && <p>{serverError}</p>
      }
    </>
  )
}
