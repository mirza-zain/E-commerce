'use client'

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import React, { useEffect, useState } from "react";
import { BANK_TRANSFER_CONFIG } from "@/app/lib/bank-details";

type Pricing = {
  subtotal: string
  discountAmount: string
  deliveryAmount: string
  totalAmount: string
  discountCode: string | null
}

type CheckoutField = "firstName" | "lastName" | "email" | "address" | "city" | "phoneNum"
type PaymentMethod = "cod" | "bank_transfer"
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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod")
  const [paymentReceipt, setPaymentReceipt] = useState<string>("")
  const [uploadingReceipt, setUploadingReceipt] = useState(false)
  const [receiptError, setReceiptError] = useState("")
  const [copiedBankField, setCopiedBankField] = useState<string | null>(null)
  const [submittedPaymentMethod, setSubmittedPaymentMethod] = useState<PaymentMethod>("cod")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "Pakistan",
    phoneCountryCode: "+92",
    phoneNum: "",
    address: "",
    city: "",
  })

  const isKarachi =
    formData.country.trim().toLowerCase() === "pakistan" &&
    formData.phoneCountryCode === "+92" &&
    formData.city.trim().toLowerCase() === "karachi"

  useEffect(() => {
    if (!isKarachi && paymentMethod === "cod") {
      setPaymentMethod("bank_transfer")
    }
  }, [isKarachi, paymentMethod])

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextCountry = event.target.value
    setFormData((prev) => ({
      ...prev,
      country: nextCountry,
      phoneCountryCode:
        nextCountry === "Pakistan"
          ? "+92"
          : nextCountry === "United States" || nextCountry === "Canada"
          ? "+1"
          : nextCountry === "United Kingdom"
          ? "+44"
          : nextCountry === "Australia"
          ? "+61"
          : nextCountry === "India"
          ? "+91"
          : nextCountry === "Saudi Arabia"
          ? "+966"
          : nextCountry === "United Arab Emirates"
          ? "+971"
          : prev.phoneCountryCode,
      city: nextCountry !== "Pakistan" ? "" : prev.city,
    }))
    if (nextCountry !== "Pakistan") {
      setSelectedCityOption("other")
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const {name, value} = event.target
    const nextValue = name === "phoneNum"
      ? value.replace(/\D/g, "").slice(0, 11)
      : value
    setFormData({
      ...formData,
      [name] : nextValue
    })
    if (name in formData && name !== "phoneCountryCode" && name !== "country") {
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

  const copyBankDetail = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedBankField(id)
    window.setTimeout(() => setCopiedBankField(null), 2000)
  }

  const handleReceiptUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setReceiptError("")
    setUploadingReceipt(true)
    try {
      const uploadData = new FormData()
      uploadData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to upload screenshot")
      }

      setPaymentReceipt(data.url)
    } catch (err) {
      setReceiptError((err as Error).message)
    } finally {
      setUploadingReceipt(false)
      event.target.value = ""
    }
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

    if (paymentMethod === "cod" && !isKarachi) {
      setPricingError("Cash on Delivery (COD) is only available within Karachi. Please select Direct Bank Transfer.")
      return
    }

    if (paymentMethod === "bank_transfer" && !paymentReceipt) {
      setReceiptError("Please upload your payment screenshot/receipt before completing the order.")
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          ...formData,
          paymentMethod,
          paymentReceipt: paymentMethod === "bank_transfer" ? paymentReceipt : undefined,
          discountCode,
          items: cart
        })
      })
      const data = await response.json()
      if(!response.ok) throw new Error(data.error ?? "Error Processing Order")
      setSubmittedPaymentMethod(paymentMethod)
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
        <div className="text-center max-w-lg mx-auto">
          <div className="inline-flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-3">
            <svg className="size-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900">Order Placed Successfully!</h1>
          
          {submittedPaymentMethod === "bank_transfer" ? (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-950 text-left">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-amber-500" />
                <p className="font-semibold">Payment Receipt Under Verification</p>
              </div>
              <p className="mt-1.5 text-xs text-amber-900 leading-relaxed">
                Thank you! We have received your payment screenshot. Our team will verify that the exact amount has been paid and approve your order shortly.
              </p>
            </div>
          ) : (
            <p className="mt-3 text-neutral-600">Thank you for your order. We are preparing it for delivery.</p>
          )}

          <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
            <p className="text-xs uppercase tracking-wider text-neutral-500">Your Tracking ID</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <p className="text-2xl font-bold tracking-wider font-mono text-neutral-950">{trackingId}</p>
              <button
                type="button"
                onClick={() => void copyTrackingId()}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:border-black hover:text-black shadow-sm"
              >
                {trackingCopied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={"/track"} className="inline-block px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-neutral-800 transition">
              Track Your Order
            </Link>
            <Link href={"/"} className="inline-block px-6 py-3 border border-neutral-300 text-neutral-800 font-medium rounded-xl hover:bg-neutral-100 transition">
              Continue Shopping
            </Link>
          </div>
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
              <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">Country</label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleCountryChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:border-black"
                required
              >
                <option value="Pakistan">Pakistan</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Other">Other (International)</option>
              </select>
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
                {deliveryCities.length > 0 && formData.country === "Pakistan" && (
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
                {(deliveryCities.length === 0 || selectedCityOption === "other" || formData.country !== "Pakistan") && (
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
              <div className="space-y-4">
                {/* Option 1: COD */}
                <label className={`block rounded-xl border p-4 transition ${
                  !isKarachi
                    ? "border-neutral-200 bg-neutral-100/60 opacity-60 cursor-not-allowed"
                    : paymentMethod === "cod"
                    ? "border-black bg-neutral-50 ring-1 ring-black cursor-pointer"
                    : "border-neutral-200 hover:border-neutral-300 cursor-pointer"
                }`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      disabled={!isKarachi}
                      checked={paymentMethod === "cod"}
                      onChange={() => {
                        if (!isKarachi) return
                        setPaymentMethod("cod")
                        setReceiptError("")
                      }}
                      className="mt-1 text-black focus:ring-black disabled:opacity-50"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-neutral-900">Cash on Delivery (COD)</p>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          isKarachi ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-600"
                        }`}>
                          Karachi Only
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        {isKarachi
                          ? "Pay cash when your parcel is delivered at your doorstep in Karachi."
                          : "Cash on Delivery is available exclusively within Karachi. For other cities and international orders, please use Direct Bank Transfer."}
                      </p>
                    </div>
                  </div>
                </label>

                {/* Option 2: Bank Transfer */}
                <label className={`block rounded-xl border p-4 cursor-pointer transition ${
                  paymentMethod === "bank_transfer" ? "border-black bg-neutral-50 ring-1 ring-black" : "border-neutral-200 hover:border-neutral-300"
                }`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === "bank_transfer"}
                      onChange={() => {
                        setPaymentMethod("bank_transfer")
                        setReceiptError("")
                      }}
                      className="mt-1 text-black focus:ring-black"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-neutral-900">{BANK_TRANSFER_CONFIG.title}</p>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                          Recommended
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        Pay via Online Banking or Raast and upload payment screenshot.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Bank Details & Screenshot Upload */}
                {paymentMethod === "bank_transfer" && (
                  <div className="mt-4 rounded-2xl border border-neutral-300 bg-white p-5 space-y-5 shadow-sm">
                    {/* Amount to transfer banner */}
                    <div className="rounded-xl bg-neutral-900 p-4 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-neutral-400">Total Payable Amount</p>
                        <p className="text-2xl font-bold mt-0.5">Rs. {pricing?.totalAmount ?? subTotal.toFixed(2)}</p>
                      </div>
                      <p className="text-xs text-neutral-300 max-w-xs">
                        Please transfer this exact amount to avoid verification and processing delays.
                      </p>
                    </div>

                    {/* Bank accounts list */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-3">
                        Official Bank Account Details
                      </h4>
                      <div className="space-y-3">
                        {BANK_TRANSFER_CONFIG.accounts.map((acc, index) => (
                          <div key={index} className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 text-sm space-y-2">
                            <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-neutral-200">
                              <div className="flex items-center gap-3">
                                {acc.logo && (
                                  <div className="relative size-12 shrink-0 bg-white rounded-xl p-1 border border-neutral-200 shadow-xs overflow-hidden">
                                    <Image
                                      src={acc.logo}
                                      alt={acc.bankName}
                                      fill
                                      className="object-contain p-0.5"
                                    />
                                  </div>
                                )}
                                <div>
                                  <span className="font-bold text-neutral-900 text-base leading-tight block">{acc.bankName}</span>
                                  {acc.branchName && (
                                    <span className="text-xs text-neutral-500 block mt-0.5">{acc.branchName}</span>
                                  )}
                                </div>
                              </div>
                              {acc.notes && (
                                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full hidden sm:inline-block">
                                  {acc.notes}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-neutral-600">
                              <span>Account Title: </span>
                              <strong className="text-neutral-900">{acc.accountTitle}</strong>
                            </div>
                            <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-200">
                              <div className="font-mono text-neutral-800">
                                <span className="text-neutral-500 font-sans">A/C: </span>{acc.accountNumber}
                              </div>
                              <button
                                type="button"
                                onClick={() => void copyBankDetail(acc.accountNumber, `ac-${index}`)}
                                className="text-[11px] font-medium text-neutral-700 hover:text-black px-2 py-0.5 rounded border border-neutral-300 bg-white"
                              >
                                {copiedBankField === `ac-${index}` ? "Copied!" : "Copy"}
                              </button>
                            </div>
                            {acc.iban && (
                              <div className="flex items-center justify-between text-xs">
                                <div className="font-mono text-neutral-800">
                                  <span className="text-neutral-500 font-sans">IBAN: </span>{acc.iban}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => void copyBankDetail(acc.iban!, `iban-${index}`)}
                                  className="text-[11px] font-medium text-neutral-700 hover:text-black px-2 py-0.5 rounded border border-neutral-300 bg-white"
                                >
                                  {copiedBankField === `iban-${index}` ? "Copied!" : "Copy IBAN"}
                                </button>
                              </div>
                            )}
                            {acc.raastId && (
                              <div className="flex items-center justify-between text-xs">
                                <div className="font-mono text-neutral-800">
                                  <span className="text-neutral-500 font-sans">Raast ID: </span>{acc.raastId}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => void copyBankDetail(acc.raastId!, `raast-${index}`)}
                                  className="text-[11px] font-medium text-neutral-700 hover:text-black px-2 py-0.5 rounded border border-neutral-300 bg-white"
                                >
                                  {copiedBankField === `raast-${index}` ? "Copied!" : "Copy"}
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-3 text-xs text-sky-900 space-y-1">
                      <p className="font-semibold text-sky-950">How it works:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-sky-800">
                        {BANK_TRANSFER_CONFIG.instructions.map((inst, i) => (
                          <li key={i}>{inst}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Screenshot Upload Field */}
                    <div className="pt-2">
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Upload Payment Screenshot / Receipt <span className="text-red-500">*</span>
                      </label>

                      {paymentReceipt ? (
                        <div className="rounded-xl border border-emerald-300 bg-emerald-50/50 p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                              <span className="size-2 rounded-full bg-emerald-500" />
                              Receipt Attached
                            </span>
                            <button
                              type="button"
                              onClick={() => setPaymentReceipt("")}
                              className="text-xs font-medium text-rose-600 hover:text-rose-800"
                            >
                              Remove & Re-upload
                            </button>
                          </div>
                          <div className="relative h-48 w-full rounded-lg overflow-hidden border border-emerald-200 bg-white">
                            <Image
                              src={paymentReceipt}
                              alt="Payment Screenshot"
                              fill
                              unoptimized
                              className="object-contain"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
                            uploadingReceipt ? "opacity-50 pointer-events-none" : "border-neutral-300 hover:border-black bg-neutral-50/50"
                          }`}>
                            <svg className="size-8 text-neutral-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium text-neutral-800">
                              {uploadingReceipt ? "Uploading screenshot..." : "Click to select or drop screenshot here"}
                            </span>
                            <span className="text-xs text-neutral-500 mt-1">
                              PNG, JPG, JPEG, WEBP up to 10MB
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleReceiptUpload}
                              disabled={uploadingReceipt}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}

                      {receiptError && (
                        <p className="mt-2 text-xs font-medium text-red-600">{receiptError}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={cart.length === 0 || submitting || !pricing || uploadingReceipt}
              className="w-full mt-6 py-4 bg-black text-white text-lg font-semibold uppercase rounded-lg hover:bg-neutral-800 transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Processing..."
                : paymentMethod === "bank_transfer"
                ? "Submit Order with Proof"
                : "Confirm Order"}
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
