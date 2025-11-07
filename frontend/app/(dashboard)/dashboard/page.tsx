"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { subscriptionService } from "@/services/subscription.service";
import { invoiceService } from "@/services/invoice.service";
import { paymentService } from "@/services/payment.service";
import { customerService } from "@/services/customer.service";
import { LoadingSkeleton } from "@/components/ui/LoadingButton";
import {
  Users,
  CreditCard,
  FileText,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

interface DashboardData {
  totalCustomers: number;
  activeSubscriptions: number;
  totalSubscriptions: number;
  openInvoices: number;
  paidInvoices: number;
  totalInvoices: number;
  successfulPayments: number;
  totalPayments: number;
  monthlyRevenue: number;
  totalRevenue: number;
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = useAuthStore((state) => state.isAdmin());
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [customers, subscriptions, invoices, payments] =
          await Promise.all([
            isAdmin ? customerService.getAll() : Promise.resolve([]),
            subscriptionService.getAll(),
            invoiceService.getAll(),
            paymentService.getAll(),
          ]);

        const activeSubscriptions = subscriptions.filter(
          (sub) => sub.status === "ACTIVE"
        ).length;
        const openInvoices = invoices.filter(
          (inv) => inv.status === "OPEN"
        ).length;
        const paidInvoices = invoices.filter(
          (inv) => inv.status === "PAID"
        ).length;
        const successfulPayments = payments.filter(
          (pay) => pay.status === "SUCCESS"
        ).length;

        const totalRevenue = payments
          .filter((pay) => pay.status === "SUCCESS")
          .reduce((sum, pay) => sum + pay.amount, 0);

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = payments
          .filter((pay) => {
            const payDate = new Date(pay.paidAt);
            return (
              pay.status === "SUCCESS" &&
              payDate.getMonth() === currentMonth &&
              payDate.getFullYear() === currentYear
            );
          })
          .reduce((sum, pay) => sum + pay.amount, 0);

        setData({
          totalCustomers: customers.length,
          activeSubscriptions,
          totalSubscriptions: subscriptions.length,
          openInvoices,
          paidInvoices,
          totalInvoices: invoices.length,
          successfulPayments,
          totalPayments: payments.length,
          monthlyRevenue,
          totalRevenue,
        });
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAdmin]);

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <LoadingSkeleton lines={8} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          ¡Bienvenido, {user?.username || user?.email}!
        </h1>
        <p className="mt-2 text-gray-600">
          Panel de control - Resumen de tu negocio de suscripciones
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Clientes (Solo admin) */}
        {isAdmin && (
          <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Clientes
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.totalCustomers || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Suscripciones */}
        <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Suscripciones Activas
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {data?.activeSubscriptions || 0}
              </p>
              <p className="text-xs text-gray-500">
                de {data?.totalSubscriptions || 0} total
              </p>
            </div>
          </div>
        </div>

        {/* Facturas Pendientes */}
        <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Facturas Pendientes
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {data?.openInvoices || 0}
              </p>
              <p className="text-xs text-gray-500">
                {data?.paidInvoices || 0} pagadas
              </p>
            </div>
          </div>
        </div>

        {/* Ingresos del Mes */}
        <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Ingresos del Mes
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ${data?.monthlyRevenue.toFixed(2) || "0.00"}
              </p>
              <p className="text-xs text-gray-500">
                Total: ${data?.totalRevenue.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen Adicional */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Resumen de Pagos */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <CreditCard className="w-6 h-6 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Resumen de Pagos
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pagos Exitosos:</span>
              <span className="text-sm font-medium text-green-600">
                {data?.successfulPayments || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Pagos:</span>
              <span className="text-sm font-medium text-gray-900">
                {data?.totalPayments || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tasa de Éxito:</span>
              <span className="text-sm font-medium text-blue-600">
                {data?.totalPayments
                  ? (
                      (data.successfulPayments / data.totalPayments) *
                      100
                    ).toFixed(1)
                  : "0"}
                %
              </span>
            </div>
          </div>
        </div>

        {/* Resumen de Suscripciones */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Estado de Suscripciones
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Activas:</span>
              <span className="text-sm font-medium text-green-600">
                {data?.activeSubscriptions || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total:</span>
              <span className="text-sm font-medium text-gray-900">
                {data?.totalSubscriptions || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tasa de Actividad:</span>
              <span className="text-sm font-medium text-blue-600">
                {data?.totalSubscriptions
                  ? (
                      (data.activeSubscriptions / data.totalSubscriptions) *
                      100
                    ).toFixed(1)
                  : "0"}
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      {data?.openInvoices && data.openInvoices > 0 && (
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <p className="text-sm text-yellow-800">
              Tienes <strong>{data.openInvoices}</strong> facturas pendientes de
              pago.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
