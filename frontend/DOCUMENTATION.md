# 📚 Documentación del Proyecto KdevBill Frontend

## 🎯 Descripción General

Frontend de un sistema SaaS de facturación y suscripciones para Kruger Corporation, desarrollado con Next.js 13+ y TypeScript.

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 13+ con App Router
- **Lenguaje:** TypeScript
- **Estilos:** TailwindCSS
- **Estado:** Zustand (gestión de autenticación)
- **Validación:** React Hook Form + Zod
- **HTTP Client:** Axios con interceptores JWT
- **UI:** Lucide React (iconos) + React Hot Toast (notificaciones)
- **Despliegue:** Puerto 3000 (dev)

## 🔑 Credenciales de Prueba

### Usuario Administrador

- **Usuario:** admin2
- **Contraseña:** admin123
- **Permisos:** Acceso completo a todas las funcionalidades

### Usuario Regular

- **Usuario:** user1
- **Contraseña:** user123
- **Permisos:** Acceso limitado (ver clientes, planes, suscripciones)

## 🏗️ Arquitectura del Proyecto

```
kdevbill-frontend/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx          # Página de login
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Layout del dashboard
│   │   ├── page.tsx              # Dashboard principal con KPIs
│   │   └── dashboard/
│   │       ├── customers/
│   │       │   └── page.tsx      # CRUD de clientes
│   │       ├── plans/
│   │       │   └── page.tsx      # CRUD de planes
│   │       ├── subscriptions/
│   │       │   └── page.tsx      # CRUD de suscripciones
│   │       ├── invoices/
│   │       │   └── page.tsx      # Gestión de facturas
│   │       └── payments/
│   │           └── page.tsx      # Gestión de pagos
│   ├── globals.css               # Estilos globales
│   └── layout.tsx                # Layout raíz
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Barra de navegación superior
│   │   └── Sidebar.tsx           # Menú lateral
│   └── ui/
│       ├── LoadingButton.tsx     # Componentes de carga y estados
│       └── Modal.tsx             # Componente modal reutilizable
├── services/
│   ├── auth.service.ts           # Autenticación (login, logout)
│   ├── customer.service.ts       # API de clientes
│   ├── plan.service.ts           # API de planes
│   ├── subscription.service.ts   # API de suscripciones
│   ├── invoice.service.ts        # API de facturas
│   └── payment.service.ts        # API de pagos
├── store/
│   └── auth.store.ts             # Estado global de autenticación
├── lib/
│   ├── api.ts                    # Configuración de Axios
│   └── schemas.ts                # Schemas de Zod y tipos TypeScript
└── middleware.ts                 # Protección de rutas
```

## 🔐 Sistema de Autenticación

### Flujo de Autenticación

1. Usuario ingresa credenciales en `/login`
2. Frontend envía `username` y `password` al backend
3. Backend devuelve JWT token y datos del usuario
4. Token se guarda en cookie `auth-token` para middleware
5. Token también se persiste en Zustand store
6. Todas las peticiones incluyen el token en header Authorization

### Interceptores de Axios

- **Request:** Añade automáticamente el token JWT a todas las peticiones
- **Response:** Detecta errores 401 y redirige al login automáticamente

### Middleware

- Protege rutas del dashboard (requiere autenticación)
- Redirige usuarios no autenticados al login
- Redirige usuarios autenticados desde login al dashboard

## 📊 Páginas Implementadas

### 1. Dashboard Principal (`/dashboard`)

**Funcionalidades:**

- 4 KPIs principales con iconos:
  - Total de clientes activos
  - Total de suscripciones activas
  - Total de ingresos mensuales
  - Total de facturas abiertas
- Gráfica de barras de ingresos mensuales (últimos 6 meses)
- Tabla de últimas facturas con estado
- Tabla de suscripciones que vencen pronto
- Actualización automática de datos

**Características:**

- Loading skeletons mientras carga
- Formato de moneda USD
- Colores según estado (verde, amarillo, rojo)
- Responsive design

### 2. Clientes (`/dashboard/customers`)

**Funcionalidades CRUD:**

- ✅ Crear nuevo cliente (botón "Nuevo Cliente")
- ✅ Editar cliente existente (botón editar en tabla)
- ✅ Eliminar cliente (con confirmación)
- ✅ Ver lista completa de clientes
- 🔍 Búsqueda en tiempo real por nombre o email

**Formulario incluye:**

- Nombre completo (requerido)
- Email (requerido, validación de formato)
- Teléfono (requerido)
- Dirección (opcional)
- Validación con Zod schema

**Características:**

- Modal para crear/editar
- Tabla responsive con información completa
- Loading states en botones de acción
- Notificaciones toast de éxito/error
- Auto-refresh después de acciones

### 3. Planes (`/dashboard/plans`)

**Funcionalidades CRUD:**

- ✅ Crear nuevo plan (solo ADMIN)
- ✅ Editar plan existente (solo ADMIN)
- ✅ Deshabilitar plan (soft delete, solo ADMIN)
- ✅ Ver lista de todos los planes
- 🔍 Búsqueda por nombre

**Formulario incluye:**

- Nombre del plan (requerido)
- Precio (requerido, mayor a 0)
- Ciclo de facturación (MONTHLY, QUARTERLY, ANNUAL)
- Estado activo/inactivo
- Validación con Zod schema

**Características:**

- Badge de estado (Activo/Inactivo)
- Formato de precio en USD
- Indicador de ciclo de facturación con icono
- Control de acceso por rol (solo admins pueden crear/editar/eliminar)
- Modal para crear/editar

### 4. Suscripciones (`/dashboard/subscriptions`)

**Funcionalidades:**

- ✅ Crear nueva suscripción (solo ADMIN)
- ✅ Editar plan de suscripción (solo ADMIN)
- ✅ Cambiar estado (Activa/Pausada/Cancelada, solo ADMIN)
- ✅ Renovar suscripción manualmente (genera factura)
- ✅ Ver lista completa de suscripciones
- 🔍 Búsqueda por cliente o plan
- 🔍 Filtro por estado (Todas/Activas/Pausadas/Canceladas)

**Información mostrada:**

- Cliente asociado (nombre y email)
- Plan asociado (nombre y precio)
- Fechas de inicio y próxima facturación
- Estado con badge de color
- Acciones rápidas (editar, pausar, cancelar, renovar)

**Características:**

- Selects dinámicos para clientes y planes
- Solo muestra planes activos al crear
- Confirmaciones para cambios de estado
- Botón de renovación manual
- Badges de estado con iconos

### 5. Facturas (`/dashboard/invoices`)

**Funcionalidades:**

- ✅ Ver lista completa de facturas
- ✅ Ver detalle de factura (modal)
- ✅ Registrar pago de factura
- ✅ Marcar factura como pagada
- 🔍 Búsqueda por cliente, plan o número
- 🔍 Filtro por estado (Todas/Abiertas/Pagadas/Anuladas)

**Información mostrada:**

- Número de factura
- Cliente
- Plan asociado
- Monto total
- Fecha de emisión y vencimiento
- Estado (Abierta/Pagada/Anulada) con badge
- Días hasta vencimiento/vencida

**Modal de detalle incluye:**

- Información completa de la factura
- Desglose de líneas de factura
- Total calculado
- Opción para registrar pago

**Modal de pago incluye:**

- Selección de método (Tarjeta/Transferencia/Efectivo)
- Confirmación de monto
- Referencia de transacción automática

**Características:**

- Badges de estado con colores
- Indicadores de vencimiento
- Confirmaciones para pagos
- Auto-actualización después de pagar

### 6. Pagos (`/dashboard/payments`)

**Funcionalidades:**

- ✅ Ver lista completa de pagos
- ✅ Ver detalle de pago (modal)
- 🔍 Búsqueda por cliente o referencia
- 🔍 Filtro por estado (Todos/Exitosos/Fallidos)
- 🔍 Filtro por método (Todos/Tarjeta/Transferencia/Efectivo)

**Información mostrada:**

- ID de pago
- Cliente
- Monto pagado
- Método de pago con icono
- Referencia de transacción
- Fecha de pago
- Estado (Exitoso/Fallido) con badge

**Modal de detalle incluye:**

- Información completa del pago
- Factura asociada
- Cliente y plan relacionado
- Método de pago
- Referencia de transacción
- Fecha y hora exacta

**Características:**

- Badges de estado con colores
- Iconos según método de pago
- Formato de fechas y montos
- Tabla responsive

## 🎨 Componentes Reutilizables

### Modal

**Ubicación:** `components/ui/Modal.tsx`
**Props:**

- `isOpen`: Control de visibilidad
- `onClose`: Función para cerrar
- `title`: Título del modal
- `children`: Contenido del modal
- `size`: Tamaño (sm, md, lg, xl)

**Características:**

- Backdrop con blur
- Animaciones de entrada/salida
- Botón de cerrar
- Click fuera para cerrar
- Responsive

### LoadingButton

**Ubicación:** `components/ui/LoadingButton.tsx`
**Componentes incluidos:**

- `LoadingButton`: Botón con estado de carga
- `LoadingSkeleton`: Skeleton para tablas
- `EmptyState`: Mensaje cuando no hay datos

### Navbar

**Ubicación:** `components/layout/Navbar.tsx`
**Características:**

- Muestra nombre de usuario
- Rol del usuario (Admin/Usuario)
- Botón de logout
- Sticky top

### Sidebar

**Ubicación:** `components/layout/Sidebar.tsx`
**Características:**

- Navegación con iconos
- Active state en ruta actual
- Logo de la aplicación
- Enlaces a todas las páginas
- Control de acceso (adminOnly flags)

## 📡 Servicios API

### Configuración Base

**Archivo:** `lib/api.ts`

- Base URL: `http://localhost:8080/kdevbill`
- Timeout: 10 segundos
- Headers automáticos de JSON

### Interceptores

```typescript
// Request: Añade token automáticamente
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: Maneja 401 automáticamente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

### Estructura de Servicios

Todos los servicios siguen el mismo patrón CRUD:

```typescript
export const serviceNameService = {
  getAll: async () => Promise<Entity[]>,
  getById: async (id: number) => Promise<Entity>,
  create: async (data: CreateDto) => Promise<Entity>,
  update: async (id: number, data: UpdateDto) => Promise<Entity>,
  delete: async (id: number) => Promise<void>,
};
```

### Manejo de Errores

- Errores 404: Retornan array vacío silenciosamente
- Otros errores: Se propagan para manejo en componente
- Mensajes de error desde backend se muestran en toasts

## 📋 Schemas y Tipos

### Tipos Principales

**Archivo:** `lib/schemas.ts`

```typescript
// Usuario
interface User {
  id: number;
  username: string;
  email: string;
  role: "ADMIN" | "USER";
}

// Cliente
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

// Plan
interface Plan {
  id: number;
  name: string;
  price: number;
  billingCycle: "MONTHLY" | "QUARTERLY" | "ANNUAL";
  active: boolean;
}

// Suscripción
interface Subscription {
  id: number;
  customer: Customer;
  plan: Plan;
  startDate: string;
  nextBillingDate: string;
  status: "ACTIVE" | "PAUSED" | "CANCELED";
}

// Factura
interface Invoice {
  id: number;
  invoiceNumber: string;
  customer: Customer;
  subscription: Subscription;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  status: "OPEN" | "PAID" | "VOID";
  lineItems: InvoiceLineItem[];
}

// Pago
interface Payment {
  id: number;
  invoice: Invoice;
  amount: number;
  paymentMethod: "CARD" | "TRANSFER" | "CASH";
  transactionReference: string;
  paymentDate: string;
  status: "SUCCESS" | "FAILED";
}
```

### Schemas de Validación (Zod)

Cada entidad tiene un schema de Zod para validación de formularios:

- `LoginSchema`: Validación de login
- `CustomerSchema`: Validación de clientes
- `PlanSchema`: Validación de planes
- `SubscriptionSchema`: Validación de suscripciones

## 🚀 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor en http://localhost:3000

# Producción
npm run build        # Crea build de producción
npm start           # Inicia servidor de producción

# Utilidades
npm run lint         # Ejecuta ESLint
```

## 🔄 Flujos de Usuario

### Flujo de Login

1. Usuario accede a `/login`
2. Ingresa credenciales (o usa auto-fill de demos)
3. Click en "Iniciar Sesión"
4. Si es exitoso: Redirige a `/dashboard`
5. Si falla: Muestra error en toast

### Flujo de Crear Cliente

1. Usuario admin accede a `/dashboard/customers`
2. Click en "Nuevo Cliente"
3. Se abre modal con formulario
4. Completa campos requeridos
5. Click en "Guardar"
6. Si es exitoso: Cierra modal, actualiza tabla, muestra toast
7. Si falla: Muestra error en toast

### Flujo de Crear Suscripción

1. Usuario admin accede a `/dashboard/subscriptions`
2. Click en "Nueva Suscripción"
3. Se abre modal con formulario
4. Selecciona cliente de lista
5. Selecciona plan de lista (solo activos)
6. Click en "Guardar"
7. Si es exitoso: Cierra modal, actualiza tabla, muestra toast

### Flujo de Pagar Factura

1. Usuario accede a `/dashboard/invoices`
2. Busca factura abierta
3. Click en botón de pago (icono tarjeta)
4. Se abre modal de pago
5. Selecciona método de pago
6. Confirma pago
7. Si es exitoso: Actualiza tabla, muestra toast

## 🎨 Diseño y UX

### Paleta de Colores

- **Primario:** Azul (#3B82F6)
- **Éxito:** Verde (#10B981)
- **Advertencia:** Amarillo (#F59E0B)
- **Error:** Rojo (#EF4444)
- **Neutro:** Grises (#6B7280, #9CA3AF)

### Estados Visuales

- **Loading:** Skeletons animados
- **Empty:** Mensaje con icono y call-to-action
- **Error:** Toast rojo con mensaje
- **Success:** Toast verde con mensaje
- **Active:** Badge verde
- **Inactive/Paused:** Badge amarillo
- **Canceled/Failed:** Badge rojo

### Responsividad

- **Mobile:** < 640px - Navegación colapsada, tablas scrollables
- **Tablet:** 640px - 1024px - Layout adaptado
- **Desktop:** > 1024px - Layout completo con sidebar

## 🔒 Seguridad

### Implementado

- ✅ JWT tokens en cookies HttpOnly (sugerido para producción)
- ✅ Interceptores para manejo de 401
- ✅ Middleware de protección de rutas
- ✅ Validación de formularios en cliente
- ✅ Control de acceso por roles (admin/user)
- ✅ Sanitización de inputs con Zod

### Recomendaciones para Producción

- [ ] HTTPS obligatorio
- [ ] CSRF tokens
- [ ] Rate limiting
- [ ] Refresh tokens
- [ ] 2FA opcional
- [ ] Logs de auditoría

## 🐛 Debugging

### Errores Comunes

#### 1. Error de conexión al backend

**Síntoma:** "Network Error" o "ERR_CONNECTION_REFUSED"
**Solución:**

- Verificar que el backend esté corriendo en `http://localhost:8080`
- Verificar que la ruta sea `/kdevbill` (no `/kdevbil`)
- Revisar CORS en el backend

#### 2. Token inválido

**Síntoma:** Redirige automáticamente al login
**Solución:**

- Token puede haber expirado
- Volver a hacer login
- Verificar configuración de cookies

#### 3. Página se queda en loading

**Síntoma:** Skeletons se quedan cargando infinitamente
**Solución:**

- Verificar que el endpoint exista en backend
- Revisar console para errores 404
- Los errores 404 deberían manejarse silenciosamente (retornar array vacío)

#### 4. Botón no responde

**Síntoma:** Click en botón no hace nada
**Solución:**

- Verificar que no haya errores de validación en formulario
- Revisar console para errores de JavaScript
- Verificar que el usuario tenga permisos (rol ADMIN)

### Logs Útiles

```typescript
// Ver estado de autenticación
console.log(useAuthStore.getState());

// Ver token actual
console.log(useAuthStore.getState().token);

// Ver usuario actual
console.log(useAuthStore.getState().user);
```

## 📦 Dependencias Principales

```json
{
  "next": "^14.x",
  "react": "^18.x",
  "typescript": "^5.x",
  "tailwindcss": "^3.x",
  "zustand": "^4.x",
  "axios": "^1.x",
  "react-hook-form": "^7.x",
  "zod": "^3.x",
  "@hookform/resolvers": "^3.x",
  "react-hot-toast": "^2.x",
  "lucide-react": "latest",
  "js-cookie": "^3.x"
}
```

## 🎓 Notas para Desarrolladores Junior

### Conceptos Clave Implementados

1. **App Router de Next.js 13+**

   - Carpetas con paréntesis `(auth)` para agrupar rutas sin afectar URL
   - `page.tsx` define la ruta
   - `layout.tsx` define el layout compartido
   - Server components por defecto, `"use client"` para interactividad

2. **TypeScript**

   - Interfaces para definir tipos
   - Type safety en todo el código
   - Props tipadas en componentes
   - Inferencia de tipos con Zod

3. **Estado Global con Zustand**

   - Store simple y ligero
   - Persistencia automática
   - Selectores para optimización

4. **Validación con Zod + React Hook Form**

   - Schemas reutilizables
   - Validación en tiempo real
   - Mensajes de error customizables
   - Type safety automático

5. **Axios con Interceptores**

   - Request interceptor: Añade token
   - Response interceptor: Maneja errores globales
   - Instance configurada con base URL

6. **Patrones de Diseño**
   - Componentes reutilizables (Modal, LoadingButton)
   - Servicios separados por entidad
   - Separación de concerns (UI, lógica, API)
   - Custom hooks potenciales

### Buenas Prácticas Aplicadas

✅ **Código limpio y organizado**

- Nombres descriptivos de variables y funciones
- Comentarios donde es necesario
- Estructura de carpetas clara

✅ **Manejo de errores**

- Try-catch en todas las llamadas API
- Mensajes de error al usuario
- Fallbacks para estados de error

✅ **UX**

- Loading states en todas las acciones
- Confirmaciones para acciones destructivas
- Feedback inmediato con toasts
- Diseño responsive

✅ **Performance**

- Solo re-render cuando es necesario
- Lazy loading implícito con App Router
- Optimización de imágenes con next/image

### Próximos Pasos Sugeridos

1. **Testing**

   - Agregar Jest para unit tests
   - Cypress para E2E tests
   - Testing Library para componentes

2. **Optimizaciones**

   - React Query para cache de datos
   - Debounce en búsquedas
   - Paginación en tablas grandes
   - Virtual scrolling para listas largas

3. **Características Adicionales**

   - Exportar datos a Excel/PDF
   - Gráficas más avanzadas (Chart.js)
   - Notificaciones en tiempo real (WebSockets)
   - Temas claro/oscuro
   - Internacionalización (i18n)

4. **DevOps**
   - CI/CD con GitHub Actions
   - Docker para deployment
   - Monitoreo con Sentry
   - Analytics con Google Analytics

## 📞 Soporte

Para dudas o problemas:

1. Revisar esta documentación
2. Verificar errores en consola del navegador
3. Verificar que el backend esté corriendo
4. Revisar logs del servidor Next.js

## 📄 Licencia

Proyecto de prueba técnica para Kruger Corporation.

---

**Última actualización:** 2024
**Versión:** 1.0.0
**Autor:** Desarrollado siguiendo best practices de Next.js y React
