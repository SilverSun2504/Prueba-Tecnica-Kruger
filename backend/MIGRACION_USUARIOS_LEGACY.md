# 🔄 Guía de Migración: Usuarios Legacy sin Customer Profile

## Problema

Los usuarios creados **antes** de implementar la auto-creación de customers no tienen customer profile asociado, causando que `GET /subscriptions` regrese array vacío `[]`.

---

## ✅ Solución 1: Migración Automática con Flyway (RECOMENDADO)

### **Ventajas:**

- ✅ Se ejecuta automáticamente al iniciar la aplicación
- ✅ Es idempotente (no crea duplicados)
- ✅ Queda registrado en el historial de migraciones
- ✅ No requiere intervención manual

### **Implementación:**

Ya se creó el archivo de migración:

```
src/main/resources/db/migration/V2__Create_Missing_Customers.sql
```

### **Cómo funciona:**

1. **Reinicia la aplicación:**

   ```bash
   ./gradlew bootRun
   ```

2. **Flyway detecta automáticamente el nuevo script**

3. **Ejecuta la migración:**

   ```sql
   INSERT INTO customers (name, email, user_id, created_at)
   SELECT
       CONCAT(u.username, ' Customer') as name,
       u.email,
       u.id as user_id,
       NOW() as created_at
   FROM users u
   WHERE NOT EXISTS (
       SELECT 1 FROM customers c WHERE c.user_id = u.id
   )
   AND u.role = 'USER';
   ```

4. **Resultado:**
   - Crea customers para todos los usuarios USER sin customer
   - Los usuarios ADMIN quedan sin customer (deben crearlo manualmente)
   - No crea duplicados

### **Verificar que funcionó:**

```bash
GET /api/auth/debug/customers
Authorization: Bearer {token}
```

Deberías ver un customer por cada usuario USER.

---

## ✅ Solución 2: Endpoint de Migración Manual

### **Ventajas:**

- ✅ Control total sobre cuándo se ejecuta
- ✅ Devuelve reporte detallado de la migración
- ✅ Útil si necesitas ejecutarla varias veces
- ✅ Logs detallados de cada operación

### **Uso:**

1. **Autenticarse como ADMIN:**

   ```bash
   POST /api/auth/login
   {
     "username": "admin2",
     "password": "tu_password"
   }
   ```

2. **Ejecutar migración:**

   ```bash
   POST /api/auth/admin/migrate-customers
   Authorization: Bearer {admin_token}
   ```

3. **Respuesta esperada:**
   ```json
   {
     "total_users_migrated": 3,
     "created_customers": [
       "Created customer for user: john (ID: 5)",
       "Created customer for user: maria (ID: 6)",
       "Created customer for user: pedro (ID: 8)"
     ],
     "message": "Migration completed successfully"
   }
   ```

### **Logs generados:**

```
INFO  - Starting migration: Creating customers for users without customer profile
INFO  - Found 3 users without customer profile
INFO  - Created customer for user: john (ID: 5)
INFO  - Created customer for user: maria (ID: 6)
INFO  - Created customer for user: pedro (ID: 8)
INFO  - Migration completed: 3 customers created
```

### **Seguridad:**

- ⚠️ Solo usuarios con rol `ADMIN` pueden ejecutarlo
- ⚠️ Protegido con `@PreAuthorize("hasRole('ADMIN')")`
- ⚠️ Si un USER intenta ejecutarlo → 403 Forbidden

---

## ✅ Solución 3: Script SQL Manual

### **Ventajas:**

- ✅ Ejecución directa en la base de datos
- ✅ No requiere la aplicación corriendo
- ✅ Útil para ambientes de producción con acceso directo a BD

### **Uso:**

1. **Conectarse a PostgreSQL:**

   ```bash
   psql -h localhost -U kdevbill_user -d kdevbill_db
   ```

2. **Ver usuarios sin customer:**

   ```sql
   SELECT u.id, u.username, u.email, u.role
   FROM users u
   LEFT JOIN customers c ON c.user_id = u.id
   WHERE c.id IS NULL;
   ```

3. **Crear customers para usuarios USER:**

   ```sql
   INSERT INTO customers (name, email, user_id, created_at)
   SELECT
       CONCAT(u.username, ' Customer') as name,
       u.email,
       u.id as user_id,
       NOW() as created_at
   FROM users u
   WHERE NOT EXISTS (
       SELECT 1 FROM customers c WHERE c.user_id = u.id
   )
   AND u.role = 'USER';
   ```

4. **Verificar resultado:**
   ```sql
   SELECT
       u.username,
       u.role,
       c.id as customer_id,
       c.name as customer_name
   FROM users u
   LEFT JOIN customers c ON c.user_id = u.id
   ORDER BY u.id;
   ```

---

## 🎯 Comparación de Soluciones

| Característica       | Flyway (Auto)         | Endpoint Manual    | SQL Directo    |
| -------------------- | --------------------- | ------------------ | -------------- |
| **Ejecución**        | Automática al iniciar | Manual vía API     | Manual vía SQL |
| **Control**          | ⭐⭐                  | ⭐⭐⭐             | ⭐⭐⭐         |
| **Simplicidad**      | ⭐⭐⭐                | ⭐⭐               | ⭐             |
| **Logs detallados**  | ⭐                    | ⭐⭐⭐             | -              |
| **Idempotente**      | ✅                    | ✅                 | ✅             |
| **Recomendado para** | Desarrollo/QA         | Testing/Producción | Emergencias    |

---

## 📊 Casos de Uso

### **Caso 1: Base de datos nueva**

✅ **Usar:** Flyway (Solución 1)

- Se ejecuta automáticamente
- No hay datos legacy

### **Caso 2: Ambiente de desarrollo/testing**

✅ **Usar:** Endpoint Manual (Solución 2)

- Control total sobre cuándo migrar
- Ver reporte detallado
- Ejecutar múltiples veces si es necesario

### **Caso 3: Producción con muchos usuarios**

✅ **Usar:** Flyway (Solución 1) o SQL Directo (Solución 3)

- Flyway si tienes control de deployments
- SQL si necesitas hacerlo fuera de horario

### **Caso 4: Emergencia en producción**

✅ **Usar:** SQL Directo (Solución 3)

- Acceso directo a BD
- No requiere reiniciar aplicación
- Solución inmediata

---

## ⚠️ Consideraciones Importantes

### **1. Usuarios ADMIN**

Los usuarios con rol `ADMIN` **NO** obtienen customer automáticamente porque:

- Un admin puede gestionar múltiples customers
- Es mejor que creen su customer explícitamente
- Evita confusión entre su customer personal vs customers que administran

**Si un ADMIN necesita customer:**

```bash
POST /api/customers
Authorization: Bearer {admin_token}

{
  "name": "Mi Customer Personal",
  "email": "admin@example.com"
}
```

### **2. Email duplicados**

Si un usuario tiene el mismo email que otro customer:

- La migración usará el email del usuario
- PostgreSQL permitirá el duplicado (no hay UNIQUE constraint en customer.email)
- Si quieres evitar duplicados, modifica el script:

```sql
WHERE NOT EXISTS (...)
AND u.role = 'USER'
AND u.email NOT IN (SELECT email FROM customers);  -- Agregar esta línea
```

### **3. Rollback**

Si necesitas deshacer la migración:

```sql
-- Ver customers creados por migración
SELECT * FROM customers WHERE name LIKE '% Customer';

-- Eliminar solo los customers auto-creados (CUIDADO!)
DELETE FROM customers
WHERE name LIKE '% Customer'
AND created_at > '2025-11-06';  -- Ajustar fecha según cuando se ejecutó
```

⚠️ **ADVERTENCIA:** Esto eliminará subscriptions, invoices y payments asociados si tienen CASCADE.

---

## 🧪 Testing

### **1. Crear usuario de prueba sin customer**

```sql
INSERT INTO users (username, email, password, role)
VALUES ('testuser', 'test@example.com', '$2a$10$hash...', 'USER');
```

### **2. Verificar que no tiene customer**

```bash
GET /api/auth/debug/customers
```

No debería aparecer customer para `testuser`.

### **3. Ejecutar migración**

Elegir una de las 3 soluciones.

### **4. Verificar resultado**

```bash
GET /api/auth/debug/customers
```

Ahora debería aparecer customer para `testuser`.

### **5. Verificar que puede crear subscriptions**

```bash
POST /api/subscriptions
Authorization: Bearer {testuser_token}

{
  "planId": 1
}
```

Debería funcionar correctamente.

---

## 📝 Checklist de Migración

- [ ] Backup de la base de datos
- [ ] Ejecutar query de verificación (contar usuarios sin customer)
- [ ] Elegir método de migración (Flyway/API/SQL)
- [ ] Ejecutar migración
- [ ] Verificar logs (si usa Flyway o API)
- [ ] Confirmar que todos los usuarios USER tienen customer
- [ ] Probar `GET /subscriptions` con usuario migrado
- [ ] Documentar usuarios ADMIN que necesitan crear customer manualmente

---

## 🆘 Troubleshooting

### **La migración no se ejecuta**

**Flyway:**

- Verificar que el archivo esté en `src/main/resources/db/migration/`
- Verificar que el nombre empiece con `V2__`
- Reiniciar la aplicación
- Ver tabla `flyway_schema_history` en la BD

**Endpoint:**

- Verificar que estás autenticado como ADMIN
- Ver logs de la aplicación
- Verificar que el servicio está compilado correctamente

### **Se crearon duplicados**

```sql
-- Ver duplicados
SELECT user_id, COUNT(*)
FROM customers
GROUP BY user_id
HAVING COUNT(*) > 1;

-- Eliminar duplicados (mantener el más reciente)
DELETE FROM customers
WHERE id NOT IN (
    SELECT MAX(id) FROM customers GROUP BY user_id
);
```

### **GET /subscriptions sigue regresando vacío**

1. Verificar con `/auth/debug/customers` que el customer existe
2. Verificar que el `user_id` del customer coincide con tu user
3. Ver logs cuando ejecutas GET /subscriptions
4. Verificar que hay subscriptions para ese customer:

```sql
SELECT * FROM subscriptions WHERE customer_id = X;
```

---

## 💡 Recomendación Final

**Para tu caso específico:**

1. ✅ **Reinicia la aplicación** → Flyway ejecutará V2 automáticamente
2. ✅ **Verifica** con `/auth/debug/customers` que se crearon los customers
3. ✅ **Prueba** `GET /subscriptions` con cada usuario
4. ✅ **Documenta** qué usuarios ADMIN necesitan crear customer manualmente

**La migración con Flyway (Solución 1) es la mejor opción porque:**

- No requiere intervención manual
- Se ejecuta una sola vez
- Queda registrada en el historial
- Es reproducible en otros ambientes (dev, qa, prod)
