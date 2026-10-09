'use client'

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import React, { useEffect, useState } from "react";

type Pricing = {
  subtotal: string
  discountAmount: string
  deliveryAmount: string
  totalAmount: string
  discountCode: string | null
}

type CheckoutField = "firstName" | "lastName" | "email" | "address" | "city" | "phoneNum"
type PaymentMethod = "cod"
type FieldErrors = Partial<Record<CheckoutField, string>>

const namePattern = /^[A-Za-z][A-Za-z '-]{1,99}$/
const addressPattern = /^[A-Za-z0-9][A-Za-z0-9 .,#/'-]{4,499}$/
const cityPattern = /^[A-Za-z][A-Za-z '-]{1,99}$/

function validateField(name: CheckoutField, value: string) {
  const trimmedValue = value.trim()

  if (!trimmedValue) return "This field is required."
  if (name === "firstName" || name === "lastName") {
    return namePattern.test(trimmedValue)
      ? ""
      : "Use 2 to 100 letters, spaces, apostrophes, or hyphens."
  }
  if (name === "email") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)
      ? ""
      : "Enter a valid email address."
  }
  if (name === "address") {
    return addressPattern.test(trimmedValue)
      ? ""
      : "Use at least 5 valid address characters."
  }
  if (name === "city") {
    return cityPattern.test(trimmedValue)
      ? ""
      : "Use 2 to 100 letters, spaces, apostrophes, or hyphens."
  }
  return /^\d{7,11}$/.test(trimmedValue)
    ? ""
    : "Enter 7 to 11 digits."
}

export default function PaymentPage() {
  const { cart, clearCart } = useCart()
  const [trackingId, setTrackingId] = useState<string | null>(null)
  const [discountCode, setDiscountCode] = useState("")
  const [pricing, setPricing] = useState<Pricing | null>(null)
  const [pricingError, setPricingError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [trackingCopied, setTrackingCopied] = useState(false)
  const [deliveryCities, setDeliveryCities] = useState<string[]>([])
  const [selectedCityOption, setSelectedCityOption] = useState("other")
  const paymentMethod: PaymentMethod = "cod"
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCountryCode: "+92",
    phoneNum: "",
    address: "",
    city: "",
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const {name, value} = event.target
    const nextValue = name === "phoneNum"
      ? value.replace(/\D/g, "").slice(0, 11)
      : value
    setFormData({
      ...formData,
      [name] : nextValue
    })
    if (name in formData && name !== "phoneCountryCode") {
      const field = name as CheckoutField
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        [field]: validateField(field, nextValue)
      }))
    }
  }

  const handlePhoneCountryCodeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      phoneCountryCode: event.target.value
    })
  }

  const handleCitySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setSelectedCityOption(value)
    setFormData({
      ...formData,
      city: value === "other" ? "" : value
    })
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      city: value === "other" ? "" : validateField("city", value)
    }))
  }

  const copyTrackingId = async () => {
    if (!trackingId) return
    await navigator.clipboard.writeText(trackingId)
    setTrackingCopied(true)
    window.setTimeout(() => setTrackingCopied(false), 2000)
  }

  useEffect(() => {
    const getDeliveryCities = async () => {
      try {
        const response = await fetch("/api/delivery-options")
        if (!response.ok) return

        const data: { cities?: string[] } = await response.json()
        setDeliveryCities(data.cities ?? [])
      } catch {
        setDeliveryCities([])
      }
    }

    getDeliveryCities()
  }, [])

  useEffect(() => {
    if (cart.length === 0) return
    const updatePricing = async () => {
      const response = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, city: formData.city, discountCode })
      })
      const data = await response.json()
      if (response.ok) {
        setPricing(data)
        setPricingError("")
      } else {
        setPricingError(data.error ?? "Unable to calculate pricing")
      }
    }
    updatePricing()
  }, [cart, formData.city, discountCode])

  const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = (["firstName", "lastName", "email", "address", "city", "phoneNum"] as CheckoutField[])
      .reduce<FieldErrors>((errors, field) => {
        const error = validateField(field, formData[field])
        if (error) errors[field] = error
        return errors
      }, {})
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setPricingError("")
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ ...formData, paymentMethod, discountCode, items: cart })
      })
      const data = await response.json()
      if(!response.ok) throw new Error(data.error ?? "Error Processing Order")
      setTrackingId(data.trackingId)
      clearCart()
    } catch (error) {
      setPricingError((error as Error).message)
    } finally {
      setSubmitting(false)
    }

  }

  if(trackingId) {
    return (
      <section className="w-full min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="mt-4 text-neutral-600">Thank you for your order.</p>
          <p className="mt-6 text-sm text-neutral-500">Your Tracking ID</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <p className="text-2xl font-bold tracking-wider">{trackingId}</p>
            <button
              type="button"
              onClick={() => void copyTrackingId()}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:border-black hover:text-black"
            >
              {trackingCopied ? "Copied" : "Copy"}
            </button>
          </div>
          <Link href={"/track"} className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-lg">Track Your Order</Link>
        </div>
      </section>
    )
  }

  const subTotal = Number(pricing?.subtotal ?? 0)
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
                  minLength={2}
                  maxLength={100}
                  pattern="[A-Za-z][A-Za-z '-]{1,99}"
                  title="Use 2 to 100 letters, spaces, apostrophes, or hyphens."
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.firstName && <p className="mt-1 text-xs text-red-600">{fieldErrors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  placeholder="Zain" 
                  minLength={2}
                  maxLength={100}
                  pattern="[A-Za-z][A-Za-z '-]{1,99}"
                  title="Use 2 to 100 letters, spaces, apostrophes, or hyphens."
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.lastName && <p className="mt-1 text-xs text-red-600">{fieldErrors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                placeholder="zarb@example.com" 
                maxLength={254}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Street Address</label>
              <input 
                type="text"
                name="address" 
                placeholder="House #, Street name" 
                minLength={5}
                maxLength={500}
                pattern="[A-Za-z0-9][A-Za-z0-9 .,#/'-]{4,499}"
                title="Enter a valid address using at least 5 characters."
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                value={formData.address}
                onChange={handleChange}
                required
              />
              {fieldErrors.address && <p className="mt-1 text-xs text-red-600">{fieldErrors.address}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                {deliveryCities.length > 0 && (
                  <select
                    value={selectedCityOption}
                    onChange={handleCitySelect}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:border-black"
                  >
                    <option value="other">Other city</option>
                    {deliveryCities.map((city) => (
                      <option key={city} value={city}>
                        {city.replace(/\b\w/g, (letter) => letter.toUpperCase())}
                      </option>
                    ))}
                  </select>
                )}
                {(deliveryCities.length === 0 || selectedCityOption === "other") && (
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter your city"
                    minLength={2}
                    maxLength={100}
                    pattern="[A-Za-z][A-Za-z '-]{1,99}"
                    title="Use 2 to 100 letters, spaces, apostrophes, or hyphens."
                    className="mt-2 w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                )}
                {fieldErrors.city && <p className="mt-1 text-xs text-red-600">{fieldErrors.city}</p>}
              </div>
              <div>
                <label htmlFor="phoneNum" className="block text-sm font-medium text-neutral-700 mb-1">Phone Number</label>
                <div className="flex">
                  <select
                    aria-label="Country code"
                    value={formData.phoneCountryCode}
                    onChange={handlePhoneCountryCodeChange}
                    className="w-24 rounded-l-lg border border-r-0 border-neutral-300 bg-white px-2 py-3 focus:outline-none focus:border-black"
                  >
                    <option value="+92">+92 PK</option>
                    <option value="+1">+1 US/CA</option>
                    <option value="+44">+44 UK</option>
                    <option value="+61">+61 AU</option>
                    <option value="+91">+91 IN</option>
                    <option value="+966">+966 SA</option>
                    <option value="+971">+971 AE</option>
                  </select>
                  <input
                    id="phoneNum"
                    type="tel"
                    name="phoneNum"
                    inputMode="numeric"
                    pattern="[0-9]{7,11}"
                    maxLength={11}
                    placeholder="03001234567"
                    title="Enter 7 to 11 digits."
                    className="min-w-0 flex-1 rounded-r-lg border border-neutral-300 px-4 py-3 focus:outline-none focus:border-black"
                    value={formData.phoneNum}
                    onChange={handleChange}
                    required
                  />
                </div>
                {fieldErrors.phoneNum && <p className="mt-1 text-xs text-red-600">{fieldErrors.phoneNum}</p>}
                <p className="mt-1 text-xs text-neutral-500">Enter up to 11 digits.</p>
              </div>
            </div>

            <div className="pt-6">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-neutral-200">
                Payment Method
              </h2>
              <div className="space-y-3">
                <div className="rounded-lg border border-neutral-300 bg-neutral-50 p-4">
                  <p className="font-medium text-neutral-900">Cash on Delivery (COD)</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Pay cash when your parcel is delivered. Online payments will be enabled soon.
                  </p>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={cart.length === 0 || submitting || !pricing}
              className="w-full mt-6 py-4 bg-black text-white text-lg font-semibold uppercase rounded-lg hover:bg-neutral-800 transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Processing..." : "Confirm Order"}
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
                {item.variantLabel && <p className="text-sm font-medium text-neutral-700">Size: {item.variantLabel}</p>}
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
                <span>Rs. {pricing?.deliveryAmount ?? "0.00"}</span>
            </div>
            <div className="flex gap-2 pt-2">
              <input
                value={discountCode}
                onChange={(event) => setDiscountCode(event.target.value.toUpperCase())}
                placeholder="Discount code"
                className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm uppercase"
              />
            </div>
            {Number(pricing?.discountAmount ?? 0) > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount</span>
                <span>- Rs. {pricing?.discountAmount}</span>
              </div>
            )}
            {pricingError && <p className="text-xs text-red-600">{pricingError}</p>}
          </div>

          <div className="flex justify-between items-center pt-4 text-lg font-bold text-neutral-900">
            <span>Total</span>
            <span>Rs. {pricing?.totalAmount ?? subTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
