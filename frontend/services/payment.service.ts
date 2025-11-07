import api from '@/lib/api';
import { Payment, PaymentRaw, Invoice, Subscription } from '@/lib/schemas';
import { invoiceService } from './invoice.service';

export const paymentService = {
  getAll: async (): Promise<Payment[]> => {
    try {
      const response = await api.get<PaymentRaw[]>('/payments');
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      const paymentsWithInvoices: Payment[] = response.data.map((rawPayment) => {
        return {
          id: rawPayment.id,
          invoice: {
            id: rawPayment.invoiceId,
            subscription: {
              id: rawPayment.invoiceId, // Usamos invoiceId como fallback
              customer: { 
                id: 0, 
                name: `Cliente de Pago #${rawPayment.id}`, 
                email: 'cliente@ejemplo.com', 
                createdAt: rawPayment.paidAt 
              },
              plan: { 
                id: 0, 
                name: `Plan ($${rawPayment.amount})`, 
                price: rawPayment.amount, 
                billingCycle: 'MONTHLY', 
                active: true 
              },
              status: 'ACTIVE',
              startDate: rawPayment.paidAt,
              nextBillingDate: '',
              createdAt: rawPayment.paidAt,
            },
            amount: rawPayment.amount,
            status: 'PAID',
            dueDate: rawPayment.paidAt,
            issuedAt: rawPayment.paidAt,
          },
          amount: rawPayment.amount,
          method: rawPayment.method,
          status: rawPayment.status,
          paidAt: rawPayment.paidAt,
          reference: rawPayment.reference,
        } as Payment;
      });
      
      return paymentsWithInvoices;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  getById: async (id: number): Promise<Payment> => {
    const response = await api.get<PaymentRaw>(`/payments/${id}`);
    const rawPayment = response.data;
    return {
      id: rawPayment.id,
      invoice: {
        id: rawPayment.invoiceId,
        subscription: {
          id: rawPayment.invoiceId,
          customer: { 
            id: 0, 
            name: `Cliente de Pago #${rawPayment.id}`, 
            email: 'cliente@ejemplo.com', 
            createdAt: rawPayment.paidAt 
          },
          plan: { 
            id: 0, 
            name: `Plan ($${rawPayment.amount})`, 
            price: rawPayment.amount, 
            billingCycle: 'MONTHLY', 
            active: true 
          },
          status: 'ACTIVE',
          startDate: rawPayment.paidAt,
          nextBillingDate: '',
          createdAt: rawPayment.paidAt,
        },
        amount: rawPayment.amount,
        status: 'PAID',
        dueDate: rawPayment.paidAt,
        issuedAt: rawPayment.paidAt,
      },
      amount: rawPayment.amount,
      method: rawPayment.method,
      status: rawPayment.status,
      paidAt: rawPayment.paidAt,
      reference: rawPayment.reference,
    } as Payment;
  },

  getByStatus: async (status: 'SUCCESS' | 'FAILED'): Promise<Payment[]> => {
    const response = await api.get<PaymentRaw[]>(`/payments?status=${status}`);
    
    if (!response.data || response.data.length === 0) {
      return [];
    }
    
    return response.data.map((rawPayment) => ({
      id: rawPayment.id,
      invoice: {
        id: rawPayment.invoiceId,
        subscription: {
          id: rawPayment.invoiceId,
          customer: { 
            id: 0, 
            name: `Cliente de Pago #${rawPayment.id}`, 
            email: 'cliente@ejemplo.com', 
            createdAt: rawPayment.paidAt 
          },
          plan: { 
            id: 0, 
            name: `Plan ($${rawPayment.amount})`, 
            price: rawPayment.amount, 
            billingCycle: 'MONTHLY', 
            active: true 
          },
          status: 'ACTIVE',
          startDate: rawPayment.paidAt,
          nextBillingDate: '',
          createdAt: rawPayment.paidAt,
        },
        amount: rawPayment.amount,
        status: 'PAID',
        dueDate: rawPayment.paidAt,
        issuedAt: rawPayment.paidAt,
      },
      amount: rawPayment.amount,
      method: rawPayment.method,
      status: rawPayment.status,
      paidAt: rawPayment.paidAt,
      reference: rawPayment.reference,
    } as Payment));
  },

  getByMethod: async (method: 'CARD' | 'TRANSFER' | 'CASH'): Promise<Payment[]> => {
    const response = await api.get<PaymentRaw[]>(`/payments?method=${method}`);
    
    if (!response.data || response.data.length === 0) {
      return [];
    }
    
    return response.data.map((rawPayment) => ({
      id: rawPayment.id,
      invoice: {
        id: rawPayment.invoiceId,
        subscription: {
          id: rawPayment.invoiceId,
          customer: { 
            id: 0, 
            name: `Cliente de Pago #${rawPayment.id}`, 
            email: 'cliente@ejemplo.com', 
            createdAt: rawPayment.paidAt 
          },
          plan: { 
            id: 0, 
            name: `Plan ($${rawPayment.amount})`, 
            price: rawPayment.amount, 
            billingCycle: 'MONTHLY', 
            active: true 
          },
          status: 'ACTIVE',
          startDate: rawPayment.paidAt,
          nextBillingDate: '',
          createdAt: rawPayment.paidAt,
        },
        amount: rawPayment.amount,
        status: 'PAID',
        dueDate: rawPayment.paidAt,
        issuedAt: rawPayment.paidAt,
      },
      amount: rawPayment.amount,
      method: rawPayment.method,
      status: rawPayment.status,
      paidAt: rawPayment.paidAt,
      reference: rawPayment.reference,
    } as Payment));
  },
};