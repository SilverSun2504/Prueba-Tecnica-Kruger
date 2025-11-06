-- V3: Generar facturas iniciales para subscripciones existentes sin factura
-- Fecha: 2025-11-06
-- Propósito: Crear facturas para subscriptions que fueron creadas antes de implementar la auto-generación

-- Insertar facturas para subscripciones ACTIVAS que no tienen factura
INSERT INTO invoices (subscription_id, amount, status, issued_at, due_date)
SELECT 
    s.id as subscription_id,
    p.price as amount,
    'OPEN' as status,
    NOW() as issued_at,
    CURRENT_DATE + INTERVAL '7 days' as due_date
FROM subscriptions s
INNER JOIN plans p ON s.plan_id = p.id
WHERE s.status = 'ACTIVE'
AND NOT EXISTS (
    SELECT 1 
    FROM invoices i 
    WHERE i.subscription_id = s.id
);

-- Log de resultados
-- Esto creará una factura inicial para cada subscription activa que no tenga factura
