var builder = DistributedApplication.CreateBuilder(args);

// 🤖 AI Worker (Live Script for Development)
var aiWorker = builder.AddPythonApp("ai", "../ai", "worker.py", "gemini_venv")
    .WithEndpoint(targetPort: 50051, name: "grpc", scheme: "tcp");

// 🐘 Database (PostgreSQL) - Managed by Aspire
var pgPassword = builder.AddParameter("pgpassword", secret: true);
var postgres = builder.AddPostgres("postgres", password: pgPassword)
    .WithDataVolume("inventory-db-data");

var db = postgres.AddDatabase("inventorydb");

// 📦 Inventory API (Backend)
var inventoryApi = builder.AddProject<Projects.Inventory_API>("backend")
    .WithReference(db)
    .WithReference(aiWorker.GetEndpoint("grpc"));

// 🌐 Frontend (Angular)
var frontend = builder.AddExecutable("frontend", "bun", "../frontend", "run", "start")
    .WithReference(inventoryApi.GetEndpoint("http"))
    .WithHttpEndpoint(env: "PORT", port: 4200)
    .WithExternalHttpEndpoints();

// 🧠 Model Context Protocol (MCP) Server
var mcpServer = builder.AddExecutable("mcp", "../ai/.venv/bin/python", "../ai", "src/mcp/sops_server.py")
    .WithReference(inventoryApi.GetEndpoint("http"));

inventoryApi.WithHttpHealthCheck("/health")
            .WithHttpHealthCheck("/alive");

frontend.WithHttpHealthCheck("/");

builder.Build().Run();
