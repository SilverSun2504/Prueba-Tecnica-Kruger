"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import Link from "next/link";

import { LoginSchema } from "@/lib/schemas";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

type LoginFormInputs = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginSchema),
  });

  const fillDemoCredentials = (userType: "admin" | "user") => {
    const demoUsers = {
      admin: {
        email: "admin2",
        password: "admin123",
      },
      user: {
        email: "user1",
        password: "user123",
      },
    };

    const userData = demoUsers[userType];
    setValue("email", userData.email);
    setValue("password", userData.password);
    toast.success(`Credenciales de ${userType} llenadas.`);
  };
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await authService.login(data);
      login(response.token, response.user);
      toast.success("¡Bienvenido!");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Credenciales incorrectas";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Iniciar Sesión
        </h2>
        <h3 className="text-center text-gray-600">Kruger Billing (KdevBill)</h3>

        {/* Botones de Demo */}
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3">Usuarios de prueba:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fillDemoCredentials("admin")}
                className="px-3 py-2 text-xs font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Crear Admin Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials("user")}
                className="px-3 py-2 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Crear Usuario Demo
              </button>
            </div>
          </div>
          <div className="border-t border-gray-200"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Campo de Username/Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Username o Email
            </label>
            <input
              id="email"
              type="text"
              placeholder="admin2 o tu@email.com"
              {...register("email")}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Campo de Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Botón de Submit */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
        </form>

        {/* Credenciales de prueba */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Credenciales de Prueba:
          </h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div>
              <strong>Admin:</strong> admin2 / admin123
            </div>
            <div>
              <strong>Usuario:</strong> user1 / user123
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Crea una aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
