# ⚙️ SOP - Backend (.NET 9)

## 🏗️ Architecture and Principles
- **Framework**: .NET 9.
- **Style**: **Clean Architecture** (Domain/Infrastructure) + **Vertical Slices** (API Features).
- **Communication**: REST for Web Frontend, **gRPC** for AI Worker communication.
- **MediatR**: Used for decoupling endpoints from business logic via Requests and Handlers.

## 💻 Engineering Standards
1. **Vertical Slices**: Each use case lives in `Features/[FeatureName]`. It should contain the `Endpoint` and the `Handler`.
2. **Lean Entities**: Keep domain entities in `Inventory.Domain`. Logic should be in the entities (Domain-Driven Design) where appropriate.
3. **Repository Pattern Alternative**: Use EF Core `DbSet` directly in Handlers for simplicity unless complex abstraction is truly required.
4. **Validation**: Use MediatR behaviors or explicit validation in handlers.

## 🔍 Database & Persistence
1. **EF Core**: Use LINQ for all queries to ensure parameterization and prevent SQL Injection.
2. **Performance**: Use `.AsNoTracking()` for read-only queries.
3. **PostgreSQL Extensions**: Leverage `EF.Functions` for specialized search (Trigrams, FTS).

## 🧪 Testing and Quality
- **Integration Tests**: Located in `Inventory.API.IntegrationTests`. Uses `WebApplicationFactory` and a real/containerized database.
- **Standards**: All new features **MUST** include an integration test covering the happy path.

## 🤖 Proactive Mandate
You have access to the `dotnet` CLI (via `/home/jcoronado/.dotnet/dotnet`). If you need to add a migration, run a build, or add a NuGet package, **do it yourself**.

---
> [!IMPORTANT]
> Read [../CONTEXT_MAP.md](../CONTEXT_MAP.md) to understand how the backend integrates with the AI Worker via gRPC.
