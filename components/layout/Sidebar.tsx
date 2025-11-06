"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import {
  Home,
  Users,
  FileText,
  CreditCard,
  Layers,
  DollarSign,
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const navLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      adminOnly: false,
    },
    {
      href: "/dashboard/customers",
      label: "Clientes",
      icon: Users,
      adminOnly: false,
    },
    {
      href: "/dashboard/plans",
      label: "Planes",
      icon: Layers,
      adminOnly: false,
    },
    {
      href: "/dashboard/subscriptions",
      label: "Suscripciones",
      icon: FileText,
      adminOnly: false,
    },
    {
      href: "/dashboard/invoices",
      label: "Facturas",
      icon: DollarSign,
      adminOnly: false,
    },
    {
      href: "/dashboard/payments",
      label: "Pagos",
      icon: CreditCard,
      adminOnly: false,
    },
  ];

  const getLinkClass = (href: string) => {
    return pathname === href
      ? "bg-blue-600 text-white"
      : "text-gray-300 hover:bg-gray-700 hover:text-white";
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold">
        KdevBill
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navLinks.map((link) => {
          if (link.adminOnly && user?.role !== "ADMIN") {
            return null;
          }

          const Icon = link.icon;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center px-4 py-2.5 rounded-md text-sm font-medium ${getLinkClass(
                link.href
              )}`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
