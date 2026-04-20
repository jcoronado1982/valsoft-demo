# 🚀 End-to-End Production Deployment Guide

This guide details the complete flow for deploying the Valsoft Inventory Platform to the Google Cloud VM.

## 1. Frontend Build & Deploy (Angular)
The frontend is served as static files by NGINX.

1. **Build locally**:
   ```bash
   cd frontend
   /home/jcoronado/.bun/bin/bun run build
   ```
2. **Transfer to VM**:
   ```bash
   # Upload to tmp first due to permissions
   gcloud compute scp --recurse dist/frontend/browser/* demo:/tmp/frontend_build/
   ```
3. **Deploy on VM**:
   ```bash
   gcloud compute ssh demo --command "sudo rm -rf /var/www/valsoft/* && sudo cp -r /tmp/frontend_build/* /var/www/valsoft/ && sudo chown -R www-data:www-data /var/www/valsoft"
   ```

## 2. Backend Build & Deploy (.NET 9)
The backend runs in a Docker container using the `--network=host` mode.

1. **Publish locally**:
   ```bash
   dotnet publish backend/Inventory.API/Inventory.API.csproj -c Release -o ./publish
   ```
2. **Transfer & Build on VM**:
   - Tar the publish folder: `tar -czf backend.tar.gz -C publish .`
   - SCP to VM: `gcloud compute scp backend.tar.gz demo:~/`
   - SSH and Build image: `docker build -t backend:latest .`
3. **Run Container**:
   Ensure all environment variables are passed:
   ```bash
   docker run -d --name backend --network=host \
     -e ASPNETCORE_HTTP_PORTS=10000 \
     -e ConnectionStrings__inventorydb='...' \
     -e Jwt__Key='[32+ characters]' \
     -e Google__ClientId='...' \
     backend:latest
   ```

---

## 🛠️ Known Issues & Solutions

### "Missing Styles" in production
- **Symptom**: Site loads with browser default fonts/styles.
- **Cause**: CSP blocks `script-src 'unsafe-inline'`.
- **Fix**: Update `index.html` to allow `unsafe-inline` for both scripts and styles.

### "401 Unauthorized" on Login
- **Symptom**: Backend returns 401 when trying to login with Google.
- **Cause**: JWT Key too short or Google Client ID mismatch.
- **Fix**: Ensure `Jwt__Key` is >= 32 chars and `Google__ClientId` matches the one in the GCP Console.

### "Pending Model Changes" blockage
- **Symptom**: Backend container stops or fails migrations on startup.
- **Cause**: .NET 9 strict model validation.
- **Fix**: Suppress `RelationalEventId.PendingModelChangesWarning` in `Program.cs` for Production environment.
