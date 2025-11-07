"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Package,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { planService } from "@/services/plan.service";
import { Plan, PlanSchema } from "@/lib/schemas";
import {
  LoadingButton,
  LoadingSkeleton,
  EmptyState,
} from "@/components/ui/LoadingButton";
import { Modal } from "@/components/ui/Modal";
import { z } from "zod";

type PlanFormInputs = z.infer<typeof PlanSchema>;

export default function PlansPage() {
  const isAdmin = useAuthStore((state) => state.isAdmin());
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PlanFormInputs>({
    resolver: zodResolver(PlanSchema),
    defaultValues: {
      active: true,
    },
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await planService.getAll();
      setPlans(data);
    } catch (error) {
      toast.error("Error al cargar planes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const filteredPlans = plans.filter((plan) =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data: PlanFormInputs) => {
    try {
      if (editingPlan) {
        await planService.update(editingPlan.id, data);
        toast.success("Plan actualizado exitosamente");
      } else {
        await planService.create(data);
        toast.success("Plan creado exitosamente");
      }

      await fetchPlans();
      handleCloseModal();
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al guardar plan";
      toast.error(message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres deshabilitar este plan?"))
      return;

    try {
      await planService.delete(id);
      toast.success("Plan deshabilitado exitosamente");
      await fetchPlans();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al deshabilitar plan";
      toast.error(message);
    }
  };

  const handleOpenModal = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      reset({
        name: plan.name,
        price: plan.price,
        billingCycle: plan.billingCycle,
        active: plan.active,
      });
    } else {
      setEditingPlan(null);
      reset({
        name: "",
        price: 0,
        billingCycle: "MONTHLY",
        active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
    reset();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getBillingCycleText = (cycle: "MONTHLY" | "QUARTERLY" | "YEARLY") => {
    switch (cycle) {
      case "MONTHLY":
        return "Mensual";
      case "QUARTERLY":
        return "Trimestral";
      case "YEARLY":
        return "Anual";
      default:
        return cycle;
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Planes</h1>
        <LoadingSkeleton lines={6} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planes</h1>
          <p className="mt-2 text-gray-600">
            {isAdmin
              ? "Gestiona los planes de suscripción disponibles"
              : "Explora los planes disponibles"}
          </p>
        </div>
        {isAdmin && (
          <LoadingButton
            isLoading={false}
            onClick={() => handleOpenModal()}
            className="inline-flex items-center mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Plan
          </LoadingButton>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar planes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Content */}
      {filteredPlans.length === 0 ? (
        <EmptyState
          title={searchTerm ? "No se encontraron planes" : "No hay planes"}
          description={
            searchTerm
              ? "Intenta con otro término de búsqueda"
              : "Comienza creando tu primer plan"
          }
          action={
            isAdmin
              ? {
                  label: "Crear Plan",
                  onClick: () => handleOpenModal(),
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 ${
                !plan.active ? "opacity-60" : ""
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {plan.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {plan.active ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      / {getBillingCycleText(plan.billingCycle).toLowerCase()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Facturación {getBillingCycleText(plan.billingCycle)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {plan.active ? "Disponible" : "No disponible"}
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(plan)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create/Edit Plan */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPlan ? "Editar Plan" : "Nuevo Plan"}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre del Plan
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              placeholder="ej. Plan Básico"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Precio
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
                className="block w-full pl-7 pr-12 border border-gray-300 rounded-md shadow-sm py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">USD</span>
              </div>
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="billingCycle"
              className="block text-sm font-medium text-gray-700"
            >
              Ciclo de Facturación
            </label>
            <select
              id="billingCycle"
              {...register("billingCycle")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="MONTHLY">Mensual</option>
              <option value="QUARTERLY">Trimestral</option>
              <option value="YEARLY">Anual</option>
            </select>
            {errors.billingCycle && (
              <p className="mt-1 text-sm text-red-600">
                {errors.billingCycle.message}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="active"
              type="checkbox"
              {...register("active")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="active"
              className="ml-2 block text-sm text-gray-900"
            >
              Plan activo (disponible para nuevas suscripciones)
            </label>
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
              {editingPlan ? "Actualizar" : "Crear"}
            </LoadingButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
