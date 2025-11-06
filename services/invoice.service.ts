import api from '@/lib/api';
import { Invoice } from '@/lib/schemas';

export const invoiceService = {
  getAll: async (): Promise<Invoice[]> => {
    try {
      const response = await api.get<Invoice[]>('/invoices');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  getById: async (id: number): Promise<Invoice> => {
    const response = await api.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  pay: async (id: number, method: 'CARD' | 'TRANSFER' | 'CASH'): Promise<void> => {
    await api.post(`/invoices/${id}/pay`, { method });
  },

  getByStatus: async (status: 'OPEN' | 'PAID' | 'VOID'): Promise<Invoice[]> => {
    const response = await api.get<Invoice[]>(`/invoices?status=${status}`);
    return response.data;
  },
};