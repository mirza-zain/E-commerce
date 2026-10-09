'use client'

import { ArrowLeftIcon, SquaresFourIcon, PackageIcon, ReceiptIcon, TagIcon, ChartBarIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: SquaresFourIcon, exact: true },
    { href: "/admin/sales", label: "Monthly Sales", icon: ChartBarIcon, exact: false },
    { href: "/admin/manageOrders", label: "Manage Orders", icon: ReceiptIcon, exact: false },
    { href: "/admin/manageProducts", label: "Manage Products", icon: PackageIcon, exact: false },
    { href: "/admin/pricing", label: "Pricing Rules", icon: TagIcon, exact: false },
  ];

  return (
    <nav className="flex w-full shrink-0 flex-col border-b border-neutral-200 bg-white px-4 py-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:px-5 md:py-8 print:hidden">
      <div className="border-b border-neutral-100 px-1 pb-4 md:px-3 md:pb-6">
        <h1 className="text-2xl font-bold font-[Gebuk] tracking-tight">
          Zarb Admin
        </h1>
        <p className="text-xs text-neutral-400 mt-0.5">Store Operations Console</p>
      </div>

      <div className="mt-4 md:mt-8">
        <ul className="flex gap-1.5 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
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

      <div className="mt-4 border-t border-neutral-100 pt-4 md:mt-auto md:pt-6">
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