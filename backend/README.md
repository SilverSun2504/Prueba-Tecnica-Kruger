# KdevBill API - Backend

API RESTful con Spring Boot para el sistema de facturación y suscripciones.

## Tecnologías

- Spring Boot 3.5.7
- Java 17
- PostgreSQL 18.0
- Spring Security + JWT
- Swagger/OpenAPI

## Configuración Rápida

1. Configurar PostgreSQL
2. Configurar variables de entorno en .env
3. Ejecutar: ./gradlew bootRun

## Endpoints Principales

- **Auth**: /kdevbill/auth/\* - Login, registro
- **Customers**: /kdevbill/customers - CRUD clientes
- **Plans**: /kdevbill/plans - Gestión planes
- **Subscriptions**: /kdevbill/subscriptions - Suscripciones
- **Invoices**: /kdevbill/invoices - Facturación
- **Payments**: /kdevbill/payments - Pagos

Ver documentación completa en: http://localhost:8080/swagger-ui.html
