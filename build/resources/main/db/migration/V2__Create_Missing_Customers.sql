-- V2: Crear customers faltantes para usuarios existentes que no tienen customer profile
-- Fecha: 2025-11-06
-- Propósito: Migración de datos para usuarios legacy sin customer profile

-- Insertar customers para todos los usuarios que no tienen uno
INSERT INTO customers (name, email, user_id, created_at)
SELECT 
    CONCAT(u.username, ' Customer') as name,
    u.email,
    u.id as user_id,
    NOW() as created_at
FROM users u
WHERE NOT EXISTS (
    SELECT 1 
    FROM customers c 
    WHERE c.user_id = u.id
)
AND u.role = 'USER';  -- Solo para usuarios normales, no ADMIN

-- Log de resultados
-- Esto creará un customer automático para cada usuario USER que no tenga uno
