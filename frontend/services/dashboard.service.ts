import api from '@/lib/api';

export interface DashboardStats {
  totalCustomers: number;
  totalActiveSubscriptions: number;
  totalRevenue: number;
  monthlyRevenue: number;
  openInvoices: number;
  paidInvoices: number;
  successfulPayments: number;
  failedPayments: number;
}

export const dashboardService = {
  // Obtener estadísticas del dashboard
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },

  // Obtener datos para gráficos (opcional)
  getChartData: async (period: 'week' | 'month' | 'year' = 'month') => {
    const response = await api.get(`/dashboard/charts?period=${period}`);
    return response.data;
  },
};