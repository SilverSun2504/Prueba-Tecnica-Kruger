-- V1__Initial_Schema.sql
-- Este script crea todo el esquema inicial para la aplicación kdevbill

-- 1. Tabla de Usuarios (users)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY, -- CORREGIDO: SERIAL -> BIGSERIAL
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- 2. Tabla de Clientes (customers)
CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY, -- CORREGIDO: SERIAL -> BIGSERIAL
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    
    CONSTRAINT fk_customer_user
        FOREIGN KEY(user_id) 
        REFERENCES users(id)
        ON DELETE RESTRICT
);

-- 3. Tabla de Planes (plans)
CREATE TABLE plans (
    id BIGSERIAL PRIMARY KEY, -- CORREGIDO: SERIAL -> BIGSERIAL
    name VARCHAR(255) NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    billing_cycle VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true
);

-- 4. Tabla de Suscripciones (subscriptions)
CREATE TABLE subscriptions (
    id BIGSERIAL PRIMARY KEY, -- CORREGIDO: SERIAL -> BIGSERIAL
    status VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    next_billing_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    customer_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    
    CONSTRAINT fk_subscription_customer
        FOREIGN KEY(customer_id) 
        REFERENCES customers(id)
        ON DELETE RESTRICT,
        
    CONSTRAINT fk_subscription_plan
        FOREIGN KEY(plan_id) 
        REFERENCES plans(id)
        ON DELETE RESTRICT
);

-- 5. Tabla de Facturas (invoices)
CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY, -- CORREGIDO: SERIAL -> BIGSERIAL
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    due_date DATE NOT NULL,
    issued_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subscription_id BIGINT NOT NULL,
    
    CONSTRAINT fk_invoice_subscription
        FOREIGN KEY(subscription_id) 
        REFERENCES subscriptions(id)
        ON DELETE CASCADE
);

-- 6. Tabla de Pagos (payments)
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY, -- CORREGIDO: SERIAL -> BIGSERIAL
    amount DECIMAL(10, 2) NOT NULL,
    method VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    paid_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reference VARCHAR(255) NOT NULL,
    invoice_id BIGINT NOT NULL,
    
    CONSTRAINT fk_payment_invoice
        FOREIGN KEY(invoice_id) 
        REFERENCES invoices(id)
        ON DELETE RESTRICT
);

-- Creación de índices
CREATE INDEX idx_sub_customer_id ON subscriptions(customer_id);
CREATE INDEX idx_inv_subscription_id ON invoices(subscription_id);
CREATE INDEX idx_pay_invoice_id ON payments(invoice_id);
CREATE INDEX idx_cust_user_id ON customers(user_id);