# 🏢 KdevBill Frontend - Sistema de Facturación SaaS

Sistema de gestión de suscripciones y facturación para Kruger Corporation, desarrollado con **Next.js 13+**, **React 18**, **TypeScript**, y **TailwindCSS**.

## 🚀 Características Principales

- ✅ **Autenticación JWT** con persistencia de sesión y middleware de protección
- ✅ **Dashboard interactivo** con KPIs en tiempo real y gráficas
- ✅ **Gestión completa de clientes** (CRUD con modales y validación)
- ✅ **Catálogo de planes** con diferentes ciclos de facturación (mensual, trimestral, anual)
- ✅ **Administración de suscripciones** con cambios de estado y renovación manual
- ✅ **Sistema de facturas** con visualización de detalles y procesamiento de pagos
- ✅ **Historial de pagos** con filtros por estado y método de pago
- ✅ **Control de acceso por roles** (ADMIN/USER) con permisos granulares
- ✅ **Interfaz responsive** optimizada para mobile, tablet y desktop
- ✅ **Validación de formularios** con React Hook Form + Zod schemas
- ✅ **Notificaciones toast** para feedback inmediato del usuario
- ✅ **Estados de carga** (skeletons) y manejo robusto de errores

## 🛠️ Stack Tecnológico

| Categoría      | Tecnología               |
| -------------- | ------------------------ |
| Framework      | Next.js 13+ (App Router) |
| UI Library     | React 18                 |
| Lenguaje       | TypeScript               |
| Estilos        | TailwindCSS              |
| Estado Global  | Zustand                  |
| Formularios    | React Hook Form          |
| Validación     | Zod                      |
| HTTP Client    | Axios                    |
| Notificaciones | React Hot Toast          |
| Iconos         | Lucide React             |

## 🚦 Inicio Rápido

### 1. Prerequisitos

- **Node.js 18+** y npm/yarn/pnpm
- **Backend API** ejecutándose en `http://localhost:8080/kdevbill`

### 2. Instalar dependencias

```bash
npm install
```

### 3. Variables de entorno (Opcional)

El proyecto usa la URL del backend configurada directamente en `lib/api.ts`:

```typescript

```

Si necesitas cambiar la URL del backend, modifica el archivo `lib/api.ts`:

```typescript
baseURL: "http://localhost:8080/kdevbill"; // Cambia esta URL según tu configuración
```

### 4. Ejecutar la aplicación

```bash
# Modo desarrollo (con hot reload)
npm run dev

# Build de producción
npm run build
npm start

# Linting
npm run lint
```

La aplicación estará disponible en **`http://localhost:3000`**

## 🔑 Credenciales de Prueba

### Usuario Administrador

```
Usuario: admin2
Contraseña: admin123
```

### Usuario Regular

```
Usuario: user1
Contraseña: user123
```

## 📱 Páginas Implementadas

| Ruta                       | Descripción         | Funcionalidades                                                      |
| -------------------------- | ------------------- | -------------------------------------------------------------------- |
| `/login`                   | Inicio de sesión    | Login con JWT, auto-fill de credenciales de prueba                   |
| `/dashboard`               | Panel principal     | KPIs, gráficas de ingresos, últimas facturas, suscripciones próximas |
| `/dashboard/customers`     | Gestión de clientes | CRUD completo, búsqueda, modal de formulario                         |
| `/dashboard/plans`         | Catálogo de planes  | CRUD (solo ADMIN), búsqueda, badges de estado                        |
| `/dashboard/subscriptions` | Suscripciones       | CRUD, filtros por estado, renovación manual                          |
| `/dashboard/invoices`      | Facturas            | Ver lista, detalle, registrar pagos, filtros                         |
| `/dashboard/payments`      | Historial de pagos  | Ver lista, detalle, filtros múltiples                                |

## 🎯 Funcionalidades Destacadas

### 🔐 Sistema de Autenticación

- JWT tokens con interceptores automáticos
- Middleware de protección de rutas
- Persistencia de sesión con cookies
- Logout automático en caso de token expirado
- Control de acceso por roles (ADMIN/USER)

### 📊 Dashboard Interactivo

- 4 KPIs principales con actualización en tiempo real
- Gráfica de ingresos mensuales (últimos 6 meses)
- Tabla de últimas facturas
- Tabla de suscripciones próximas a vencer
- Loading skeletons durante carga

### 👥 Gestión de Clientes (CRUD Completo)

- Crear, editar, eliminar clientes
- Búsqueda en tiempo real
- Modal con formulario validado
- Información del propietario del cliente
- Confirmaciones para acciones destructivas

### 📦 Planes de Suscripción

- Creación y edición (solo ADMIN)
- Ciclos de facturación: Mensual, Trimestral, Anual
- Soft delete (deshabilitar plan)
- Badges de estado (Activo/Inactivo)
- Formato de precios en USD

### 📋 Administración de Suscripciones

- Crear suscripciones asociando cliente + plan
- Editar plan de suscripción existente
- Cambiar estado: Activa/Pausada/Cancelada
- Renovar manualmente (genera nueva factura)
- Filtros por estado y búsqueda avanzada

### 🧾 Sistema de Facturas

- Ver todas las facturas con estado
- Modal de detalle con líneas de factura
- Registrar pagos con método seleccionable
- Filtros por estado (Abiertas/Pagadas/Anuladas)
- Indicadores de vencimiento

### 💳 Historial de Pagos

- Ver todos los pagos registrados
- Modal de detalle completo
- Filtros por estado (Exitoso/Fallido)
- Filtros por método (Tarjeta/Transferencia/Efectivo)
- Visualización de referencias de transacción

## 🎨 Características de UI/UX

✨ **Diseño Moderno y Responsive**

- TailwindCSS con componentes personalizados
- Optimizado para mobile, tablet y desktop
- Sidebar colapsable
- Navbar con información del usuario

⚡ **Estados de Carga**

- Skeleton loaders en tablas
- Loading spinners en botones
- Estados vacíos con call-to-action
- Feedback visual inmediato

🔔 **Notificaciones Toast**

- Notificaciones de éxito en verde
- Notificaciones de error en rojo
- Animaciones suaves
- Auto-dismiss configurado

🎭 **Modales Reutilizables**

- Backdrop con blur
- Animaciones de entrada/salida
- Click fuera para cerrar
- Tamaños configurables (sm, md, lg, xl)

## 🏗️ Arquitectura del Proyecto

```
kdevbill-frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Grupo de rutas de autenticación
│   │   └── login/
│   ├── (dashboard)/             # Grupo de rutas del dashboard
│   │   ├── layout.tsx          # Layout con Sidebar y Navbar
│   │   ├── page.tsx            # Dashboard principal
│   │   └── dashboard/          # Rutas del dashboard
│   │       ├── customers/
│   │       ├── plans/
│   │       ├── subscriptions/
│   │       ├── invoices/
│   │       └── payments/
│   └── globals.css
├── components/
│   ├── layout/                  # Componentes de layout
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   └── ui/                      # Componentes reutilizables
│       ├── LoadingButton.tsx
│       └── Modal.tsx
├── services/                     # Servicios de API
│   ├── auth.service.ts
│   ├── customer.service.ts
│   ├── plan.service.ts
│   ├── subscription.service.ts
│   ├── invoice.service.ts
│   └── payment.service.ts
├── store/                        # Estado global
│   └── auth.store.ts            # Zustand store
├── lib/                          # Utilidades
│   ├── api.ts                   # Configuración de Axios
│   └── schemas.ts               # Tipos y schemas de Zod
└── middleware.ts                 # Protección de rutas
```

## 🔧 Configuración Técnica

### Axios con Interceptores

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

### Middleware de Protección

```typescript
// Protege todas las rutas /dashboard/*
// Redirige a /login si no hay token
// Guarda token en cookie para server-side checks
```

### Validación con Zod

```typescript
const CustomerSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Mínimo 10 caracteres"),
  address: z.string().optional(),
});
```

## 🐛 Solución de Problemas

### Backend no conecta

- ✅ Verifica que el backend esté en `http://localhost:8080`
- ✅ Verifica que la ruta base sea `/kdevbill` (no `/kdevbil`)
- ✅ Revisa la configuración de CORS en el backend

### Error 401 al cargar página

- ✅ Token puede haber expirado, vuelve a hacer login
- ✅ Verifica que las cookies estén habilitadas

### Página se queda en loading

- ✅ Abre la consola del navegador para ver errores
- ✅ Errores 404 se manejan silenciosamente (retornan array vacío)
- ✅ Verifica que el backend esté respondiendo

### Build de Next.js falla

- ✅ Elimina la carpeta `.next`: `rm -rf .next`
- ✅ Reinstala dependencias: `rm -rf node_modules && npm install`
- ✅ Ejecuta: `npm run build`

## 📚 Documentación Adicional

Para documentación técnica completa, incluyendo:

- Detalles de cada página y componente
- Schemas y tipos TypeScript
- Flujos de usuario completos
- Guía para desarrolladores junior
- Mejores prácticas implementadas

👉 **Consulta el archivo [`DOCUMENTATION.md`](./DOCUMENTATION.md)**

## 🚀 Próximos Pasos Sugeridos

1. **Testing**

   - Unit tests con Jest
   - Integration tests con React Testing Library
   - E2E tests con Cypress/Playwright

2. **Optimizaciones**

   - Implementar React Query para cache
   - Añadir paginación en tablas
   - Debounce en búsquedas
   - Virtual scrolling para listas grandes

3. **Nuevas Features**

   - Exportar datos a Excel/PDF
   - Gráficas más avanzadas (Chart.js/Recharts)
   - Notificaciones en tiempo real (WebSockets)
   - Modo oscuro
   - Multi-idioma (i18n)

4. **DevOps**
   - CI/CD con GitHub Actions
   - Dockerización
   - Monitoreo con Sentry
   - Analytics

## 📄 Licencia

Proyecto de prueba técnica para Kruger Corporation - 2024

---

**Desarrollado con** ❤️ **usando Next.js, React, TypeScript y TailwindCSS**

Para más información, consulta la [documentación completa](./DOCUMENTATION.md)

````

### 4. Ejecutar la aplicación

```bash
npm run dev
````

La aplicación estará disponible en `http://localhost:3000`

## 🎯 Funcionalidades por Rol

### 👤 Usuario (USER)

- Acceso al dashboard con métricas personalizadas
- Ver y gestionar sus propios clientes
- Ver catálogo de planes disponibles
- Gestionar sus suscripciones (crear, pausar, cancelar, renovar)
- Ver y pagar sus facturas
- Consultar historial de pagos

### 👑 Administrador (ADMIN)

- Todas las funcionalidades del usuario
- Crear y gestionar clientes de todos los usuarios
- CRUD completo de planes (crear, editar, deshabilitar)
- Ver métricas globales del sistema
- Acceso a todos los datos del sistema

## 📱 Páginas Implementadas

### 🏠 Dashboard Principal (`/dashboard`)

- KPIs dinámicos (clientes, suscripciones activas, facturas pendientes, ingresos)
- Resumen de pagos y tasa de éxito
- Alertas para facturas vencidas

### 👥 Gestión de Clientes (`/dashboard/customers`)

- Listado con búsqueda por nombre/email
- CRUD completo (solo ADMIN puede crear)
- Vista responsive con información del propietario

### 📦 Catálogo de Planes (`/dashboard/plans`)

- Vista en cards responsive
- CRUD completo (solo ADMIN)
- Configuración de precios y ciclos de facturación

### 📋 Suscripciones (`/dashboard/subscriptions`)

- Filtros por estado (Activa, Pausada, Cancelada)
- Búsqueda por cliente o plan
- Acciones contextuales (renovar, pausar, cancelar)

### 🧾 Facturas (`/dashboard/invoices`)

- Estados: Pendiente, Pagada, Anulada
- Procesamiento de pagos simulados
- Vista detallada y alertas de vencimiento

### 💳 Pagos (`/dashboard/payments`)

- Historial completo con filtros por estado y método
- Métricas de éxito y total recaudado
- Detalles de cada transacción

## 🔐 Autenticación

### Páginas de Auth

- **Login** (`/login`): Formulario con validación
- **Register** (`/register`): Creación de cuentas USER

### Seguridad

- JWT Tokens con interceptores automáticos
- Middleware de protección de rutas
- Logout automático en tokens expirados
- Persistencia de sesión con Zustand

## 🎨 Interfaz de Usuario

- **Diseño moderno** con TailwindCSS
- **Completamente responsive**
- **Estados de carga** y skeleton screens
- **Notificaciones toast** para feedback
- **Modales** para acciones importantes
- **Iconografía consistente**

## 🤝 Uso de la Aplicación

1. **Inicia sesión** en `/login` o crea una cuenta en `/register`
2. **Explora el dashboard** para ver métricas de tu negocio
3. **Gestiona clientes** en `/dashboard/customers`
4. **Configura planes** en `/dashboard/plans` (solo ADMIN)
5. **Crea suscripciones** en `/dashboard/subscriptions`
6. **Procesa pagos** desde `/dashboard/invoices`
7. **Consulta historial** en `/dashboard/payments`

## 🚨 Notas Importantes

- La aplicación está configurada para consumir la API backend en `http://localhost:8080/kdevbil`
- Todas las rutas del dashboard están protegidas y requieren autenticación
- Los filtros y búsquedas funcionan en tiempo real
- El manejo de errores incluye toast notifications automáticas
- La aplicación es completamente funcional y lista para producción

---

**Desarrollado para Kruger Corporation** - Evaluación Técnica Semi Senior Fullstack 🚀
