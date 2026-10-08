"use client";

import Image from "next/image";
import { Order } from "@/app/types/order";
import { PrinterIcon } from "@phosphor-icons/react";

export default function InvoicePrintButton({ order }: { order: Order }) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  const formattedTime = new Date(order.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          body {
            background-color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}} />

      {/* Admin Action Bar (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-neutral-200 rounded-2xl shadow-sm print:hidden">
        <div>
          <h3 className="text-base font-bold text-neutral-900">
            Shipping Invoice & Parcel Packing Slip
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Optimized for printing and attaching directly onto delivery boxes or packing pouches.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-sm font-semibold rounded-xl shadow-sm transition active:scale-[0.98]"
        >
          <PrinterIcon className="size-4" />
          <span>Print for Box</span>
        </button>
      </div>

      {/* Printable Invoice Container */}
      <div className="bg-white border border-neutral-300 rounded-2xl shadow-sm p-6 sm:p-10 max-w-4xl mx-auto print:border-0 print:p-0 print:shadow-none print:max-w-none print:w-full">
        {/* Invoice Border Frame (Ideal for cutting or pasting on parcel) */}
        <div className="border-2 border-neutral-900 p-6 sm:p-8 space-y-6 text-neutral-900 print:p-6 print:border-2 print:border-black">
          
          {/* 1. Header: Brand & Document Meta */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-neutral-900">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Zarb Official"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-[Gebuk] uppercase">
                  Zarb Official
                </h1>
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-600">
                  Luxury Perfume House • Pakistan
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  support@zarbofficial.com • zarbofficial.com
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-md">
                Shipping Invoice
              </span>
              <p className="font-mono text-base font-bold text-neutral-900 mt-2">
                #ORD-{order.id}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Date: {formattedDate} ({formattedTime})
              </p>
            </div>
          </div>

          {/* 2. Courier Barcode & Tracking Identifier */}
          <div className="bg-neutral-50 border border-neutral-300 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:bg-white print:border-black">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Consignment / Tracking Number
              </p>
              <p className="font-mono text-xl sm:text-2xl font-black text-neutral-900 tracking-wider">
                {order.trackingId || `ZRB-${order.id}-PK`}
              </p>
            </div>

            {/* Stylized Barcode Graphic */}
            <div className="flex flex-col items-start sm:items-end">
              <div className="flex items-center gap-[2px] h-8 overflow-hidden" aria-hidden="true">
                <span className="w-1 h-full bg-black"></span>
                <span className="w-0.5 h-full bg-black"></span>
                <span className="w-1.5 h-full bg-black"></span>
                <span className="w-0.5 h-full bg-black"></span>
                <span className="w-1 h-full bg-black"></span>
                <span className="w-2 h-full bg-black"></span>
                <span className="w-0.5 h-full bg-black"></span>
                <span className="w-1 h-full bg-black"></span>
                <span className="w-1.5 h-full bg-black"></span>
                <span className="w-0.5 h-full bg-black"></span>
                <span className="w-2 h-full bg-black"></span>
                <span className="w-1 h-full bg-black"></span>
                <span className="w-0.5 h-full bg-black"></span>
                <span className="w-1.5 h-full bg-black"></span>
                <span className="w-1 h-full bg-black"></span>
                <span className="w-2 h-full bg-black"></span>
                <span className="w-0.5 h-full bg-black"></span>
                <span className="w-1.5 h-full bg-black"></span>
                <span className="w-0.5 h-full bg-black"></span>
                <span className="w-1 h-full bg-black"></span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 mt-1">
                COURIER SCAN ID
              </span>
            </div>
          </div>

          {/* 3. Address Blocks: Ship To (Recipient) vs Return To (Shipper) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* DELIVER TO BOX */}
            <div className="border-2 border-neutral-900 p-4 rounded-xl space-y-1.5 bg-white print:border-black">
              <div className="flex items-center justify-between pb-1.5 border-b border-neutral-300">
                <span className="text-xs font-black uppercase tracking-wider text-black">
                  📦 Deliver To (Customer)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-neutral-100 rounded text-neutral-700">
                  DESTINATION
                </span>
              </div>

              <p className="text-base font-black text-black">
                {order.firstName} {order.lastName}
              </p>

              <div className="text-sm font-bold text-neutral-900 bg-neutral-100 px-2 py-1 rounded inline-block print:bg-transparent print:p-0">
                📞 {order.phoneNum}
              </div>

              <p className="text-xs font-medium text-neutral-800 leading-snug pt-1">
                {order.address}
              </p>

              <p className="text-xs font-black uppercase text-black pt-1">
                City: <span className="underline">{order.city}</span>, Pakistan
              </p>
            </div>

            {/* SENDER / RETURN ADDRESS */}
            <div className="border border-neutral-400 p-4 rounded-xl space-y-1.5 bg-neutral-50/50 print:bg-white print:border-black">
              <div className="flex items-center justify-between pb-1.5 border-b border-neutral-300">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                  ↩ Return If Undelivered
                </span>
                <span className="text-[10px] font-semibold text-neutral-500">
                  SHIPPER
                </span>
              </div>

              <p className="text-sm font-bold text-neutral-900">
                Zarb Official Fulfillment Center
              </p>

              <p className="text-xs text-neutral-600">
                Karachi Central Logistics Hub, Sindh, Pakistan
              </p>

              <p className="text-xs text-neutral-600">
                Email: support@zarbofficial.com
              </p>

              <p className="text-xs text-neutral-600">
                Web: https://zarbofficial.com
              </p>
            </div>
          </div>

          {/* 4. Payment / COD Collection Box (CRITICAL FOR PARCELS!) */}
          <div className="border-2 border-dashed border-neutral-900 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 print:bg-white print:border-black">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-neutral-600">
                Payment Method
              </span>
              <p className="text-base font-extrabold text-neutral-900">
                CASH ON DELIVERY (COD)
              </p>
              <p className="text-[11px] text-neutral-500">
                Collect exact amount in cash before handing over parcel
              </p>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l sm:pl-6 border-neutral-300 pt-2 sm:pt-0">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-700">
                Amount To Collect
              </span>
              <p className="text-2xl sm:text-3xl font-black text-black">
                Rs. {order.totalAmount}
              </p>
            </div>
          </div>

          {/* 5. Itemized Package Contents Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Package Contents / Packing List
              </h4>
              <span className="text-[11px] text-neutral-500">
                Total Items: {order.items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>

            <table className="w-full text-left border-collapse border border-neutral-300 text-xs print:border-black">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-300 font-bold uppercase tracking-wider text-neutral-700 print:bg-white print:border-black">
                  <th className="py-2.5 px-3 border-r border-neutral-300 w-12 text-center print:border-black">#</th>
                  <th className="py-2.5 px-3 border-r border-neutral-300 print:border-black">Fragrance Description</th>
                  <th className="py-2.5 px-3 border-r border-neutral-300 text-center w-16 print:border-black">Qty</th>
                  <th className="py-2.5 px-3 border-r border-neutral-300 text-right w-24 print:border-black">Rate</th>
                  <th className="py-2.5 px-3 text-right w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-medium print:divide-black">
                {order.items.map((item, idx) => (
                  <tr key={item.productId || idx} className="hover:bg-neutral-50 print:hover:bg-transparent">
                    <td className="py-2 px-3 border-r border-neutral-300 text-center text-neutral-500 font-mono print:border-black">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-3 border-r border-neutral-300 font-semibold text-neutral-900 print:border-black">
                      {item.productName}
                      <span className="block text-[10px] text-neutral-500 font-normal">
                        Bottle / Perfume Oil
                      </span>
                    </td>
                    <td className="py-2 px-3 border-r border-neutral-300 text-center font-bold print:border-black">
                      {item.quantity}
                    </td>
                    <td className="py-2 px-3 border-r border-neutral-300 text-right font-mono print:border-black">
                      Rs. {item.price}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold">
                      Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 6. Pricing Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="text-[11px] text-neutral-500 space-y-1 max-w-xs">
              <p className="font-semibold text-neutral-700">📦 Security & Packing Notice:</p>
              <p>Glass fragrance bottles packed with protective cushioning.</p>
              <p>Customer signature required upon delivery.</p>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-mono">Rs. {order.subTotal}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping / Delivery:</span>
                <span className="font-mono">Rs. {order.deliveryAmount}</span>
              </div>
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Discount {order.discountCode ? `(${order.discountCode})` : ""}:</span>
                  <span className="font-mono text-emerald-700">- Rs. {order.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between border-t-2 border-neutral-900 pt-2 text-sm font-black text-black">
                <span>NET TOTAL DUE:</span>
                <span className="font-mono text-base">Rs. {order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* 7. Parcel Box Footer / Fragile Notice */}
          <div className="pt-4 border-t-2 border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
              <span>⚠️ FRAGILE — GLASS BOTTLES</span>
              <span className="hidden sm:inline">•</span>
              <span>HANDLE WITH CARE</span>
            </div>

            <div className="text-[11px] text-neutral-500 font-mono">
              VERIFIED & PACKED BY ZARB LOGISTICS
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
