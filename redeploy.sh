#!/bin/bash
set -e

PROJECT_ROOT=$(pwd)
AI_DIR="$PROJECT_ROOT/ai"
BACKEND_DIR="$PROJECT_ROOT/backend/Inventory.API"

echo "🚀 Starting Hybrid Deployment Flow..."

# 1. Clean up old logs (Optional but recommended)
echo "🧹 Cleaning old logs..."
mv backend2.log backend2.log.bak 2>/dev/null || true

# 2. Ensure Database is running
if ! docker ps | grep -q inventory_db; then
    echo "⚠️ inventory_db not running. Starting it..."
    docker start inventory_db
else
    echo "✅ Database container is running."
fi

# 3. Build and Restart AI Worker
echo "🤖 Rebuilding AI Worker Container..."
cd "$AI_DIR"
docker build -t ai-worker .
docker rm -f ai_worker 2>/dev/null || true
docker run -d --name ai_worker -p 50851:50051 --env-file .env --restart always ai-worker
echo "✅ AI Worker restarted."

# 4. Patch Backend Configuration
echo "📝 Patching appsettings.json..."
python3 "$PROJECT_ROOT/scripts/patch_config.py"
echo "✅ Configuration patched."

# 5. Restart Backend Process
echo "📦 Restarting .NET Backend..."
pkill -9 dotnet || true
sleep 2
cd "$PROJECT_ROOT"
nohup dotnet run --project backend/Inventory.API/Inventory.API.csproj --urls http://0.0.0.0:10000 --no-build < /dev/null > backend2.log 2>&1 & disown

echo "✨ Deployment Complete!"
echo "🔍 Monitor logs with: tail -f backend2.log"
