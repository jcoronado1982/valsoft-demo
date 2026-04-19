# 🧪 Standard Testing Procedure - Frontend (Vitest + Bun)

This document describes the configuration and troubleshooting steps for running frontend unit tests in this monorepo.

## 🚀 Core Configuration
To maintain compatibility between **Vitest** and the **Bun** runtime (especially on Linux), the following configuration is mandatory in `vite.config.mts`:

```typescript
// vite.config.mts
export default defineConfig({
  test: {
    environment: 'jsdom',
    pool: 'forks', // ⚠️ CRITICAL: Use 'forks' instead of 'threads' to avoid IPC errors in Bun
    globals: true,
    // ...
  }
});
```

## ⚠️ Troubleshooting: "port.addListener is not a function"
If you encounter this error while running `bun run test`, it means Vitest is trying to use Node.js `worker_threads` which have API mismatches with Bun's implementation of `MessagePort` on some environments.

**Solution:** Ensure `test.pool` is set to `'forks'` (as shown above). This forces Vitest to use child processes, which are fully supported by Bun.

## 📦 Missing Dependencies
If you see errors related to `@angular/build/private`, ensure the following devDependency is installed:
- `@angular/build` (matches your Angular version)

## 🛠️ Execution Commands
Always use the following commands to ensure the correct runtime:

```bash
# Recommended execution
bun run test

# CI/CD / One-time run
bun run test --run
```

## 🤖 For AI Agents (MCP Context)
When asked to debug or implement tests, always verify that `pool: 'forks'` is present in the configuration. If the environment is unstable, you can temporarily fallback to Node.js (via `nvm` or `fnm`) for diagnostic purposes, but the final implementation MUST be compatible with the Bun stack defined in `GOVERNANCE.md`.
