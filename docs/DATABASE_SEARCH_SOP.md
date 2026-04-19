# 🔍 SOP - High-Performance Database Search

## 🏗️ Core Technologies
- **PostgreSQL**: Primary data store.
- **Extensions**: `unaccent`, `pg_trgm`.

## ⚡ Search Strategies

### 1. Full-Text Search (Lexical)
- **Mechanism**: PostgreSQL `tsvector` and `tsquery`.
- **Implementation**: Uses `SearchVector` property mapped in EF Core.
- **Function**: `EF.Functions.WebSearchToTsQuery("english", term)`.
- **Benefit**: Handles word stemming and linguistic matching.

### 2. Fuzzy Search (Type Tolerance)
- **Mechanism**: Trigrams (`pg_trgm`).
- **Implementation**: Used as a fallback when lexical search doesn't return high-rank results.
- **Function**: `EF.Functions.TrigramsAreSimilar(p.Name, term)`.
- **Optimization**: Supported by a GIN index on the `Name` column.

### 3. Dynamic Attributes (JSONB)
- **Mechanism**: `jsonb` column for storage.
- **Implementation**: Uses `jsonb_path_ops` index for high-speed containment checks.
- **Function**: `EF.Functions.JsonContains(p.DynamicAttributes, jsonFilter)`.
- **Usage**: Perfect for flexible product attributes (Brand, Material, Color) without schema migrations.

## 📈 Ranking and Sorting
- **Priority**: Lexical matches are ranked higher using `SearchVector.Rank()`.
- **Default**: Recent items are shown first if no search term is provided.

---
> [!TIP]
> Always verify that migrations include the necessary SQL commands to create GIN indexes and triggers for `SearchVector`.
