import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().min(1, { message: 'Username/Email requerido' }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

export const RegisterSchema = z.object({
  username: z.string().min(3, { message: 'El username debe tener al menos 3 caracteres' }),
  email: z.string().email({ message: 'Email no válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

export const CustomerSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Email no válido' }),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const PlanSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  price: z.number().min(0, { message: 'El precio debe ser mayor a 0' }),
  billingCycle: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY'], { message: 'Selecciona un ciclo de facturación válido' }),
  active: z.boolean().optional(),
});

export const SubscriptionSchema = z.object({
  customerId: z.number().min(1, { message: 'Selecciona un cliente' }),
  planId: z.number().min(1, { message: 'Selecciona un plan' }),
});

export const UpdateSubscriptionSchema = z.object({
  planId: z.number().min(1, { message: 'Selecciona un plan' }).optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'CANCELED'], { message: 'Selecciona un estado válido' }).optional(),
});

export const PaymentSchema = z.object({
  method: z.enum(['CARD', 'TRANSFER', 'CASH'], { message: 'Selecciona un método de pago válido' }),
});

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  owner?: User | null;
  createdAt: string;
}

export interface Plan {
  id: number;
  name: string;
  price: number;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  active: boolean;
}

export interface Subscription {
  id: number;
  customer: Customer;
  plan: Plan;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELED';
  startDate: string;
  nextBillingDate: string;
  createdAt: string;
}

export interface InvoiceRaw {
  id: number;
  subscriptionId: number;
  amount: number;
  status: 'OPEN' | 'PAID' | 'VOID';
  dueDate: string;
  issuedAt: string;
}

export interface Invoice {
  id: number;
  subscription: Subscription;
  amount: number;
  status: 'OPEN' | 'PAID' | 'VOID';
  dueDate: string;
  issuedAt: string;
}

export interface PaymentRaw {
  id: number;
  invoiceId: number;
  amount: number;
  method: 'CARD' | 'TRANSFER' | 'CASH';
  status: 'SUCCESS' | 'FAILED';
  paidAt: string;
  reference: string;
}

export interface Payment {
  id: number;
  invoice: Invoice;
  amount: number;
  method: 'CARD' | 'TRANSFER' | 'CASH';
  status: 'SUCCESS' | 'FAILED';
  paidAt: string;
  reference: string;
}