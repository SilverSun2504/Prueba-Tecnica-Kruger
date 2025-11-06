import api from '@/lib/api';
import { Customer, CustomerSchema } from '@/lib/schemas';
import { z } from 'zod';

type CustomerFormInputs = z.infer<typeof CustomerSchema>;

export const customerService = {
  // Obtener todos los clientes (solo ADMIN)
  getAll: async (): Promise<Customer[]> => {
    try {
      const response = await api.get<Customer[]>('/customers');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Silencioso: endpoint no implementado, devolver datos vacíos
        return [];
      }
      throw error;
    }
  },

  // Obtener un cliente por ID
  getById: async (id: number): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  // Crear un nuevo cliente (solo ADMIN)
  create: async (data: CustomerFormInputs): Promise<Customer> => {
    const response = await api.post<Customer>('/customers', data);
    return response.data;
  },

  // Actualizar un cliente
  update: async (id: number, data: Partial<CustomerFormInputs>): Promise<Customer> => {
    const response = await api.put<Customer>(`/customers/${id}`, data);
    return response.data;
  },

  // Eliminar un cliente
  delete: async (id: number): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },
};