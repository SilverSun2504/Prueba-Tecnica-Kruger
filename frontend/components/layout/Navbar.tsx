// src/components/layout/Navbar.tsx
"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
      <div className="text-gray-800">
        <h1 className="text-xl font-semibold">Kruger Billing System</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-5 h-5 mr-2" />
          <span className="font-medium">{user?.email}</span>
          <span className="ml-2 text-xs text-gray-500">({user?.role})</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-100"
        >
          <LogOut className="w-5 h-5 mr-1" />
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

export default Navbar;
