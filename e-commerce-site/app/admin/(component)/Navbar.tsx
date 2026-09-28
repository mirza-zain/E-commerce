'use client'

import { ArrowLeftIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-64 min-h-screen py-10 px-5 flex flex-col items-center border-r-2 border-gray-500">

      <div>
        <h1 className="text-3xl font-bold font-[Gebuk]">
          Zarb Official ©
        </h1>
      </div>

      <div className="mt-20">
        <ul className="flex flex-col gap-10">
          <li className="text-xl font-medium">
            <Link href="/admin">Dashboard</Link>
          </li>

          <li className="text-xl font-medium">
            <Link href="/admin/manageProducts">
              Manage Products
            </Link>
          </li>

          <li className="text-xl font-medium">
            <Link href="/admin/manageOrders">
              Manage Orders
            </Link>
          </li>
        </ul>
      </div>

      <div className="mt-auto">
        <Link
          className="flex items-center gap-2 text-base"
          href="/"
        >
          <ArrowLeftIcon size={20} />
          Back to store
        </Link>
      </div>

    </nav>
  )
}