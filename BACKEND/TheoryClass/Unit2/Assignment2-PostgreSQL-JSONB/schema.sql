-- =============================================================================
-- schema.sql — PostgreSQL JSONB Demonstration Schema & Queries
-- =============================================================================
-- Course: Backend Web Development — Theory Assignment 2
-- Topic: PostgreSQL JSON vs JSONB, GIN Indexing, and Querying
-- =============================================================================

-- 1. Create Demonstration Database (Run manually if needed)
-- CREATE DATABASE coursework_db;

-- 2. Create Products Table with both Structured Columns and JSONB Attributes
DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    -- JSONB column storing dynamic, non-uniform specifications and metadata
    attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Insert Heterogeneous Products (Demonstrating Schema Flexibility)
INSERT INTO products (name, category, price, attributes) VALUES
(
    'Dell XPS 15',
    'Electronics',
    1499.99,
    '{
        "brand": "Dell",
        "specs": {"cpu": "Intel Core i7", "ram_gb": 32, "storage_gb": 1024, "screen": "15.6 OLED"},
        "tags": ["laptop", "ultrabook", "workstation"],
        "warranty_years": 2,
        "in_stock": true
    }'
),
(
    'MacBook Pro 14',
    'Electronics',
    1999.00,
    '{
        "brand": "Apple",
        "specs": {"cpu": "M3 Pro", "ram_gb": 18, "storage_gb": 512, "screen": "14.2 Liquid Retina XDR"},
        "tags": ["laptop", "apple", "pro"],
        "warranty_years": 1,
        "in_stock": true
    }'
),
(
    'Ergonomic Mesh Chair',
    'Furniture',
    349.50,
    '{
        "brand": "HermanMiller",
        "specs": {"material": "Mesh", "weight_capacity_kg": 150, "lumbar_support": true},
        "tags": ["office", "ergonomic", "furniture"],
        "warranty_years": 12,
        "in_stock": false
    }'
),
(
    'Sony WH-1000XM5',
    'Audio',
    398.00,
    '{
        "brand": "Sony",
        "specs": {"battery_hours": 30, "noise_cancelling": true, "bluetooth_version": "5.2"},
        "tags": ["audio", "anc", "headphones"],
        "warranty_years": 1,
        "in_stock": true
    }'
);

-- =============================================================================
-- 4. GIN (Generalized Inverted Index) Indexing
-- =============================================================================
-- Default GIN index with jsonb_ops (supports ?, ?|, ?&, and @> containment)
CREATE INDEX idx_products_attributes_gin ON products USING gin (attributes);

-- Specific Path B-Tree Index for frequent nested lookups (e.g. brand)
CREATE INDEX idx_products_attributes_brand ON products USING btree ((attributes ->> 'brand'));

-- =============================================================================
-- 5. Standard PostgreSQL JSONB Query Demonstrations
-- =============================================================================

-- A. Extract scalar text using ->>
-- SELECT id, name, attributes ->> 'brand' AS brand FROM products;

-- B. Extract nested JSON object using #> and scalar using #>>
-- SELECT id, name, attributes #>> '{specs, cpu}' AS cpu_model FROM products;

-- C. Containment query using @> (Supported by GIN index)
-- Find all products that have the tag "laptop"
-- SELECT id, name, attributes FROM products WHERE attributes @> '{"tags": ["laptop"]}';

-- D. Key existence check using ?
-- SELECT id, name FROM products WHERE attributes ? 'warranty_years';

-- E. Numeric comparison on extracted attribute
-- SELECT id, name, (attributes #>> '{specs, ram_gb}')::int AS ram 
-- FROM products 
-- WHERE (attributes #>> '{specs, ram_gb}')::int >= 32;
