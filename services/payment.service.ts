import api from '@/lib/api';
import { Payment } from '@/lib/schemas';

export const paymentService = {
  // Obtener todos los pagos del usuario autenticado
  getAll: async (): Promise<Payment[]> => {
    try {
      const response = await api.get<Payment[]>('/payments');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Silencioso: endpoint no implementado, devolver datos vacíos
        return [];
      }
      throw error;
    }
  },

  // Obtener un pago por ID
  getById: async (id: number): Promise<Payment> => {
    const response = await api.get<Payment>(`/payments/${id}`);
    return response.data;
  },

  // Filtrar pagos por estado
  getByStatus: async (status: 'SUCCESS' | 'FAILED'): Promise<Payment[]> => {
    const response = await api.get<Payment[]>(`/payments?status=${status}`);
    return response.data;
  },

  // Filtrar pagos por método
  getByMethod: async (method: 'CARD' | 'TRANSFER' | 'CASH'): Promise<Payment[]> => {
    const response = await api.get<Payment[]>(`/payments?method=${method}`);
    return response.data;
  },
};