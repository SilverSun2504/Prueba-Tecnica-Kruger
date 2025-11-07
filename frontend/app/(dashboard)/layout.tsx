"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { redirect } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="ml-4 text-lg text-gray-700">Cargando...</p>
  </div>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (!hasHydrated) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
