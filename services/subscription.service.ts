import api from '@/lib/api';
import { Subscription, SubscriptionSchema, UpdateSubscriptionSchema } from '@/lib/schemas';
import { z } from 'zod';

type SubscriptionFormInputs = z.infer<typeof SubscriptionSchema>;
type UpdateSubscriptionFormInputs = z.infer<typeof UpdateSubscriptionSchema>;

export const subscriptionService = {
  // Obtener todas las suscripciones del usuario autenticado
  getAll: async (): Promise<Subscription[]> => {
    try {
      const response = await api.get<Subscription[]>('/subscriptions');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Silencioso: endpoint no implementado, devolver datos vacíos
        return [];
      }
      throw error;
    }
  },

  // Obtener suscripciones por cliente (ADMIN o propietario)
  getByCustomer: async (customerId: number): Promise<Subscription[]> => {
    const response = await api.get<Subscription[]>(`/subscriptions/customer/${customerId}`);
    return response.data;
  },

  // Obtener una suscripción por ID
  getById: async (id: number): Promise<Subscription> => {
    const response = await api.get<Subscription>(`/subscriptions/${id}`);
    return response.data;
  },

  // Crear una nueva suscripción
  create: async (data: SubscriptionFormInputs): Promise<Subscription> => {
    const response = await api.post<Subscription>('/subscriptions', data);
    return response.data;
  },

  // Actualizar una suscripción (cambiar plan o estado)
  update: async (id: number, data: UpdateSubscriptionFormInputs): Promise<Subscription> => {
    const response = await api.put<Subscription>(`/subscriptions/${id}`, data);
    return response.data;
  },

  // Renovar suscripción (generar próxima factura)
  renew: async (id: number): Promise<void> => {
    await api.post(`/subscriptions/${id}/renew`);
  },

  // Eliminar una suscripción
  delete: async (id: number): Promise<void> => {
    await api.delete(`/subscriptions/${id}`);
  },
};