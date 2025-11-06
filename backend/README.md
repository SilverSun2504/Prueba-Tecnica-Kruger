# 🏢 KdevBill API - Sistema de Suscripciones y Facturación

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18.0-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

API RESTful construida con Spring Boot para gestionar un SaaS de **suscripciones y facturación**. Proyecto desarrollado como parte de la evaluación técnica para **Kruger Corporation**.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Documentación](#-documentación)
- [Testing](#-testing)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)

---

## ✨ Características

### 🔐 Autenticación y Autorización

- ✅ JWT (JSON Web Tokens) con algoritmo HS256
- ✅ Roles: `ADMIN` y `USER`
- ✅ Spring Security con control de acceso basado en roles
- ✅ Endpoints protegidos con `@PreAuthorize`

### 👥 Gestión de Clientes

- ✅ CRUD completo de clientes
- ✅ Validación de datos con Jakarta Validation
- ✅ Búsqueda y filtrado
- ✅ Control de propiedad (usuarios solo acceden a sus propios recursos)

### 📋 Gestión de Planes

- ✅ CRUD completo de planes de suscripción
- ✅ Ciclos de facturación: `MONTHLY`, `YEARLY`
- ✅ Activación/desactivación de planes (soft delete)
- ✅ Solo administradores pueden gestionar planes

### 📝 Gestión de Suscripciones

- ✅ Creación automática de customer si no existe
- ✅ Cálculo automático de `nextBillingDate` según ciclo
- ✅ Estados: `ACTIVE`, `PAUSED`, `CANCELED`
- ✅ Renovación de suscripciones
- ✅ Generación automática de facturas

### 🧾 Gestión de Facturas

- ✅ Generación automática al renovar suscripciones
- ✅ Estados: `OPEN`, `PAID`, `VOID`
- ✅ Fecha de vencimiento automática (7 días)
- ✅ Pago simulado de facturas
- ✅ Histórico completo

### 💳 Gestión de Pagos

- ✅ Registro automático al pagar facturas
- ✅ Métodos: `CARD`, `TRANSFER`, `CASH`
- ✅ Estados: `SUCCESS`, `FAILED`
- ✅ Referencia única por pago
- ✅ Auditoría completa

---

## 🛠️ Tecnologías

### Backend

- **Java 17** - Lenguaje de programación
- **Spring Boot 3.5.7** - Framework principal
- **Spring Security** - Autenticación y autorización
- **Spring Data JPA** - Persistencia de datos
- **Hibernate** - ORM
- **PostgreSQL 18.0** - Base de datos relacional
- **Flyway** - Migraciones de base de datos

### Seguridad

- **JWT 0.12.3** - Tokens de autenticación
- **BCrypt** - Encriptación de contraseñas

### Documentación

- **SpringDoc OpenAPI 2.8.13** - Documentación automática
- **Swagger UI** - Interfaz interactiva de API

### Build & Testing

- **Gradle 8.x** - Gestión de dependencias
- **JUnit 5** - Testing framework
- **Mockito** - Mocking para tests

---

## 🏗️ Arquitectura

### Patrón de Capas

```
┌─────────────────────────────────────┐
│         Controllers                 │  ← REST Endpoints
├─────────────────────────────────────┤
│         Services                    │  ← Lógica de Negocio
├─────────────────────────────────────┤
│         Repositories                │  ← Acceso a Datos
├─────────────────────────────────────┤
│         Entities                    │  ← Modelo de Datos
└─────────────────────────────────────┘
```

### Estructura del Proyecto

```
src/main/java/com/kruger/kdevbill/
├── config/              # Configuraciones (Security, OpenAPI, CORS)
├── controller/          # Controladores REST
├── dto/                 # Data Transfer Objects
│   ├── request/         # DTOs de entrada
│   └── response/        # DTOs de salida
├── entity/              # Entidades JPA
│   └── enums/           # Enumeraciones
├── mapper/              # Conversión DTOs ↔ Entities
├── repository/          # Repositorios JPA
├── security/            # JWT, Filtros, Helpers
└── service/             # Lógica de negocio
    └── impl/            # Implementaciones
```

### Modelo de Datos

```
User (1) ────→ (N) Customer
Customer (1) ────→ (N) Subscription
Plan (1) ────→ (N) Subscription
Subscription (1) ────→ (N) Invoice
Invoice (1) ────→ (N) Payment
```

---

## 📦 Requisitos

- **Java JDK 17** o superior
- **PostgreSQL 18.0** o superior
- **Gradle 8.x** (incluido via wrapper)
- **Git** (para clonar el repositorio)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/SilverSun2504/Prueba-Tecnica-Kruger.git
cd Prueba-Tecnica-Kruger
```

### 2. Configurar PostgreSQL

Crear la base de datos:

```sql
CREATE DATABASE kdevbill;
CREATE USER kdevbill_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE kdevbill TO kdevbill_user;
```

### 3. Configurar application.properties

Editar `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/kdevbill
spring.datasource.username=kdevbill_user
spring.datasource.password=your_password

# JWT Secret (cambiar en producción)
jwt.secret=your-secret-key-min-256-bits-long-for-HS256-algorithm
jwt.expiration=86400000
```

### 4. Compilar el proyecto

```bash
./gradlew build
```

### 5. Ejecutar la aplicación

```bash
./gradlew bootRun
```

La aplicación estará disponible en: `http://localhost:8080`

---

## ⚙️ Configuración

### Variables de Entorno (Recomendado para Producción)

```bash
export DB_URL=jdbc:postgresql://localhost:5432/kdevbill
export DB_USERNAME=kdevbill_user
export DB_PASSWORD=your_secure_password
export JWT_SECRET=your-very-secure-secret-key-here
export JWT_EXPIRATION=86400000
```

### Configuración de CORS

Por defecto permite todas las origines en desarrollo. Para producción, editar `WebConfig.java`:

```java
.allowedOrigins("https://your-frontend-domain.com")
```

---

## 📖 Uso

### 1. Registrar Usuario

```bash
POST /kdevbill/auth/register
Content-Type: application/json

{
  "username": "admin123",
  "email": "admin@test.com",
  "password": "securePassword123"
}
```

> **Nota:** Si el username contiene "admin", se asigna rol `ADMIN`, de lo contrario `USER`.

### 2. Login

```bash
POST /kdevbill/auth/login
Content-Type: application/json

{
  "username": "admin123",
  "password": "securePassword123"
}
```

**Respuesta:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "admin123",
  "role": "ADMIN"
}
```

### 3. Usar el Token

Agregar el header en todas las peticiones protegidas:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

---

## 🔌 API Endpoints

### 🔐 Authentication (`/auth`)

| Método | Endpoint         | Descripción                 | Público |
| ------ | ---------------- | --------------------------- | ------- |
| POST   | `/auth/register` | Registrar nuevo usuario     | ✅      |
| POST   | `/auth/login`    | Iniciar sesión              | ✅      |
| GET    | `/auth/me`       | Obtener usuario autenticado | 🔒      |

### 👥 Customers (`/customers`)

| Método | Endpoint          | Descripción        | Rol         |
| ------ | ----------------- | ------------------ | ----------- |
| POST   | `/customers`      | Crear cliente      | ADMIN       |
| GET    | `/customers`      | Listar clientes    | ADMIN       |
| GET    | `/customers/{id}` | Obtener cliente    | ADMIN/Owner |
| PUT    | `/customers/{id}` | Actualizar cliente | ADMIN/Owner |
| DELETE | `/customers/{id}` | Eliminar cliente   | ADMIN       |

### 📋 Plans (`/plans`)

| Método | Endpoint      | Descripción       | Rol   |
| ------ | ------------- | ----------------- | ----- |
| POST   | `/plans`      | Crear plan        | ADMIN |
| GET    | `/plans`      | Listar planes     | ALL   |
| GET    | `/plans/{id}` | Obtener plan      | ALL   |
| PUT    | `/plans/{id}` | Actualizar plan   | ADMIN |
| DELETE | `/plans/{id}` | Deshabilitar plan | ADMIN |

### 📝 Subscriptions (`/subscriptions`)

| Método | Endpoint                    | Descripción              | Rol         |
| ------ | --------------------------- | ------------------------ | ----------- |
| POST   | `/subscriptions`            | Crear suscripción        | USER/ADMIN  |
| GET    | `/subscriptions`            | Listar mis suscripciones | USER        |
| GET    | `/subscriptions/{id}`       | Obtener suscripción      | Owner/ADMIN |
| PUT    | `/subscriptions/{id}`       | Actualizar suscripción   | Owner/ADMIN |
| POST   | `/subscriptions/{id}/renew` | Renovar/Generar factura  | Owner/ADMIN |

### 🧾 Invoices (`/invoices`)

| Método | Endpoint             | Descripción         | Rol         |
| ------ | -------------------- | ------------------- | ----------- |
| GET    | `/invoices`          | Listar mis facturas | USER        |
| GET    | `/invoices/{id}`     | Obtener factura     | Owner/ADMIN |
| POST   | `/invoices/{id}/pay` | Pagar factura       | Owner/ADMIN |

### 💳 Payments (`/payments`)

| Método | Endpoint         | Descripción      | Rol         |
| ------ | ---------------- | ---------------- | ----------- |
| GET    | `/payments`      | Listar mis pagos | USER        |
| GET    | `/payments/{id}` | Obtener pago     | Owner/ADMIN |

---

## 📚 Documentación

### Swagger UI

Una vez iniciada la aplicación, acceder a:

```
http://localhost:8080/kdevbill/swagger-ui/index.html
```

### OpenAPI JSON

```
http://localhost:8080/kdevbill/v3/api-docs
```

### Documentación Adicional

- **[DOCUMENTACION_COMPLETA.md](DOCUMENTACION_COMPLETA.md)** - Guía detallada del proyecto
- **[RESUMEN_PARA_FRONTEND.md](RESUMEN_PARA_FRONTEND.md)** - Integración con frontend
- **[SOLUCION_CUSTOMER_PROFILE.md](SOLUCION_CUSTOMER_PROFILE.md)** - Solución al problema de customer profile
- **[SOLUCION_GET_SUBSCRIPTIONS.md](SOLUCION_GET_SUBSCRIPTIONS.md)** - Solución al problema de GET subscriptions

---

## 🧪 Testing

### Ejecutar Tests

```bash
./gradlew test
```

### Ver Reporte de Tests

```bash
./gradlew test
# El reporte se genera en: build/reports/tests/test/index.html
```

### Coverage

```bash
./gradlew jacocoTestReport
# El reporte se genera en: build/reports/jacoco/test/html/index.html
```

---

## 🐳 Despliegue

### Docker

Crear imagen:

```bash
./gradlew bootBuildImage
```

Ejecutar con Docker Compose:

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:18
    environment:
      POSTGRES_DB: kdevbill
      POSTGRES_USER: kdevbill_user
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"

  api:
    image: kdevbill-api:latest
    depends_on:
      - postgres
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kdevbill
      SPRING_DATASOURCE_USERNAME: kdevbill_user
      SPRING_DATASOURCE_PASSWORD: your_password
    ports:
      - "8080:8080"
```

```bash
docker-compose up -d
```

---

## 🤝 Contribución

### Flujo de Trabajo

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Estándares de Código

- Seguir convenciones de Java (CamelCase, etc.)
- Documentar código con JavaDoc
- Escribir tests para nuevas features
- Mantener cobertura > 80%

---

## 📝 Reglas de Negocio

1. **Suscripciones:**

   - Al crear `ACTIVE`, calcular `nextBillingDate` según `billingCycle`
   - Si usuario no tiene customer, crear uno automáticamente

2. **Facturas:**

   - `POST /subscriptions/{id}/renew` genera factura `OPEN`
   - `amount = plan.price`
   - `dueDate = issuedAt + 7 días`

3. **Pagos:**
   - Solo facturas `OPEN` pueden pagarse
   - Al pagar, cambia a `PAID` y crea registro de `Payment`
   - Si era la próxima del ciclo → renovar `nextBillingDate`

---

## 🔒 Seguridad

- ✅ Contraseñas encriptadas con BCrypt
- ✅ JWT con expiración configurable
- ✅ CORS configurado
- ✅ SQL Injection protegido (JPA)
- ✅ XSS protegido
- ✅ CSRF deshabilitado (API stateless)

### Recomendaciones para Producción

1. Cambiar `jwt.secret` por uno seguro (min 256 bits)
2. Configurar HTTPS
3. Limitar orígenes CORS
4. Implementar rate limiting
5. Agregar logs estructurados
6. Configurar monitoring (Actuator + Prometheus)

---

## 📊 Estado del Proyecto

### ✅ Completado

- [x] Autenticación JWT
- [x] CRUD Clientes
- [x] CRUD Planes
- [x] CRUD Suscripciones
- [x] Gestión de Facturas
- [x] Gestión de Pagos
- [x] Documentación OpenAPI
- [x] Validaciones
- [x] Control de acceso por roles
- [x] Manejo de errores global

### 🔄 En Progreso

- [ ] Tests unitarios completos
- [ ] Tests de integración
- [ ] Auditoría con AuditorAware
- [ ] Paginación y filtros avanzados
- [ ] Cache con Redis

### 📅 Roadmap

- [ ] Notificaciones por email
- [ ] Webhooks para eventos
- [ ] Dashboard de analytics
- [ ] Exportación de reportes
- [ ] Multi-tenancy

---

## 👨‍💻 Autor

**Leonardo Salazar**

- GitHub: [@SilverSun2504](https://github.com/SilverSun2504)
- Email: your.email@example.com

---

## 📄 Licencia

Este proyecto es parte de una evaluación técnica para **Kruger Corporation**.

---

## 🙏 Agradecimientos

- Kruger Corporation por la oportunidad
- Spring Boot Team por el excelente framework
- Comunidad de desarrolladores Java

---

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la [Documentación Completa](DOCUMENTACION_COMPLETA.md)
2. Consulta los [Issues](https://github.com/SilverSun2504/Prueba-Tecnica-Kruger/issues)
3. Crea un nuevo Issue describiendo el problema

---

**¡Gracias por revisar este proyecto!** ⭐

Si te resultó útil, considera darle una estrella en GitHub.
