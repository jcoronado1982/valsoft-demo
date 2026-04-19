# Repository Governance and Versioning 🏛️🚀

This document defines the mandatory rules for managing branches, environments, and versions of the **Invoice** Monorepo. Compliance with these standards is essential for stability and continuous integration (CI/CD).

## 1. Environment Hierarchy (Long-Lived Branches)
All environment branches MUST be in **lowercase**.

| Branch | Environment | Description | Stability Level |
| :--- | :--- | :--- | :--- |
| `main` | **Production** | Final stable version used by the client. | 100% (Protected) |
| `qa` | **Quality** | Space for E2E testing and user validation. | 90% (Pre-release) |
| `develop` | **Development** | Daily integration branch for new features. | 70% (Functional) |

## 2. Temporary Branches (Daily Life Cycle)
Working branches are ephemeral: they are born for a task and deleted after the merge.
**GOLDEN RULE:** Always in lowercase and using the format `type/author-description`.

| Type | Nomenclature | Example | Purpose |
| :--- | :--- | :--- | :--- |
| **Feature** | `feature/[name]-[task]` | `feature/jcoronado-auth-google` | New features or improvements. |
| **Bugfix** | `fix/[name]-[error]` | `fix/jcoronado-login-crash` | Error correction in `develop` or `qa`. |
| **Hotfix** | `hotfix/[urgent-error]` | `hotfix/security-patch-v1` | Critical patches directly to `main`. |
| **Personal** | `user/[name]/[idea]` | `user/jcoronado/experiment-ui` | Personal testing and prototypes. |

## 3. Code Promotion Flow (The Path to Main)
1. **Development**: Code is born in a `feature/` or `fix/` branch.
2. **Integration**: Merged into `develop` after passing unit tests.
3. **Validation**: From `develop`, it is promoted to `qa` for integral testing.
4. **Release**: From `qa`, it is promoted to `main` with final approval.

## 4. Versioning Strategy (SemVer)
Each time the code reaches `main`, a tag (Tag) must be created:

- **vMAJOR.MINOR.PATCH** (Example: `v1.2.3`)
  - **MAJOR**: Incompatible changes or major redesigns.
  - **MINOR**: New functionality (does not break anything previous).
  - **PATCH**: Minor error corrections.

## 5. Instructions for AI and Developers
- **Check the SOP**: Before creating a branch, verify that the code complies with C# or Angular standards.
- **Atomic Commit**: Prefer small, descriptive commits that explain the "why" and not just the "what".
- **Cleanup**: Delete local branches after the Pull Request has been accepted on the server.

## 6. Global Engineering Standards 2026

To guarantee the interoperability and maintainability of the Monorepo, the following transversal standards are applied:

### 6.1 Unified Observability (OpenTelemetry)
- **MANDATORY**: All services (Frontend, Backend C#, Python Worker) must be instrumented with **OpenTelemetry**.
- **Traceability**: Traces must be propagated from end to end using the W3C standard (`traceparent`).
- **Verification**: Before finishing a task, it must be verified that the traces flow correctly between services.

### 6.2 Package and Environment Management
- **Frontend**: Exclusive use of **bun** (fast and efficient).
- **Backend C#**: Use of **dotnet CLI** with .NET 9.
- **Python Worker**: Exclusive use of **uv** (the gold standard for 2026 for its speed and deterministic lockfiles).

### 6.3 Predictable Architecture
- **Hexagonal Architecture** is prioritized in complex microservices to decouple business logic from technical details (AI, DB, API).

### 6.4 Language Policy
- **MANDATORY**: All source code (variable names, functions, classes, comments), commit messages, pull requests, and documentation (READMEs, SOPs, architectural diagrams) MUST be written exclusively in **English**.
- **Reasoning**: This ensures global accessibility, consistent integration with agentic coding AI models, and alignment with professional top-tier 2026 engineering standards.

---
> [!IMPORTANT]
> Never work directly on `main`, `qa`, or `develop`. Software quality depends on this isolation.
> Any deviation from these standards must be justified and documented.
