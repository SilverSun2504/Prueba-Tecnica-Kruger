import api from '@/lib/api';
import { Invoice } from '@/lib/schemas';

export const invoiceService = {
  // Obtener todas las facturas del usuario autenticado
  getAll: async (): Promise<Invoice[]> => {
    try {
      const response = await api.get<Invoice[]>('/invoices');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Silencioso: endpoint no implementado, devolver datos vacíos
        return [];
      }
      throw error;
    }
  },

  // Obtener una factura por ID
  getById: async (id: number): Promise<Invoice> => {
    const response = await api.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  // Pagar una factura (solo facturas OPEN)
  pay: async (id: number, method: 'CARD' | 'TRANSFER' | 'CASH'): Promise<void> => {
    await api.post(`/invoices/${id}/pay`, { method });
  },

  // Filtrar facturas por estado
  getByStatus: async (status: 'OPEN' | 'PAID' | 'VOID'): Promise<Invoice[]> => {
    const response = await api.get<Invoice[]>(`/invoices?status=${status}`);
    return response.data;
  },
};