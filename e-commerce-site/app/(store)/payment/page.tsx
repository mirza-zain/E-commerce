'use client'

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import React, { useState } from "react";

export default function PaymentPage() {
  const [trackingId, setTrackingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNum: "",
    address: "",
    city: "",
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const {name, value} = event.target
    setFormData({
      ...formData,
      [name] : value
    })
  }

  const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        ...formData,
        totalAmount: subTotal,
        items: cart 
      })
    })  

    if(!response.ok) throw new Error("Error Processing Order")

    const data = await response.json()
    
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNum: "",
      address: "",
      city: ""
    })
    setTrackingId(data.trackingId)
    clearCart()

  }

  if(trackingId) {
    return (
      <section className="w-full min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="mt-4 text-neutral-600">Thank you for your order.</p>
          <p className="mt-6 text-sm text-neutral-500">Your Tracking ID</p>
          <p className="mt-2 text-2xl font-bold tracking-wider">{trackingId}</p>
          <Link href={"/track"} className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-lg">Track Your Order</Link>
        </div>
      </section>
    )
  }

  const {cart, clearCart} = useCart()
  const subTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <section className="w-full min-h-screen py-10 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="text-sm text-neutral-500 hover:text-black transition">
          ← Back to store
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-neutral-900">
          Checkout & Payment
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Customer & Delivery Details */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-neutral-200">
            Shipping Information
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  placeholder="Mirza" 
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  placeholder="Zain" 
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                placeholder="zarb@example.com" 
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Street Address</label>
              <input 
                type="text"
                name="address" 
                placeholder="House #, Street name" 
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                <input 
                  type="text"
                  name="city" 
                  placeholder="Karachi" 
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number</label>
                <input 
                  type="tel"
                  name="phoneNum" 
                  placeholder="03001234567" 
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                  value={formData.phoneNum}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="pt-6">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-neutral-200">
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50 transition">
                  <input type="radio" name="payment" defaultChecked className="accent-black" />
                  <div>
                    <p className="font-medium text-neutral-900">Cash on Delivery (COD)</p>
                    <p className="text-xs text-neutral-500">Pay cash upon parcel delivery</p>
                  </div>
                </label>
                {/* <label className="flex items-center gap-3 p-4 border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50 transition">
                  <input type="radio" name="payment" className="accent-black" />
                  <div>
                    <p className="font-medium text-neutral-900">Credit / Debit Card</p>
                    <p className="text-xs text-neutral-500">Pay securely via Visa / MasterCard</p>
                  </div>
                </label> */}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={cart.length === 0}
              className="w-full mt-6 py-4 bg-black text-white text-lg font-semibold uppercase rounded-lg hover:bg-neutral-800 transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Order
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm sticky top-24">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-neutral-200">
            Order Summary
          </h2>

          {cart.map ((item) => 
            <div key={item.id} className="flex items-center gap-4 pb-6 border-b border-neutral-200">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-neutral-200 shrink-0">
                <Image 
                  src={item.image!} 
                  alt={item.name} 
                  fill 
                  className="object-cover" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-neutral-900 truncate">
                  Zarb Official {item.name}
                </h3>
                <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                <p className="text-base font-medium mt-1">Rs. {item.price * item.quantity}</p>
              </div>
            </div>
          )}
          <div className="space-y-3 py-4 text-sm border-b border-neutral-200">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>Rs. {subTotal}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Delivery Charges</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 text-lg font-bold text-neutral-900">
            <span>Total</span>
            <span>Rs. {subTotal}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
