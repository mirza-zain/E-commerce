'use client'

import { ArrowLeftIcon, SquaresFourIcon, PackageIcon, ReceiptIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: SquaresFourIcon, exact: true },
    { href: "/admin/manageProducts", label: "Manage Products", icon: PackageIcon, exact: false },
    { href: "/admin/manageOrders", label: "Manage Orders", icon: ReceiptIcon, exact: false },
  ];

  return (
    <nav className="w-64 min-h-screen py-8 px-5 flex flex-col bg-white border-r border-neutral-200 shrink-0">
      <div className="px-3 pb-6 border-b border-neutral-100">
        <h1 className="text-2xl font-bold font-[Gebuk] tracking-tight">
          Zarb Admin
        </h1>
        <p className="text-xs text-neutral-400 mt-0.5">Store Operations Console</p>
      </div>

      <div className="mt-8">
        <ul className="flex flex-col gap-1.5">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-black text-white shadow-sm"
                      : "text-neutral-600 hover:text-black hover:bg-neutral-100"
                  }`}
                >
                  <Icon className="size-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto pt-6 border-t border-neutral-100">
        <Link
          className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-xl transition"
          href="/"
        >
          <ArrowLeftIcon className="size-4" />
          <span>Back to Store</span>
        </Link>
      </div>
    </nav>
  );
}