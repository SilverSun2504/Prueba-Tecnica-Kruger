"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Search,
  Calendar,
  User,
  CreditCard,
  CheckCircle,
  XCircle,
  Eye,
  DollarSign,
  Hash,
} from "lucide-react";

import { paymentService } from "@/services/payment.service";
import { Payment } from "@/lib/schemas";
import { LoadingSkeleton, EmptyState } from "@/components/ui/LoadingButton";
import { Modal } from "@/components/ui/Modal";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "SUCCESS" | "FAILED"
  >("ALL");
  const [methodFilter, setMethodFilter] = useState<
    "ALL" | "CARD" | "TRANSFER" | "CASH"
  >("ALL");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Fetch payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getAll();
      setPayments(data);
    } catch (error) {
      toast.error("Error al cargar pagos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.invoice.subscription.customer.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.invoice.subscription.customer.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || payment.status === statusFilter;
    const matchesMethod =
      methodFilter === "ALL" || payment.method === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Get status badge
  const getStatusBadge = (status: Payment["status"]) => {
    const statusConfig = {
      SUCCESS: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Exitoso",
      },
      FAILED: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        label: "Falló",
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  // Get method badge
  const getMethodBadge = (method: Payment["method"]) => {
    const methodConfig = {
      CARD: { color: "bg-blue-100 text-blue-800", label: "Tarjeta" },
      TRANSFER: {
        color: "bg-purple-100 text-purple-800",
        label: "Transferencia",
      },
      CASH: { color: "bg-gray-100 text-gray-800", label: "Efectivo" },
    };

    const config = methodConfig[method];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <CreditCard className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Pagos</h1>
        <LoadingSkeleton lines={6} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pagos</h1>
        <p className="mt-2 text-gray-600">
          Historial completo de todos los pagos procesados
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Pagos Exitosos
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.filter((p) => p.status === "SUCCESS").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Pagos Fallidos
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.filter((p) => p.status === "FAILED").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Recaudado
              </p>
              <p className="text-2xl font-bold text-gray-900">
                $
                {payments
                  .filter((p) => p.status === "SUCCESS")
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tasa de Éxito</p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.length > 0
                  ? (
                      (payments.filter((p) => p.status === "SUCCESS").length /
                        payments.length) *
                      100
                    ).toFixed(1)
                  : "0"}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por cliente o referencia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="lg:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">Todos los estados</option>
            <option value="SUCCESS">Exitosos</option>
            <option value="FAILED">Fallidos</option>
          </select>
        </div>
        <div className="lg:w-48">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value as any)}
            className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">Todos los métodos</option>
            <option value="CARD">Tarjeta</option>
            <option value="TRANSFER">Transferencia</option>
            <option value="CASH">Efectivo</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {filteredPayments.length === 0 ? (
        <EmptyState
          title={
            searchTerm || statusFilter !== "ALL" || methodFilter !== "ALL"
              ? "No se encontraron pagos"
              : "No hay pagos"
          }
          description={
            searchTerm || statusFilter !== "ALL" || methodFilter !== "ALL"
              ? "Intenta ajustar los filtros"
              : "Los pagos aparecerán aquí cuando se procesen facturas"
          }
        />
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Factura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Hash className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {payment.reference}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.invoice.subscription.customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.invoice.subscription.customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        INV-{payment.invoice.id.toString().padStart(4, "0")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          ${payment.amount.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getMethodBadge(payment.method)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(payment.paidAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setIsDetailModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedPayment(null);
        }}
        title="Detalle del Pago"
        maxWidth="lg"
      >
        {selectedPayment && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Referencia:</span>
                  <p className="text-gray-900 font-mono">
                    {selectedPayment.reference}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Estado:</span>
                  <div className="mt-1">
                    {getStatusBadge(selectedPayment.status)}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Método de Pago:
                  </span>
                  <div className="mt-1">
                    {getMethodBadge(selectedPayment.method)}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Fecha de Pago:
                  </span>
                  <p className="text-gray-900">
                    {new Date(selectedPayment.paidAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                Información del Cliente
              </h4>
              <div className="bg-white border rounded-lg p-4">
                <p className="font-medium text-gray-900">
                  {selectedPayment.invoice.subscription.customer.name}
                </p>
                <p className="text-gray-600">
                  {selectedPayment.invoice.subscription.customer.email}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                Detalles de la Factura
              </h4>
              <div className="bg-white border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Número de Factura:</span>
                  <span className="font-medium text-gray-900">
                    INV-{selectedPayment.invoice.id.toString().padStart(4, "0")}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Plan:</span>
                  <span className="text-gray-900">
                    {selectedPayment.invoice.subscription.plan.name}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Fecha de Emisión:</span>
                  <span className="text-gray-900">
                    {new Date(
                      selectedPayment.invoice.issuedAt
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-medium border-t pt-2 mt-2">
                  <span className="text-gray-900">Monto Pagado:</span>
                  <span className="text-gray-900">
                    ${selectedPayment.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
