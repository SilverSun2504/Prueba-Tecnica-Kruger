import api from '@/lib/api';
import { Payment } from '@/lib/schemas';

export const paymentService = {
  getAll: async (): Promise<Payment[]> => {
    try {
      const response = await api.get<Payment[]>('/payments');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  getById: async (id: number): Promise<Payment> => {
    const response = await api.get<Payment>(`/payments/${id}`);
    return response.data;
  },

  getByStatus: async (status: 'SUCCESS' | 'FAILED'): Promise<Payment[]> => {
    const response = await api.get<Payment[]>(`/payments?status=${status}`);
    return response.data;
  },

  getByMethod: async (method: 'CARD' | 'TRANSFER' | 'CASH'): Promise<Payment[]> => {
    const response = await api.get<Payment[]>(`/payments?method=${method}`);
    return response.data;
  },
};