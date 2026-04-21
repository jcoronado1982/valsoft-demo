# Hybrid Deployment Guide (Manual Process)

This guide documents the deployment process required to standardize system operations on this Google Cloud server, avoiding the automatic Aspire process which has network resolution issues under this configuration.

## Architecture Overview
- **Database (PostgreSQL):** Docker container (`inventory_db`).
- **AI Worker (Python):** Docker container (`ai_worker`). Mapped port: **50851**.
- **Backend (.NET 9):** Running on the Host (non-Docker) for easier access and debugging. Port: **10000**.

## How to Perform a New Deployment or Restart

The process has been automated via the `redeploy.sh` script. Run it from the project root:

```bash
./redeploy.sh
```

### What does this script do?
1. Verifies that the database container is running.
2. Rebuilds the AI Worker image and starts it with the correct port mapping (`50851 -> 50051`).
3. **Patches Configuration:** Runs a Python script (`scripts/patch_config.py`) that manually injects the gRPC service URL (`127.0.0.1:50851`) and fixes outdated database IPs.
4. Restarts the `.net` process in the background.

## Critical Configuration Files

If you decide to make manual changes, keep in mind:
- **appsettings.json:** Must have the `services:ai:grpc:0` section pointing to `http://127.0.0.1:50851`.
- **Database Connection:** Must use `Host=localhost` and the current confirmed password (`password`).

## Monitoring
- **Backend Logs:** `tail -f backend2.log`
- **AI Logs:** `docker logs -f ai_worker`
