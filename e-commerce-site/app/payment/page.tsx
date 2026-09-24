import Image from "next/image";
import Link from "next/link";
import { prodDetails } from "@/app/testData/productDetails";

type Props = {
  searchParams: Promise<{
    id?: string;
  }>;
};

export default async function PaymentPage({ searchParams }: Props) {
  const { id } = await searchParams;
  const product = prodDetails.find((item) => item.id === Number(id)) || prodDetails[0];

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

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">First Name</label>
                <input 
                  type="text" 
                  placeholder="Ali" 
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Last Name</label>
                <input 
                  type="text" 
                  placeholder="Khan" 
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
              <input 
                type="email" 
                placeholder="ali@example.com" 
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Street Address</label>
              <input 
                type="text" 
                placeholder="House #, Street name" 
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                <input 
                  type="text" 
                  placeholder="Karachi" 
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="0300 1234567" 
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
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
                <label className="flex items-center gap-3 p-4 border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50 transition">
                  <input type="radio" name="payment" className="accent-black" />
                  <div>
                    <p className="font-medium text-neutral-900">Credit / Debit Card</p>
                    <p className="text-xs text-neutral-500">Pay securely via Visa / MasterCard</p>
                  </div>
                </label>
              </div>
            </div>

            <button 
              type="button" 
              className="w-full mt-6 py-4 bg-black text-white text-lg font-semibold uppercase rounded-lg hover:bg-neutral-800 transition active:scale-[0.99]"
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

          {product ? (
            <div className="flex items-center gap-4 pb-6 border-b border-neutral-200">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-neutral-200 shrink-0">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-cover" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-neutral-900 truncate">
                  Zarb Official {product.name}
                </h3>
                <p className="text-sm text-neutral-500">Qty: 1</p>
                <p className="text-base font-medium mt-1">Rs. {product.price}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-500">No item selected</p>
          )}

          <div className="space-y-3 py-4 text-sm border-b border-neutral-200">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>Rs. {product ? product.price : 0}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Delivery Charges</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 text-lg font-bold text-neutral-900">
            <span>Total</span>
            <span>Rs. {product ? product.price : 0}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
