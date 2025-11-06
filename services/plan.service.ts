import api from '@/lib/api';
import { Plan, PlanSchema } from '@/lib/schemas';
import { z } from 'zod';

type PlanFormInputs = z.infer<typeof PlanSchema>;

export const planService = {
  getAll: async (): Promise<Plan[]> => {
    try {
      const response = await api.get<Plan[]>('/plans');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  getById: async (id: number): Promise<Plan> => {
    const response = await api.get<Plan>(`/plans/${id}`);
    return response.data;
  },

  create: async (data: PlanFormInputs): Promise<Plan> => {
    const response = await api.post<Plan>('/plans', data);
    return response.data;
  },

  update: async (id: number, data: Partial<PlanFormInputs>): Promise<Plan> => {
    const response = await api.put<Plan>(`/plans/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/plans/${id}`);
  },
};