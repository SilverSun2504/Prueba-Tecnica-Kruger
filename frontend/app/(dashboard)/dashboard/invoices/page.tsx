"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Search,
  Calendar,
  User,
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
  CreditCard,
  Eye,
  DollarSign,
} from "lucide-react";

import { invoiceService } from "@/services/invoice.service";
import { Invoice } from "@/lib/schemas";
import { LoadingSkeleton, EmptyState } from "@/components/ui/LoadingButton";
import { Modal } from "@/components/ui/Modal";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "OPEN" | "PAID" | "VOID"
  >("ALL");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "CARD" | "TRANSFER" | "CASH"
  >("CARD");
  const [processingPayment, setProcessingPayment] = useState(false);

  // Fetch invoices
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getAll();
      setInvoices(data);
    } catch (error) {
      toast.error("Error al cargar facturas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.subscription.customer.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      invoice.subscription.customer.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      invoice.subscription.plan.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle payment
  const handlePayment = async () => {
    if (!selectedInvoice) return;

    try {
      setProcessingPayment(true);
      await invoiceService.pay(selectedInvoice.id, paymentMethod);
      toast.success("Pago procesado exitosamente");
      await fetchInvoices();
      setIsPaymentModalOpen(false);
      setSelectedInvoice(null);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al procesar el pago";
      toast.error(message);
    } finally {
      setProcessingPayment(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status: Invoice["status"]) => {
    const statusConfig = {
      OPEN: {
        color: "bg-yellow-100 text-yellow-800",
        icon: AlertTriangle,
        label: "Pendiente",
      },
      PAID: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Pagada",
      },
      VOID: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        label: "Anulada",
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

  // Check if invoice is overdue
  const isOverdue = (invoice: Invoice) => {
    return invoice.status === "OPEN" && new Date(invoice.dueDate) < new Date();
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Facturas</h1>
        <LoadingSkeleton lines={6} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Facturas</h1>
        <p className="mt-2 text-gray-600">
          Gestiona todas tus facturas y procesa pagos
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por cliente o plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">Todos los estados</option>
            <option value="OPEN">Pendientes</option>
            <option value="PAID">Pagadas</option>
            <option value="VOID">Anuladas</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {filteredInvoices.length === 0 ? (
        <EmptyState
          title={
            searchTerm || statusFilter !== "ALL"
              ? "No se encontraron facturas"
              : "No hay facturas"
          }
          description={
            searchTerm || statusFilter !== "ALL"
              ? "Intenta ajustar los filtros"
              : "Las facturas se generarán automáticamente con las suscripciones"
          }
        />
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #Factura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vence
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className={`hover:bg-gray-50 ${
                      isOverdue(invoice) ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        INV-{invoice.id.toString().padStart(4, "0")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(invoice.issuedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {invoice.subscription.customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {invoice.subscription.customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {invoice.subscription.plan.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          ${invoice.amount.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(invoice.status)}
                        {isOverdue(invoice) && (
                          <span className="text-xs text-red-600 font-medium">
                            Vencida
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setIsDetailModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {invoice.status === "OPEN" && (
                          <button
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setIsPaymentModalOpen(true);
                            }}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Pagar"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedInvoice(null);
        }}
        title="Detalle de Factura"
        maxWidth="lg"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Número:</span>
                  <p className="text-gray-900">
                    INV-{selectedInvoice.id.toString().padStart(4, "0")}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Estado:</span>
                  <div className="mt-1">
                    {getStatusBadge(selectedInvoice.status)}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Fecha de Emisión:
                  </span>
                  <p className="text-gray-900">
                    {new Date(selectedInvoice.issuedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Fecha de Vencimiento:
                  </span>
                  <p className="text-gray-900">
                    {new Date(selectedInvoice.dueDate).toLocaleDateString()}
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
                  {selectedInvoice.subscription.customer.name}
                </p>
                <p className="text-gray-600">
                  {selectedInvoice.subscription.customer.email}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                Detalles del Servicio
              </h4>
              <div className="bg-white border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium text-gray-900">
                    {selectedInvoice.subscription.plan.name}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Ciclo:</span>
                  <span className="text-gray-900">
                    {selectedInvoice.subscription.plan.billingCycle ===
                    "MONTHLY"
                      ? "Mensual"
                      : "Anual"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-medium">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">
                    ${selectedInvoice.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedInvoice(null);
          setPaymentMethod("CARD");
        }}
        title="Procesar Pago"
      >
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600">Monto a pagar</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${selectedInvoice.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  Factura INV-{selectedInvoice.id.toString().padStart(4, "0")}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pago
              </label>
              <div className="space-y-2">
                {[
                  { value: "CARD", label: "Tarjeta de Crédito/Débito" },
                  { value: "TRANSFER", label: "Transferencia Bancaria" },
                  { value: "CASH", label: "Efectivo" },
                ].map((method) => (
                  <div key={method.value} className="flex items-center">
                    <input
                      id={method.value}
                      name="paymentMethod"
                      type="radio"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor={method.value}
                      className="ml-3 block text-sm text-gray-900"
                    >
                      {method.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsPaymentModalOpen(false);
                  setSelectedInvoice(null);
                  setPaymentMethod("CARD");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={processingPayment}
              >
                Cancelar
              </button>
              <button
                onClick={handlePayment}
                disabled={processingPayment}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {processingPayment ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Confirmar Pago
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
