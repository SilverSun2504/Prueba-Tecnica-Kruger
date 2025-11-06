"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import {
  Plus,
  Search,
  Edit,
  RefreshCw,
  Calendar,
  User,
  Package,
  CheckCircle,
  Pause,
  X,
} from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { subscriptionService } from "@/services/subscription.service";
import { customerService } from "@/services/customer.service";
import { planService } from "@/services/plan.service";
import {
  Subscription,
  SubscriptionSchema,
  Customer,
  Plan,
} from "@/lib/schemas";
import {
  LoadingButton,
  LoadingSkeleton,
  EmptyState,
} from "@/components/ui/LoadingButton";
import { Modal } from "@/components/ui/Modal";
import { z } from "zod";

type SubscriptionFormInputs = z.infer<typeof SubscriptionSchema>;

export default function SubscriptionsPage() {
  const _isAdmin = useAuthStore((state) => state.isAdmin());
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "PAUSED" | "CANCELED"
  >("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionFormInputs>({
    resolver: zodResolver(SubscriptionSchema),
  });

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [subscriptionsData, customersData, plansData] = await Promise.all([
        subscriptionService.getAll(),
        customerService.getAll(),
        planService.getAll(),
      ]);

      setSubscriptions(subscriptionsData);
      setCustomers(customersData);
      setPlans(plansData.filter((plan) => plan.active)); // Solo planes activos para nuevas suscripciones
    } catch (error) {
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch =
      subscription.customer.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      subscription.customer.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      subscription.plan.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || subscription.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle form submission
  const onSubmit = async (data: SubscriptionFormInputs) => {
    console.log("📤 Datos de suscripción a enviar:", data);
    try {
      if (editingSubscription) {
        // Update existing subscription
        await subscriptionService.update(editingSubscription.id, {
          planId: data.planId,
        });
        toast.success("Suscripción actualizada exitosamente");
      } else {
        // Create new subscription
        console.log("🆕 Creando nueva suscripción...");
        await subscriptionService.create(data);
        toast.success("Suscripción creada exitosamente");
      }

      await fetchData();
      handleCloseModal();
    } catch (error: any) {
      console.error("❌ Error al crear suscripción:", error);
      console.error("❌ Error response:", error.response);
      console.error("❌ Error response data:", error.response?.data);

      let message = "Error al guardar suscripción";

      if (
        error.response?.data?.message ===
        "Authenticated user does not have a customer profile"
      ) {
        message =
          "El usuario actual no tiene un perfil de cliente asociado. Contacta al administrador del sistema.";
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      toast.error(message);
    }
  };

  // Handle status change
  const handleStatusChange = async (
    id: number,
    newStatus: "ACTIVE" | "PAUSED" | "CANCELED"
  ) => {
    try {
      await subscriptionService.update(id, { status: newStatus });
      toast.success(`Suscripción ${newStatus.toLowerCase()} exitosamente`);
      await fetchData();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al cambiar estado";
      toast.error(message);
    }
  };

  // Handle renew subscription
  const handleRenew = async (id: number) => {
    try {
      await subscriptionService.renew(id);
      toast.success("Factura de renovación generada exitosamente");
      await fetchData();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al renovar suscripción";
      toast.error(message);
    }
  };

  // Handle modal actions
  const handleOpenModal = (subscription?: Subscription) => {
    if (subscription) {
      setEditingSubscription(subscription);
      reset({
        customerId: subscription.customer.id,
        planId: subscription.plan.id,
      });
    } else {
      setEditingSubscription(null);
      reset({
        customerId: 0,
        planId: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubscription(null);
    reset();
  };

  // Get status badge
  const getStatusBadge = (status: Subscription["status"]) => {
    const statusConfig = {
      ACTIVE: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Activa",
      },
      PAUSED: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Pause,
        label: "Pausada",
      },
      CANCELED: {
        color: "bg-red-100 text-red-800",
        icon: X,
        label: "Cancelada",
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

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Suscripciones</h1>
        <LoadingSkeleton lines={6} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Suscripciones</h1>
          <p className="mt-2 text-gray-600">
            Gestiona todas las suscripciones de tus clientes
          </p>
        </div>
        <LoadingButton
          isLoading={false}
          onClick={() => handleOpenModal()}
          className="inline-flex items-center mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Suscripción
        </LoadingButton>
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
            <option value="ACTIVE">Activas</option>
            <option value="PAUSED">Pausadas</option>
            <option value="CANCELED">Canceladas</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {filteredSubscriptions.length === 0 ? (
        <EmptyState
          title={
            searchTerm || statusFilter !== "ALL"
              ? "No se encontraron suscripciones"
              : "No hay suscripciones"
          }
          description={
            searchTerm || statusFilter !== "ALL"
              ? "Intenta ajustar los filtros"
              : "Comienza creando tu primera suscripción"
          }
          action={{
            label: "Crear Suscripción",
            onClick: () => handleOpenModal(),
          }}
        />
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Próxima Facturación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Inicio
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscriptions.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {subscription.customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {subscription.customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {subscription.plan.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ${subscription.plan.price} /{" "}
                            {subscription.plan.billingCycle === "MONTHLY"
                              ? "mes"
                              : "año"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(subscription.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(
                          subscription.nextBillingDate
                        ).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(subscription.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {subscription.status === "ACTIVE" && (
                          <>
                            <button
                              onClick={() => handleRenew(subscription.id)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Renovar"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(subscription.id, "PAUSED")
                              }
                              className="text-yellow-600 hover:text-yellow-900 p-1"
                              title="Pausar"
                            >
                              <Pause className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {subscription.status === "PAUSED" && (
                          <button
                            onClick={() =>
                              handleStatusChange(subscription.id, "ACTIVE")
                            }
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Activar"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {subscription.status !== "CANCELED" && (
                          <button
                            onClick={() =>
                              handleStatusChange(subscription.id, "CANCELED")
                            }
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenModal(subscription)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Create/Edit Subscription */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSubscription ? "Editar Suscripción" : "Nueva Suscripción"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="customerId"
              className="block text-sm font-medium text-gray-700"
            >
              Cliente
            </label>
            <select
              id="customerId"
              {...register("customerId", { valueAsNumber: true })}
              disabled={!!editingSubscription}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">Seleccionar cliente...</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.email}
                </option>
              ))}
            </select>
            {errors.customerId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customerId.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="planId"
              className="block text-sm font-medium text-gray-700"
            >
              Plan
            </label>
            <select
              id="planId"
              {...register("planId", { valueAsNumber: true })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar plan...</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - ${plan.price} /{" "}
                  {plan.billingCycle === "MONTHLY" ? "mes" : "año"}
                </option>
              ))}
            </select>
            {errors.planId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.planId.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <LoadingButton type="submit" isLoading={isSubmitting}>
              {editingSubscription ? "Actualizar" : "Crear"}
            </LoadingButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
