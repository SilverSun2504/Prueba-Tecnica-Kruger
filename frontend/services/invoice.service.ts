import api from '@/lib/api';
import { Invoice, InvoiceRaw, Subscription } from '@/lib/schemas';
import { subscriptionService } from './subscription.service';

export const invoiceService = {
  getAll: async (): Promise<Invoice[]> => {
    try {
      const response = await api.get<InvoiceRaw[]>('/invoices');
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      let allSubscriptions: Subscription[] = [];
      try {
        allSubscriptions = await subscriptionService.getAll();
      } catch (error) {
        console.warn('Could not fetch all subscriptions, will try individual calls:', error);
      }
      
      const subscriptionMap = new Map<number, Subscription>();
      allSubscriptions.forEach(sub => {
        subscriptionMap.set(sub.id, sub);
      });
      
      const invoicesWithSubscriptions: Invoice[] = await Promise.all(
        response.data.map(async (rawInvoice) => {
          let subscription: Subscription;
          
          if (subscriptionMap.has(rawInvoice.subscriptionId)) {
            subscription = subscriptionMap.get(rawInvoice.subscriptionId)!;
          } else {
            try {
              subscription = await subscriptionService.getById(rawInvoice.subscriptionId);
            } catch (error) {
              console.error(`Error fetching subscription ${rawInvoice.subscriptionId}:`, error);
              subscription = {
                id: rawInvoice.subscriptionId,
                customer: { 
                  id: 0, 
                  name: `Cliente (ID: ${rawInvoice.subscriptionId})`, 
                  email: 'No disponible', 
                  createdAt: '' 
                },
                plan: { 
                  id: 0, 
                  name: `Plan de $${rawInvoice.amount}`, 
                  price: rawInvoice.amount, 
                  billingCycle: 'MONTHLY', 
                  active: true 
                },
                status: 'ACTIVE',
                startDate: '',
                nextBillingDate: '',
                createdAt: '',
              } as Subscription;
            }
          }
          
          return {
            id: rawInvoice.id,
            subscription,
            amount: rawInvoice.amount,
            status: rawInvoice.status,
            dueDate: rawInvoice.dueDate,
            issuedAt: rawInvoice.issuedAt,
          } as Invoice;
        })
      );
      
      return invoicesWithSubscriptions;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  getById: async (id: number): Promise<Invoice> => {
    const response = await api.get<InvoiceRaw>(`/invoices/${id}`);
    const rawInvoice = response.data;
    
    try {
      const subscription = await subscriptionService.getById(rawInvoice.subscriptionId);
      return {
        id: rawInvoice.id,
        subscription,
        amount: rawInvoice.amount,
        status: rawInvoice.status,
        dueDate: rawInvoice.dueDate,
        issuedAt: rawInvoice.issuedAt,
      } as Invoice;
    } catch (error) {
      console.error(`Error fetching subscription ${rawInvoice.subscriptionId}:`, error);
      return {
        id: rawInvoice.id,
        subscription: {
          id: rawInvoice.subscriptionId,
          customer: { id: 0, name: 'Cliente no encontrado', email: '', createdAt: '' },
          plan: { id: 0, name: 'Plan no encontrado', price: 0, billingCycle: 'MONTHLY', active: true },
          status: 'ACTIVE',
          startDate: '',
          nextBillingDate: '',
          createdAt: '',
        },
        amount: rawInvoice.amount,
        status: rawInvoice.status,
        dueDate: rawInvoice.dueDate,
        issuedAt: rawInvoice.issuedAt,
      } as Invoice;
    }
  },

  pay: async (id: number, method: 'CARD' | 'TRANSFER' | 'CASH'): Promise<void> => {
    try {
      console.log(`Processing payment for invoice ${id} with method ${method}`);
      
      const response = await api.post(`/invoices/${id}/pay`, { method });
      console.log('Payment successful:', response);
      
    } catch (error: any) {
      console.error('Payment failed:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 500) {
        throw new Error('Error interno del servidor. Por favor, contacta al administrador.');
      } else if (error.response?.status === 404) {
        throw new Error('Factura no encontrada.');
      } else if (error.response?.status === 400) {
        throw new Error('Datos de pago inválidos.');
      } else {
        throw new Error('Error al procesar el pago. Intenta nuevamente.');
      }
    }
  },

  getByStatus: async (status: 'OPEN' | 'PAID' | 'VOID'): Promise<Invoice[]> => {
    const response = await api.get<InvoiceRaw[]>(`/invoices?status=${status}`);
    
    if (!response.data || response.data.length === 0) {
      return [];
    }
    
    const invoicesWithSubscriptions: Invoice[] = await Promise.all(
      response.data.map(async (rawInvoice) => {
        try {
          const subscription = await subscriptionService.getById(rawInvoice.subscriptionId);
          return {
            id: rawInvoice.id,
            subscription,
            amount: rawInvoice.amount,
            status: rawInvoice.status,
            dueDate: rawInvoice.dueDate,
            issuedAt: rawInvoice.issuedAt,
          } as Invoice;
        } catch (error) {
          console.error(`Error fetching subscription ${rawInvoice.subscriptionId}:`, error);
          return {
            id: rawInvoice.id,
            subscription: {
              id: rawInvoice.subscriptionId,
              customer: { id: 0, name: 'Cliente no encontrado', email: '', createdAt: '' },
              plan: { id: 0, name: 'Plan no encontrado', price: 0, billingCycle: 'MONTHLY', active: true },
              status: 'ACTIVE',
              startDate: '',
              nextBillingDate: '',
              createdAt: '',
            },
            amount: rawInvoice.amount,
            status: rawInvoice.status,
            dueDate: rawInvoice.dueDate,
            issuedAt: rawInvoice.issuedAt,
          } as Invoice;
        }
      })
    );
    
    return invoicesWithSubscriptions;
  },
};