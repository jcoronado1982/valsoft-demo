#!/bin/bash
set -e

echo "🚀 Starting launch.lat setup..."

# 1. Update and check dependencies
echo "🔍 Checking dependencies..."
if ! command -v dotnet &> /dev/null || [[ $(dotnet --version) != 9.* ]]; then
    echo "📦 Installing .NET 9..."
    wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh
    chmod +x dotnet-install.sh
    ./dotnet-install.sh --version latest --channel 9.0
    export DOTNET_ROOT=$HOME/.dotnet
    export PATH=$PATH:$HOME/.dotnet:$HOME/.dotnet/tools
    echo 'export DOTNET_ROOT=$HOME/.dotnet' >> ~/.bashrc
    echo 'export PATH=$PATH:$HOME/.dotnet:$HOME/.dotnet/tools' >> ~/.bashrc
fi

if ! command -v python3.13 &> /dev/null; then
    echo "📦 Installing Python 3.13 via deadsnakes PPA..."
    sudo add-apt-repository ppa:deadsnakes/ppa -y
    sudo apt update
    sudo apt install python3.13 python3.13-venv -y
fi

# 2. Infrastructure (DB)
echo "🐘 Starting local DB..."
cd infra
sudo docker-compose up -d
cd ..

# 3. AI Worker (Python)
echo "🐍 Setting up AI Worker..."
cd ai-worker-python
python3.13 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Generate gRPC code
mkdir -p generated
python -m grpc_tools.protoc -I../proto --python_out=./generated --grpc_python_out=./generated ../proto/ai_service.proto
cd ..

# 4. Backend (.NET)
echo "🛠️ Setting up Backend..."
mkdir -p backend-csharp
cd backend-csharp
if [ ! -f "backend-csharp.csproj" ]; then
    dotnet new webapi -n backend-csharp --use-program-main -o .
    dotnet add package Grpc.Net.Client
    dotnet add package Google.Protobuf
    dotnet add package Grpc.Tools
fi
# Install EF Core packages for PostgreSQL
echo "🐘 Installing Entity Framework Core + PostgreSQL driver..."
dotnet add package Microsoft.EntityFrameworkCore --version 9.0.6
dotnet add package Microsoft.EntityFrameworkCore.Design --version 9.0.6
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 9.0.4
# Install dotnet-ef CLI tool for migrations
dotnet tool install --global dotnet-ef 2>/dev/null || dotnet tool update --global dotnet-ef
dotnet restore
cd ..

if ! command -v bun &> /dev/null; then
    echo "📦 Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
    echo 'export BUN_INSTALL="$HOME/.bun"' >> ~/.bashrc
    echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.bashrc
fi

# 5. Frontend (Angular)
echo "🅰️ Setting up Frontend..."
if [ ! -d "frontend" ] || [ ! -f "frontend/package.json" ]; then
    npx -y @angular/cli@19 new frontend --routing --style css --skip-git --directory frontend --ssr false
fi
cd frontend
# Install Bun verified, but ensured here
bun install
# Install Tailwind and Spartan Base
echo "🎨 Installing Tailwind CSS & Spartan Utilities..."
bun add -d tailwindcss@^3 postcss autoprefixer tailwindcss-animate
bun add clsx tailwind-merge
bunx tailwindcss init -p --ts

# Add Spartan Components via CLI
echo "🧩 Initializing Spartan UI and adding components (Headless)..."
bun add -d @spartan-ng/cli
bun run ng g @spartan-ng/cli:init || true
bun run ng g @spartan-ng/cli:ui input || true
bun run ng g @spartan-ng/cli:ui button || true
cd ..

echo "✅ Setup complete! Use 'make dev' to start the environment."
