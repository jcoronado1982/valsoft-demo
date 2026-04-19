# 🤖 AI Development Guidelines

This document defines the strict standards that any AI must follow when generating or modifying code in this project. **"Placeholder" code is not accepted; every change must respect this architecture.**

## 1. Mandatory Quality Stack (2026 Standards)

The project uses a "Total Quality" ecosystem based on **Bun**. Before delivering any task, the AI must validate:

| Tool | Purpose | Verification Command |
| :--- | :--- | :--- |
| **Vitest** | Unit Tests (Angular + AnalogJS) | `bun run test` |
| **Playwright** | End-to-End (E2E) Tests | `bun run e2e` |
| **Storybook** | Isolated Component Development | `bun run storybook` |
| **OpenTelemetry** | End-to-end observability | Trace verification in console |
| **ESLint** | Static Analysis and Angular Rules | `bun run lint` |
| **Prettier** | Consistent Formatting | `bun run format` |

## 2. Architecture and Clean Code Principles

### ❌ Strict Prohibitions
- **DO NOT USE `any`**: Everything must be typed. If an API response is unknown, define an `interface` or a `type`.
  - *Correct Example*: `http.get<{found: boolean, data: Invoice}>(...)` instead of `http.get<any>(...)`.
- **DO NOT duplicate logic**: If the same logic (e.g., PDF generation, tax validation) is used in 2 or more components, it **MUST** go to a `Service`.
- **NO Hardcoded URLs**: Prohibited to use `localhost:5092` or similar. Always use `environment.apiUrl`.
- **NO console.log**: Remove debugging logs before finishing. Use a formal logging system if necessary.

### ✅ Design Mandates (SOLID)
- **Single Responsibility (SRP)**: Components only handle UI and events. Business logic and HTTP calls go in **Services**.
- **Angular Signals**: Use of direct variables for mutable state is prohibited. Use `signal`, `computed`, and `toSignal`.
- **Third-Party Typing**: For libraries without clear types (e.g., Google GIS, jsPDF extensions), define local interfaces or use `Record<string, unknown>` instead of `any`.
- **Dependency Injection**: Preferably use `inject()`.
- **OpenTelemetry Awareness**: When adding new API services, ensure that calls (fetch/XHR) are captured by the telemetry system and propagate the `trace_parent`.
- **Accessibility (A11y)**: Strictly comply with `@angular-eslint/template/label-has-associated-control`. Each input must have its `label` linked by `id`/`for`.

## 3. Testing and Documentation Guide

Any new functionality **MUST** include:
1.  **Spec file (`.spec.ts`)**: Unit tests with Vitest. Do not leave empty methods; add comments or mocks.
2.  **Stories file (`.stories.ts`)**: Components must be viewable in Storybook.
3.  **CSS**: Use Tailwind CSS + Spartan UI. Maintain the premium and dark design (`class="dark"`).

## 4. AI Workflow
1.  **Research**: Read `environments/environment.ts` and models before coding.
2.  **Implementation**: Follow this document.
3.  **Refactoring**: If you see an `any` or a hardcoded URL in a file you are touching, **FIX IT**.
4.  **Verification**: Run the linter and tests. If the linter fails due to Prettier in files like `index.html`, report it but ensure the `.ts` code is flawless.

---
*This document is the code law in this repository. Ignoring it is introducing technical debt.*
