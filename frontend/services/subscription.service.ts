import api from '@/lib/api';
import { Subscription, SubscriptionSchema, UpdateSubscriptionSchema } from '@/lib/schemas';
import { z } from 'zod';

type SubscriptionFormInputs = z.infer<typeof SubscriptionSchema>;
type UpdateSubscriptionFormInputs = z.infer<typeof UpdateSubscriptionSchema>;

export const subscriptionService = {
  getAll: async (): Promise<Subscription[]> => {
    try {
      const response = await api.get<Subscription[]>('/subscriptions');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  getByCustomer: async (customerId: number): Promise<Subscription[]> => {
    const response = await api.get<Subscription[]>(`/subscriptions/customer/${customerId}`);
    return response.data;
  },

  getById: async (id: number): Promise<Subscription> => {
    const response = await api.get<Subscription>(`/subscriptions/${id}`);
    return response.data;
  },

  create: async (data: SubscriptionFormInputs): Promise<Subscription> => {
    const response = await api.post<Subscription>('/subscriptions', data);
    return response.data;
  },

  update: async (id: number, data: UpdateSubscriptionFormInputs): Promise<Subscription> => {
    const response = await api.put<Subscription>(`/subscriptions/${id}`, data);
    return response.data;
  },

  renew: async (id: number): Promise<void> => {
    await api.post(`/subscriptions/${id}/renew`);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/subscriptions/${id}`);
  },
};