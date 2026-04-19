# Ensure local installations are in PATH
export PATH := $(HOME)/.dotnet:$(HOME)/.dotnet/tools:$(HOME)/.bun/bin:$(PATH)
export DOTNET_ROOT := $(HOME)/.dotnet

.PHONY: setup dev stop db db-stop

setup:
	chmod +x setup.sh
	./setup.sh

db:
	@echo "🐘 Starting PostgreSQL..."
	sudo docker-compose -f infra/docker-compose.yml up -d

db-stop:
	@echo "🐘 Stopping PostgreSQL..."
	sudo docker-compose -f infra/docker-compose.yml down

stop:
	@echo "Stopping all services and clearing ports..."
	-sudo fuser -k 5092/tcp 5165/tcp 50051/tcp 4200/tcp 20172/tcp 19004/tcp 16147/tcp || true
	-sudo pkill -f "base.AppHost" || true

dev: 
	@echo "🚀 Starting base with .NET Aspire (Linux Profile)..."
	$(HOME)/.dotnet/dotnet run --project base.AppHost/base.AppHost.csproj --launch-profile http

dev-legacy: db
	@echo "Cleaning up previous processes..."
	$(MAKE) stop
	@echo "Starting all services (Legacy Mode)..."
	(cd ai-worker-python && . venv/bin/activate && python worker.py) & \
	(cd backend-csharp && dotnet watch run) & \
	(cd frontend && bun x ng serve) & \
	wait

