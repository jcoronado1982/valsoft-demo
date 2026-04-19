# 📦 Inventory API - Vertical Slices Architecture

This project implements the heart of the Inventory domain following a hybrid architecture of **Clean Architecture** (Domain and Infrastructure layers) and **Vertical Slices** (API layers organized by functionality).

## 📋 Minimum Features

- **Inventory Management**: Add, edit, and delete inventory items (name, quantity, category, and other details).
- **Status Tracking**: Mark items as "in stock," "low stock," "ordered," or "discontinued."
- **Search**: Find items by name, category, stock status, or other attributes.

## 🏗️ Layer Structure

### 1. Inventory.Domain (`src/Inventory.Domain`)
Contains business entities and golden rules. It is a pure library without external dependencies.
- **Entities**: `Product.cs`, `Category.cs`.

### 2. Inventory.Infrastructure (`src/Inventory.Infrastructure`)
Implements technical details and persistence.
- **Persistence**: `InventoryDbContext.cs` (PostgreSQL via EF Core).
- **ExternalServices**: gRPC clients and AI APIs (e.g., Vertex AI).

### 3. Inventory.API (`src/Inventory.API`)
Organized into **Features** (Vertical Slices), where each folder is a self-contained use case.
- **Shared**: Common middlewares and interceptors.
- **Features/AddProduct**: Endpoint, Command, and Handler for creating products.
- **Features/SearchProducts**: Product search.

## 🚀 Technologies

- **.NET 9 + Aspire**: Orchestration and observability.
- **MediatR**: Decoupling of Endpoints and Logic.
- **EF Core (Npgsql)**: Data access.
- **Scalar**: Premium API documentation (`/scalar/v1`).

## 🛠️ Local Execution

This project is automatically started via the **AppHost**.
To access interactive documentation: `http://localhost:<assigned-port>/scalar/v1`.
