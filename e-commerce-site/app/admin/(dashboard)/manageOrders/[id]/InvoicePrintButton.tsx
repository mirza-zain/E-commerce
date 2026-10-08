"use client";

import Image from "next/image";
import { Order } from "@/app/types/order";

export default function InvoicePrintButton({ order }: { order: Order }) {
  return (
    <>
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 print:hidden"
      >
        Print Invoice
      </button>

      <section className="mx-auto hidden max-w-3xl bg-white p-8 text-black print:block print:max-w-none print:p-0">
        <div className="flex items-start justify-between border-b border-neutral-200 pb-6">
          <div className="flex items-center gap-4">
            <Image src="/images/logo.png" alt="Zarb Official" width={180} height={60} className="h-14 w-auto object-contain" />
            <div>
              <h1 className="text-2xl font-bold">Zarb Official</h1>
              <p className="text-sm text-neutral-500">Premium fragrances</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold uppercase tracking-wide">Invoice</h2>
            <p className="mt-1 text-sm text-neutral-600">Order #{order.id}</p>
            <p className="text-sm text-neutral-600">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 border-b border-neutral-200 py-6 text-sm">
          <div>
            <h3 className="font-semibold uppercase tracking-wide text-neutral-500">Bill to</h3>
            <p className="mt-2 font-semibold">{order.firstName} {order.lastName}</p>
            <p>{order.email}</p>
            <p>{order.phoneNum}</p>
            <p>{order.address}, {order.city}</p>
          </div>
          <div className="text-right">
            <h3 className="font-semibold uppercase tracking-wide text-neutral-500">Order details</h3>
            <p className="mt-2">Tracking ID: {order.trackingId}</p>
            <p>Status: <span className="capitalize">{order.status}</span></p>
            <p>Payment: Cash on Delivery</p>
          </div>
        </div>

        <table className="mt-6 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-300">
              <th className="pb-3">Product</th>
              <th className="pb-3 text-center">Qty</th>
              <th className="pb-3 text-right">Unit price</th>
              <th className="pb-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId} className="border-b border-neutral-100">
                <td className="py-3">{item.productName}</td>
                <td className="py-3 text-center">{item.quantity}</td>
                <td className="py-3 text-right">Rs. {item.price}</td>
                <td className="py-3 text-right">Rs. {(Number(item.price) * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto mt-6 w-64 space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>Rs. {order.subTotal}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>Rs. {order.deliveryAmount}</span></div>
          <div className="flex justify-between"><span>Discount</span><span>- Rs. {order.discountAmount}</span></div>
          <div className="flex justify-between border-t border-neutral-300 pt-3 text-base font-bold">
            <span>Total</span><span>Rs. {order.totalAmount}</span>
          </div>
        </div>

        <p className="mt-12 border-t border-neutral-200 pt-4 text-center text-xs text-neutral-500">
          Thank you for shopping with Zarb Official.
        </p>
      </section>
    </>
  );
}
