# 🏢 KdevBill - Sistema de Gestión de Facturación y Suscripciones# 🏢 KdevBill Frontend - Sistema de Facturación SaaS

Sistema completo de gestión de suscripciones y facturación desarrollado para Kruger Corporation.Sistema de gestión de suscripciones y facturación para Kruger Corporation, desarrollado con **Next.js 13+**, **React 18**, **TypeScript**, y **TailwindCSS**.

## 📁 Estructura del Proyecto## 🚀 Características Principales

Este es un proyecto **monorepo** que contiene:- ✅ **Autenticación JWT** con persistencia de sesión y middleware de protección

- ✅ **Dashboard interactivo** con KPIs en tiempo real y gráficas

````- ✅ **Gestión completa de clientes** (CRUD con modales y validación)

Prueba-Tecnica-Kruger/- ✅ **Catálogo de planes** con diferentes ciclos de facturación (mensual, trimestral, anual)

├── backend/          # API REST con Spring Boot- ✅ **Administración de suscripciones** con cambios de estado y renovación manual

├── frontend/         # Aplicación web con Next.js- ✅ **Sistema de facturas** con visualización de detalles y procesamiento de pagos

└── README.md         # Este archivo- ✅ **Historial de pagos** con filtros por estado y método de pago

```- ✅ **Control de acceso por roles** (ADMIN/USER) con permisos granulares

- ✅ **Interfaz responsive** optimizada para mobile, tablet y desktop

---- ✅ **Validación de formularios** con React Hook Form + Zod schemas

- ✅ **Notificaciones toast** para feedback inmediato del usuario

## 🚀 Backend - Spring Boot API- ✅ **Estados de carga** (skeletons) y manejo robusto de errores



### Tecnologías## 🛠️ Stack Tecnológico

- Java 17

- Spring Boot 3.x| Categoría      | Tecnología               |

- Spring Security + JWT| -------------- | ------------------------ |

- PostgreSQL| Framework      | Next.js 13+ (App Router) |

- Flyway (Migraciones)| UI Library     | React 18                 |

- Gradle| Lenguaje       | TypeScript               |

| Estilos        | TailwindCSS              |

### Características| Estado Global  | Zustand                  |

- ✅ API RESTful completa| Formularios    | React Hook Form          |

- ✅ Autenticación JWT| Validación     | Zod                      |

- ✅ Control de acceso por roles (ADMIN/USER)| HTTP Client    | Axios                    |

- ✅ Gestión de clientes, planes y suscripciones| Notificaciones | React Hot Toast          |

- ✅ Sistema de facturación automática| Iconos         | Lucide React             |

- ✅ Procesamiento de pagos

- ✅ Documentación OpenAPI (Swagger)## 🚦 Inicio Rápido



### Ejecutar Backend### 1. Prerequisitos



```bash- **Node.js 18+** y npm/yarn/pnpm

cd backend- **Backend API** ejecutándose en `http://localhost:8080/kdevbill`



# Configurar base de datos en application.properties### 2. Instalar dependencias

# spring.datasource.url=jdbc:postgresql://localhost:5432/kdevbill

# spring.datasource.username=tu_usuario```bash

# spring.datasource.password=tu_passwordnpm install

````

# Ejecutar con Gradle

./gradlew bootRun### 3. Variables de entorno (Opcional)

# O con el wrapper de WindowsEl proyecto usa la URL del backend configurada directamente en `lib/api.ts`:

gradlew.bat bootRun

`````typescript



**URL Backend:** `http://localhost:8080`  ```

**Swagger UI:** `http://localhost:8080/swagger-ui.html`

Si necesitas cambiar la URL del backend, modifica el archivo `lib/api.ts`:

---

```typescript

## 🎨 Frontend - Next.js ApplicationbaseURL: "http://localhost:8080/kdevbill"; // Cambia esta URL según tu configuración

```

### Tecnologías

- Next.js 16 (App Router)### 4. Ejecutar la aplicación

- React 19

- TypeScript```bash

- TailwindCSS# Modo desarrollo (con hot reload)

- Zustand (Estado global)npm run dev

- Axios

- React Hook Form + Zod# Build de producción

npm run build

### Característicasnpm start

- ✅ Dashboard interactivo con métricas

- ✅ Gestión completa de clientes (CRUD)# Linting

- ✅ Administración de planes y suscripcionesnpm run lint

- ✅ Sistema de facturas y pagos```

- ✅ Control de acceso por roles

- ✅ Interfaz responsiveLa aplicación estará disponible en **`http://localhost:3000`**

- ✅ Validación de formularios

- ✅ Notificaciones en tiempo real## 🔑 Credenciales de Prueba



### Ejecutar Frontend### Usuario Administrador



```bash```

cd frontendUsuario: admin2

Contraseña: admin123

# Instalar dependencias```

npm install

### Usuario Regular

# Configurar variable de entorno (opcional)

# Crear .env.local con:```

# NEXT_PUBLIC_API_URL=http://localhost:8080/kdevbillUsuario: user1

Contraseña: user123

# Ejecutar en modo desarrollo```

npm run dev

```## 📱 Páginas Implementadas



**URL Frontend:** `http://localhost:3000`| Ruta                       | Descripción         | Funcionalidades                                                      |

| -------------------------- | ------------------- | -------------------------------------------------------------------- |

---| `/login`                   | Inicio de sesión    | Login con JWT, auto-fill de credenciales de prueba                   |

| `/dashboard`               | Panel principal     | KPIs, gráficas de ingresos, últimas facturas, suscripciones próximas |

## 🔧 Configuración Completa del Sistema| `/dashboard/customers`     | Gestión de clientes | CRUD completo, búsqueda, modal de formulario                         |

| `/dashboard/plans`         | Catálogo de planes  | CRUD (solo ADMIN), búsqueda, badges de estado                        |

### 1. Prerequisitos| `/dashboard/subscriptions` | Suscripciones       | CRUD, filtros por estado, renovación manual                          |

| `/dashboard/invoices`      | Facturas            | Ver lista, detalle, registrar pagos, filtros                         |

- **Java 17+** (para backend)| `/dashboard/payments`      | Historial de pagos  | Ver lista, detalle, filtros múltiples                                |

- **Node.js 18+** (para frontend)

- **PostgreSQL 14+** (base de datos)## 🎯 Funcionalidades Destacadas

- **Git**

### 🔐 Sistema de Autenticación

### 2. Configurar Base de Datos

- JWT tokens con interceptores automáticos

```sql- Middleware de protección de rutas

-- Crear base de datos- Persistencia de sesión con cookies

CREATE DATABASE kdevbill;- Logout automático en caso de token expirado

- Control de acceso por roles (ADMIN/USER)

-- Crear usuario (opcional)

CREATE USER kdevbill_user WITH PASSWORD 'tu_password';### 📊 Dashboard Interactivo

GRANT ALL PRIVILEGES ON DATABASE kdevbill TO kdevbill_user;

```- 4 KPIs principales con actualización en tiempo real

- Gráfica de ingresos mensuales (últimos 6 meses)

### 3. Iniciar el Backend- Tabla de últimas facturas

- Tabla de suscripciones próximas a vencer

```bash- Loading skeletons durante carga

# En la carpeta raíz del proyecto

cd backend### 👥 Gestión de Clientes (CRUD Completo)



# Configurar application.properties- Crear, editar, eliminar clientes

# Editar: src/main/resources/application.properties- Búsqueda en tiempo real

- Modal con formulario validado

# Ejecutar- Información del propietario del cliente

./gradlew bootRun- Confirmaciones para acciones destructivas

```

### 📦 Planes de Suscripción

### 4. Iniciar el Frontend

- Creación y edición (solo ADMIN)

```bash- Ciclos de facturación: Mensual, Trimestral, Anual

# En otra terminal, desde la carpeta raíz- Soft delete (deshabilitar plan)

cd frontend- Badges de estado (Activo/Inactivo)

- Formato de precios en USD

# Instalar dependencias (solo la primera vez)

npm install### 📋 Administración de Suscripciones



# Ejecutar- Crear suscripciones asociando cliente + plan

npm run dev- Editar plan de suscripción existente

```- Cambiar estado: Activa/Pausada/Cancelada

- Renovar manualmente (genera nueva factura)

### 5. Acceder al Sistema- Filtros por estado y búsqueda avanzada



- **Frontend:** http://localhost:3000### 🧾 Sistema de Facturas

- **Backend API:** http://localhost:8080/kdevbill

- **Swagger Docs:** http://localhost:8080/swagger-ui.html- Ver todas las facturas con estado

- Modal de detalle con líneas de factura

### 6. Credenciales de Prueba- Registrar pagos con método seleccionable

- Filtros por estado (Abiertas/Pagadas/Anuladas)

El sistema incluye datos de prueba precargados:- Indicadores de vencimiento



**Administrador:**### 💳 Historial de Pagos

- Username: `admin`

- Password: `admin123`- Ver todos los pagos registrados

- Modal de detalle completo

**Usuario Regular:**- Filtros por estado (Exitoso/Fallido)

- Username: `user`- Filtros por método (Tarjeta/Transferencia/Efectivo)

- Password: `user123`- Visualización de referencias de transacción



---## 🎨 Características de UI/UX



## 📖 Documentación Adicional✨ **Diseño Moderno y Responsive**



### Backend- TailwindCSS con componentes personalizados

Para más detalles sobre la API, endpoints y configuración del backend:- Optimizado para mobile, tablet y desktop

- Ver: [`backend/README.md`](backend/README.md)- Sidebar colapsable

- Documentación interactiva: http://localhost:8080/swagger-ui.html- Navbar con información del usuario



### Frontend⚡ **Estados de Carga**

Para más detalles sobre componentes, arquitectura y configuración del frontend:

- Ver: [`frontend/README.md`](frontend/README.md)- Skeleton loaders en tablas

- Loading spinners en botones

---- Estados vacíos con call-to-action

- Feedback visual inmediato

## 🏗️ Arquitectura del Sistema

🔔 **Notificaciones Toast**

```

┌─────────────────────────────────────────────────────────────┐- Notificaciones de éxito en verde

│                      FRONTEND (Next.js)                     │- Notificaciones de error en rojo

│                    http://localhost:3000                    │- Animaciones suaves

│                                                             │- Auto-dismiss configurado

│  - Dashboard con métricas                                   │

│  - Gestión de clientes, planes, suscripciones              │🎭 **Modales Reutilizables**

│  - Sistema de facturas y pagos                             │

└─────────────────────┬───────────────────────────────────────┘- Backdrop con blur

                      │- Animaciones de entrada/salida

                      │ REST API (JWT Auth)- Click fuera para cerrar

                      │ http://localhost:8080/kdevbill- Tamaños configurables (sm, md, lg, xl)

                      ▼

┌─────────────────────────────────────────────────────────────┐## 🏗️ Arquitectura del Proyecto

│                   BACKEND (Spring Boot)                     │

│                    http://localhost:8080                    │```

│                                                             │kdevbill-frontend/

│  - API RESTful                                              │├── app/                          # Next.js App Router

│  - Seguridad JWT                                            ││   ├── (auth)/                  # Grupo de rutas de autenticación

│  - Lógica de negocio                                        ││   │   └── login/

└─────────────────────┬───────────────────────────────────────┘│   ├── (dashboard)/             # Grupo de rutas del dashboard

                      ││   │   ├── layout.tsx          # Layout con Sidebar y Navbar

                      │ JDBC / JPA│   │   ├── page.tsx            # Dashboard principal

                      ▼│   │   └── dashboard/          # Rutas del dashboard

┌─────────────────────────────────────────────────────────────┐│   │       ├── customers/

│                  BASE DE DATOS (PostgreSQL)                 ││   │       ├── plans/

│                    localhost:5432/kdevbill                  ││   │       ├── subscriptions/

│                                                             ││   │       ├── invoices/

│  - Usuarios y autenticación                                 ││   │       └── payments/

│  - Clientes y planes                                        ││   └── globals.css

│  - Suscripciones, facturas y pagos                         │├── components/

└─────────────────────────────────────────────────────────────┘│   ├── layout/                  # Componentes de layout

```│   │   ├── Navbar.tsx

│   │   └── Sidebar.tsx

---│   └── ui/                      # Componentes reutilizables

│       ├── LoadingButton.tsx

## 🧪 Testing│       └── Modal.tsx

├── services/                     # Servicios de API

### Backend│   ├── auth.service.ts

```bash│   ├── customer.service.ts

cd backend│   ├── plan.service.ts

./gradlew test│   ├── subscription.service.ts

```│   ├── invoice.service.ts

│   └── payment.service.ts

### Frontend├── store/                        # Estado global

```bash│   └── auth.store.ts            # Zustand store

cd frontend├── lib/                          # Utilidades

npm run test│   ├── api.ts                   # Configuración de Axios

```│   └── schemas.ts               # Tipos y schemas de Zod

└── middleware.ts                 # Protección de rutas

---```



## 📦 Deployment## 🔧 Configuración Técnica



### Backend (JAR)### Axios con Interceptores

```bash

cd backend```typescript

./gradlew bootJar// Request: Añade token automáticamente

java -jar build/libs/kdevbill-api-0.0.1-SNAPSHOT.jarapi.interceptors.request.use((config) => {

```  const token = useAuthStore.getState().token;

  if (token) {

### Frontend (Producción)    config.headers.Authorization = `Bearer ${token}`;

```bash  }

cd frontend  return config;

npm run build});

npm start

```// Response: Maneja 401 automáticamente

api.interceptors.response.use(

---  (response) => response,

  (error) => {

## 🛠️ Stack Tecnológico Completo    if (error.response?.status === 401) {

      useAuthStore.getState().logout();

| Componente | Tecnología |      window.location.href = "/login";

|------------|------------|    }

| **Backend Framework** | Spring Boot 3.x |    return Promise.reject(error);

| **Lenguaje Backend** | Java 17 |  }

| **Seguridad** | Spring Security + JWT |);

| **Base de Datos** | PostgreSQL 14+ |```

| **ORM** | Spring Data JPA |

| **Migraciones** | Flyway |### Middleware de Protección

| **Build Tool Backend** | Gradle |

| **Frontend Framework** | Next.js 16 |```typescript

| **UI Library** | React 19 |// Protege todas las rutas /dashboard/*

| **Lenguaje Frontend** | TypeScript |// Redirige a /login si no hay token

| **Estilos** | TailwindCSS |// Guarda token en cookie para server-side checks

| **Estado Global** | Zustand |```

| **HTTP Client** | Axios |

| **Validación** | Zod + React Hook Form |### Validación con Zod



---```typescript

const CustomerSchema = z.object({

## 👨‍💻 Desarrollador  name: z.string().min(3, "Mínimo 3 caracteres"),

  email: z.string().email("Email inválido"),

**Leonardo Salazar**    phone: z.string().min(10, "Mínimo 10 caracteres"),

Prueba Técnica - Kruger Corporation    address: z.string().optional(),

Noviembre 2025});

```

---

## 🐛 Solución de Problemas

## 📝 Licencia

### Backend no conecta

Este proyecto fue desarrollado como parte de una prueba técnica para Kruger Corporation.

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
`````
