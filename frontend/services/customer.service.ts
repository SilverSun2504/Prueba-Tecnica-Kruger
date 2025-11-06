import api from '@/lib/api';
import { Customer, CustomerSchema } from '@/lib/schemas';
import { z } from 'zod';

type CustomerFormInputs = z.infer<typeof CustomerSchema>;

export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    try {
      const response = await api.get<Customer[]>('/customers');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  getById: async (id: number): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  create: async (data: CustomerFormInputs): Promise<Customer> => {
    const response = await api.post<Customer>('/customers', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CustomerFormInputs>): Promise<Customer> => {
    const response = await api.put<Customer>(`/customers/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },
};