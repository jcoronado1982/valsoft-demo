-- SQL Schema for Inventory Database
-- This file contains the complete structure for exact replication including advanced search features.

-- 1. Prerequisites (Extensions)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Unique index for categories
CREATE UNIQUE INDEX IF NOT EXISTS "IX_categories_name" ON categories (name);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    quantity INTEGER DEFAULT 0,
    price NUMERIC(15,2) DEFAULT 0,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    dynamic_attributes JSONB DEFAULT '{}'::jsonb,
    search_vector tsvector,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Advanced Search Indexes (PostgreSQL GIN)

-- Full-Text Search Vector Index
CREATE INDEX IF NOT EXISTS "IX_products_search_vector" ON products USING GIN (search_vector);

-- Trigram Index for Fuzzy Matching (Handle typos)
CREATE INDEX IF NOT EXISTS "IX_products_name_trgm" ON products USING GIN (name gin_trgm_ops);

-- JSONB Path Index for fast dynamic attribute querying
CREATE INDEX IF NOT EXISTS "idx_products_jsonb_fast" ON products USING GIN (dynamic_attributes jsonb_path_ops);

-- 5. Automatic Search Vector Logic (Trigger & Function)

-- Function to update the search_vector with weights and normalized text
-- Weight 'A': Product Name (High Priority)
-- Weight 'B': JSON Attributes (Lower Priority)
CREATE OR REPLACE FUNCTION products_search_trigger() RETURNS trigger AS $$
BEGIN
  new.search_vector :=
    setweight(to_tsvector('spanish', unaccent(coalesce(new.name,''))), 'A') ||
    setweight(to_tsvector('spanish', unaccent(coalesce(new.dynamic_attributes::text,''))), 'B');
  RETURN new;
END
$$ LANGUAGE plpgsql;

-- Trigger binding
DROP TRIGGER IF EXISTS tsvectorupdate ON products;
CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
    ON products FOR EACH ROW EXECUTE FUNCTION products_search_trigger();
