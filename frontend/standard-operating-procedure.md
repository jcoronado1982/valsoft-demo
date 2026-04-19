# 🌊 SOP - Frontend (Angular 21)

## 🏗️ Architecture and Principles
- **Framework**: Angular 21 (Zoneless + Signals).
- **Style**: Clean Code & Component-Based Architecture.
- **State**: Intensive use of **Angular Signals** for granular reactivity.
- **UI**: Tailwind CSS + Spartan UI (Headless).

## 🛠️ Development Standards (Solid & Top Tier 2026)
1. **Core/Shared/Features Architecture**:
   - **`src/app/core/`**: Global logic and single-instance injectables (Auth, Interceptors, Telemetry).
   - **`src/app/shared/`**: Reusable UI, Pipes, and generic utilities.
   - **`src/app/features/`**: Isolated business modules. Each feature must have:
     - `components/`: Smart components (with logic).
     - `ui/`: Dumb components (presentational).
     - `data-access/`: Signal Stores and specific API services.
2. **Zoneless & Signals**: Mandatory granular reactivity. `zone.js` prohibited.
3. **Modern Control Flow**: Use of `@if`, `@for`, `@defer`, and `@let`.
4. **Functional API**: Functional Guards and Interceptors.

## 🧪 Testing and Quality
- **Unit Tests**: `bun test` (Vitest).
- **E2E**: `bun x playwright test`.
- **Linter**: `bun x ng lint`.


## 🛰️ Connectivity
- **Backend API**: Defined in environments. Use `withFetch()` in HttpClient.
- **Telemetry**: Instrumented with OpenTelemetry in `telemetry.service.ts`.

## 🤖 Proactive Mandate
You have `bun` and `Angular CLI` installed. If you need to install a package, run a build, or check the linter, **do it yourself**. You have access and permissions to operate on this frontend autonomously.

---
> [!IMPORTANT]
> Read [../CONTEXT_MAP.md](../CONTEXT_MAP.md) to understand the full system flow.
