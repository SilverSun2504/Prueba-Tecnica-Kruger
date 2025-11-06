# 🔧 Troubleshooting Guide - KdevBill API

## Problema: GET /subscriptions regresa array vacío `[]`

### 🔍 **Causa Raíz**

El endpoint `GET /api/subscriptions` busca las subscripciones del **customer asociado al usuario autenticado**. Si el usuario no tiene un customer profile, el sistema no encuentra ninguna subscription y regresa un array vacío.

### 📋 **Flujo del Sistema**

```
Usuario autenticado (JWT)
    ↓
Buscar Customer con owner_id = user_id
    ↓
¿Customer encontrado?
    ├─ SÍ → Buscar subscriptions de ese customer
    └─ NO → Lanzar error "No customer profile found"
```

### 🎯 **Solución Implementada**

#### **1. Auto-creación de Customer para usuarios USER**

Cuando un usuario con rol `USER` se registra, el sistema automáticamente crea un customer profile:

```java
// En AuthServiceImpl.register()
if (userRole == Role.USER) {
    Customer customer = Customer.builder()
        .name(savedUser.getUsername() + " Customer")
        .email(savedUser.getEmail())
        .owner(savedUser)
        .build();
    customerRepository.save(customer);
}
```

**Beneficios:**

- ✅ Usuarios normales tienen customer profile desde el registro
- ✅ Pueden crear subscriptions inmediatamente
- ✅ GET /subscriptions funciona sin configuración adicional

#### **2. Usuarios ADMIN deben crear customer manualmente**

Los administradores pueden gestionar múltiples customers, por lo tanto NO se les crea uno automáticamente. Deben usar:

```bash
POST /api/customers
Authorization: Bearer {admin_token}

{
  "name": "Admin Customer",
  "email": "admin@example.com",
  "userId": 7  # Opcional: Para crear customer de otro usuario
}
```

#### **3. Mensaje de error mejorado**

Ahora si un usuario intenta acceder a GET /subscriptions sin customer profile, recibe:

```json
{
  "error": "No customer profile found for user: username. Please create a customer profile first or contact administrator."
}
```

### 🔄 **Estrategia de Búsqueda de Customer (Triple-Strategy)**

El sistema usa 3 estrategias para encontrar el customer:

1. **Por username del owner:**

   ```sql
   SELECT c FROM Customer c WHERE c.owner.username = :username
   ```

2. **Por ID del owner:**

   ```sql
   SELECT c FROM Customer c WHERE c.owner.id = :userId
   ```

3. **Por instancia del User:**
   ```java
   customerRepository.findByOwner(authenticatedUser)
   ```

Si las 3 fallan, lanza la excepción descriptiva.

---

## Problema: "Authenticated user does not have a customer profile"

### 🔍 **Causa**

Este error aparecía en versiones anteriores cuando se intentaba crear una subscription sin tener un customer profile asociado.

### ✅ **Solución Actual**

El sistema ahora tiene **auto-creación de customer** en dos puntos:

1. **Al registrarse** (solo para usuarios USER)
2. **Al crear subscription** (fallback si no existe customer)

```java
// En SubscriptionServiceImpl.createSubscription()
Customer customer;
if (request.getCustomerId() != null && securityHelper.isAdmin()) {
    customer = customerRepository.findById(request.getCustomerId())
        .orElseThrow(...);
} else {
    User authenticatedUser = securityHelper.getAuthenticatedUser();
    customer = customerRepository.findByOwnerId(authenticatedUser.getId())
        .orElseGet(() -> {
            // Auto-crear customer si no existe
            Customer newCustomer = Customer.builder()
                .name("Auto Customer - " + authenticatedUser.getUsername())
                .email(authenticatedUser.getEmail())
                .owner(authenticatedUser)
                .build();
            return customerRepository.save(newCustomer);
        });
}
```

---

## Problema: Queries Hibernate múltiples (N+1)

### 🔍 **Causa**

Lazy loading de relaciones `customer` y `plan` en Subscription causaba múltiples queries.

### ✅ **Solución: FETCH JOIN**

```java
@Query("SELECT s FROM Subscription s " +
       "LEFT JOIN FETCH s.customer c " +
       "LEFT JOIN FETCH s.plan p " +
       "WHERE c.id = :customerId")
List<Subscription> findByCustomerId(@Param("customerId") Long customerId);
```

**Resultado:**

- ❌ Antes: 1 query principal + N queries para customer + N queries para plan
- ✅ Ahora: 1 sola query con JOINs

---

## Problema: JWT token con espacios causa 403 Forbidden

### 🔍 **Causa**

El token JWT copiado del response incluía espacios antes/después causando:

```
Authorization: Bearer  eyJhb...  ← espacios extra
```

### ✅ **Solución**

Usar `.trim()` en el frontend o verificar que el token se envíe sin espacios:

```javascript
const token = response.data.token.trim();
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## 🛠️ **Debugging Tips**

### Ver todos los customers y sus owners

```bash
GET /api/auth/debug/customers
Authorization: Bearer {token}
```

Respuesta:

```json
{
  "total_customers": 3,
  "customers": [
    {
      "customer_id": 1,
      "customer_name": "John Doe",
      "owner_id": 2,
      "owner_username": "john"
    }
  ]
}
```

### Ver información del usuario autenticado

```bash
GET /api/auth/me
Authorization: Bearer {token}
```

Respuesta:

```json
{
  "username": "admin2",
  "authorities": ["ROLE_ADMIN"],
  "authenticated": true
}
```

### Activar logs detallados

En `application.properties`:

```properties
logging.level.com.kruger.kdevbill=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

---

## 📊 **Escenarios de Uso**

### Escenario 1: Usuario normal se registra

```
1. POST /auth/register con username "john"
   ↓
2. Sistema crea User con rol USER
   ↓
3. Sistema auto-crea Customer para john
   ↓
4. john puede crear subscriptions inmediatamente ✅
```

### Escenario 2: Admin se registra

```
1. POST /auth/register con username "admin123"
   ↓
2. Sistema crea User con rol ADMIN
   ↓
3. NO se crea Customer automáticamente
   ↓
4. Admin debe crear customer manualmente con POST /customers
   ↓
5. Admin puede crear subscriptions para ese customer ✅
```

### Escenario 3: Admin crea subscription para otro usuario

```
1. Admin autenticado
   ↓
2. POST /subscriptions con customerId: 5
   ↓
3. Sistema valida que es admin
   ↓
4. Crea subscription para Customer ID: 5 ✅
```

---

## 🚀 **Mejores Prácticas**

1. **Siempre verificar autenticación primero:** Usar `GET /auth/me`
2. **Usuarios USER:** No necesitan crear customer manualmente
3. **Usuarios ADMIN:** Deben crear customer antes de subscriptions
4. **Testing:** Usar endpoint `/debug/customers` para verificar relaciones
5. **Producción:** Remover endpoints de debug antes de deploy

---

## 📝 **Logs de Debugging**

El sistema genera logs detallados para ayudar en troubleshooting:

```
INFO  - === GET MY SUBSCRIPTIONS START ===
INFO  - User: admin2 (ID: 7)
INFO  - Trying Strategy 1: findByOwnerUsername with username: 'admin2'
WARN  - Strategy 1 FAILED: Customer not found by username: 'admin2'
INFO  - Trying Strategy 2: findByOwnerId with ID: 7
WARN  - Strategy 2 FAILED: Customer not found by owner ID: 7
ERROR - ALL STRATEGIES FAILED: No customer found for user: admin2 (ID: 7)
ERROR - Total customers in DB: 3
ERROR -   - Customer ID: 1, Owner ID: 4, Owner Username: admin123
```

Estos logs te permiten identificar:

- ✅ Qué estrategia de búsqueda funciona
- ✅ Qué usuario está autenticado
- ✅ Qué customers existen en la BD
- ✅ Si hay discrepancias en IDs o usernames

---

## 🎓 **Lecciones Aprendidas**

1. **Hibernate comparisons:** Usar `findByOwnerId()` en lugar de `findByOwner()` para evitar problemas de comparación de instancias
2. **FETCH JOIN es crucial:** Previene N+1 queries en relaciones lazy
3. **Auto-creación condicional:** Solo para usuarios USER, no para ADMIN
4. **Mensajes de error claros:** Ayudan a usuarios y developers a entender el problema
5. **Logging extensivo:** Facilita debugging en producción
6. **Triple-strategy lookup:** Múltiples formas de encontrar el mismo recurso incrementa robustez

---

## Problema: Usuarios existentes sin customer profile

### 🔍 **Causa**

Usuarios creados **antes** de implementar la auto-creación de customers no tienen customer profile, causando array vacío en `GET /subscriptions`.

### ✅ **Soluciones Disponibles**

Consulta la guía completa: **[MIGRACION_USUARIOS_LEGACY.md](./MIGRACION_USUARIOS_LEGACY.md)**

#### **Opción 1: Migración automática con Flyway** ⭐ RECOMENDADA

Reinicia la aplicación. Flyway ejecutará automáticamente el script:

```
V2__Create_Missing_Customers.sql
```

#### **Opción 2: Endpoint de migración manual**

```bash
POST /api/auth/admin/migrate-customers
Authorization: Bearer {admin_token}
```

Respuesta:

```json
{
  "total_users_migrated": 3,
  "created_customers": [...]
}
```

#### **Opción 3: Script SQL directo**

```sql
INSERT INTO customers (name, email, user_id, created_at)
SELECT CONCAT(u.username, ' Customer'), u.email, u.id, NOW()
FROM users u
WHERE NOT EXISTS (SELECT 1 FROM customers c WHERE c.user_id = u.id)
AND u.role = 'USER';
```

---

## 📞 **Soporte**

Si encuentras otros problemas:

1. Revisa los logs de la aplicación
2. Verifica la autenticación con `/auth/me`
3. Verifica customers con `/debug/customers`
4. Consulta este documento
5. Revisa la documentación OpenAPI en `/swagger-ui/index.html`
