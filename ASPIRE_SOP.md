# 🛠️ SOP - .NET Aspire on Linux (Ubuntu)

This project has been migrated to **.NET Aspire** for microservices orchestration. Due to the particularities of Linux regarding IPv6 and development SSL certificates, these guidelines must be followed.

## 🚀 How to Start the Project
To start the Frontend, Backend, and AI Worker simultaneously with the monitoring Dashboard:

```bash
/home/jcoronado/.dotnet/dotnet run --project base.AppHost/base.AppHost.csproj --launch-profile http
```

## ⚠️ Critical Configuration for Linux
The following configurations have been applied in `base.AppHost/Properties/launchSettings.json` to ensure the Dashboard works on Ubuntu:

1.  **Use of 127.0.0.1:** Explicit IP is used instead of `localhost` to prevent the system from trying to resolve via IPv6, which causes the Dashboard to hang on "Loading...".
2.  **HTTP Profile:** It is recommended to use the `--launch-profile http` profile. This avoids issues with .NET development SSL certificates that do not always integrate well with browsers on Linux.
3.  **Unsecured Transport:** The following environment variables have been enabled in the `http` profile:
    *   `ASPIRE_ALLOW_UNSECURED_TRANSPORT: "true"`: Allows internal communication without TLS.
    *   `DOTNET_DASHBOARD_UNSECURED_ALLOW_ANONYMOUS: "true"`: Allows viewing the dashboard without authentication tokens (local development only).

## 📊 Orchestrated Components
*   **ai-worker**: Python (gRPC) on port 50051. Uses local venv.
*   **backend**: C# Web API on port 5092 (or dynamically assigned).
*   **frontend**: Angular (NPM) on port 4200.

## 🔍 Troubleshooting
If the Dashboard shows an infinite spinner or says "Loading...":
1.  Ensure there are no hung processes: `lsof -i :18145,16147,5092,4200 -t | xargs -r kill -9`.
2.  Verify that you are using the `http` profile.
3.  Check that Docker is running if container resources (DBs, Redis) are added.
