-- Migration: Normalize category names to English
-- This script updates existing Spanish category names to their English equivalents.

UPDATE categories SET name = 'Smartphones' WHERE name = 'CELULARES' OR name = 'Celulares' OR name = 'Mobile Phones';
UPDATE categories SET name = 'Televisions' WHERE name = 'TELEVISORES' OR name = 'Televisores';
UPDATE categories SET name = 'Home' WHERE name = 'HOGAR' OR name = 'Hogar';
UPDATE categories SET name = 'Audio' WHERE name = 'AUDIO' OR name = 'Audio';
UPDATE categories SET name = 'Photography' WHERE name = 'FOTOGRAFÍA' OR name = 'Fotografía' OR name = 'Cámaras';
UPDATE categories SET name = 'Clothing' WHERE name = 'ROPA' OR name = 'Ropa';
UPDATE categories SET name = 'Tools' WHERE name = 'HERRAMIENTAS' OR name = 'Herramientas';
UPDATE categories SET name = 'Computing' WHERE name = 'COMPUTACIÓN' OR name = 'Computación';
UPDATE categories SET name = 'Others' WHERE name = 'OTROS' OR name = 'Otros';

-- Ensure all names are in title case or as specified in AI examples
UPDATE categories SET name = INITCAP(name);
