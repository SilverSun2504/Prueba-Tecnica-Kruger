# Kruger DevBill - Sistema de Facturación SaaS

Sistema completo de gestión de facturación para suscripciones, desarrollado como prueba técnica para Kruger Corporation.

## 🏗️ Estructura del Proyecto

Este es un monorepo que contiene tanto el backend como el frontend de la aplicación:

```
Prueba-Tecnica-Kruger/
├── backend/          # API REST con Spring Boot
└── frontend/         # Aplicación web con Next.js
```

## 🚀 Backend (Spring Boot)

API REST desarrollada con Spring Boot 3.x, Spring Security, y PostgreSQL.

### Características

- ✅ Autenticación JWT
- ✅ Control de acceso basado en roles (ADMIN/USER)
- ✅ CRUD completo de clientes, planes, suscripciones, facturas y pagos
- ✅ Generación automática de facturas
- ✅ Documentación con Swagger

### Tecnologías

- Java 17
- Spring Boot 3.x
- Spring Security
- PostgreSQL
- Gradle

### Ejecutar Backend

```bash
cd backend
./gradlew bootRun
```

El servidor estará disponible en `http://localhost:8080`

Para más detalles, ver [backend/README.md](backend/README.md)

## 🎨 Frontend (Next.js)

Aplicación web moderna desarrollada con Next.js 13+, React 18 y TypeScript.

### Características

- ✅ Interfaz responsiva con TailwindCSS
- ✅ Autenticación con JWT
- ✅ Dashboard con estadísticas
- ✅ Gestión completa de clientes, planes y suscripciones
- ✅ Manejo de facturas y pagos
- ✅ Validación de formularios con Zod
- ✅ Notificaciones con React Hot Toast

### Tecnologías

- Next.js 13+ (App Router)
- React 18
- TypeScript
- TailwindCSS
- Zustand (state management)
- React Hook Form + Zod

### Ejecutar Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

Para más detalles, ver [frontend/README.md](frontend/README.md)

## 👥 Usuarios de Prueba

### Administrador

- **Usuario**: `admin2`
- **Contraseña**: `admin123`
- **Permisos**: Acceso completo a todas las funcionalidades

### Usuario Regular

- **Usuario**: `user1`
- **Contraseña**: `user123`
- **Permisos**: Gestión de sus propios clientes y suscripciones

## 🔧 Configuración Completa

### 1. Base de Datos

```bash
# Crear base de datos PostgreSQL
createdb kdevbill
```

### 2. Backend

```bash
cd backend
# Configurar application.properties con tus credenciales de PostgreSQL
./gradlew bootRun
```

### 3. Frontend

```bash
cd frontend
# Configurar .env.local con la URL del backend
cp .env.local.example .env.local
npm install
npm run dev
```

## 📝 Licencia

Este proyecto fue desarrollado como prueba técnica para Kruger Corporation.

---

**Desarrollado por**: Leonardo Sánchez  
**Fecha**: Noviembre 2025
