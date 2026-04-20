import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interface definition to comply with "No any" standard
interface TechSection {
  id: string;
  title: string;
  description: string;
  codeSnippet?: string;
  testingCommand?: string;
  testingLocation?: string;
  testingTags?: string[];
  tags: string[];
}

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentationComponent {
  // Local state using Signals
  readonly selectedSectionId = signal<string>('architecture');

  // Technical data extracted from project architecture files
  readonly sections = signal<TechSection[]>([
    {
      id: 'architecture',
      title: 'System Architecture',
      description:
        'The inventory system operates under a hybrid, high-concurrency microservices architecture. ' +
        'Lifecycle management, service discovery, and environment variables are centralized via .NET Aspire, ' +
        'acting as the primary control plane and orchestrator. ' +
        'The entire ecosystem is containerized with Docker Engine to ensure environment parity. ' +
        'The four key components are: Frontend Core (Angular 21 Zoneless), API Gateway (.NET 9 Vertical Slices), ' +
        'AI Worker Engine (Python 3.13 + gRPC), and Optimized Storage (PostgreSQL 16 with JSONB + GIN Index).',
      testingCommand: 'dotnet test backend/Inventory.API.IntegrationTests/Inventory.API.IntegrationTests.csproj',
      testingLocation: 'Full Repository (Multi-layer Integration)',
      testingTags: ['xUnit', 'Testcontainers', 'Vitest', 'Pytest'],
      codeSnippet:
        `// ai_worker.proto — gRPC contract between .NET and Python
service AiWorker {
  rpc ExtractData (RawTextRequest) returns (StructuredJsonResponse);
}

message RawTextRequest       { string payload   = 1; }
message StructuredJsonResponse { string json_data = 1; }`,
      tags: ['.NET Aspire', 'Docker', 'Microservices', 'gRPC', 'Angular 21', 'PostgreSQL 16']
    },
    {
      id: 'frontend',
      title: 'Frontend (Angular 21)',
      description:
        'Ultra-low latency SPA designed under the Perfect Metrics standard (Core Web Vitals). ' +
        'Execution environment managed entirely by Bun, optimizing installation and build processes over Node.js. ' +
        'Zoneless Architecture: The application dispenses with zone.js to achieve surgical change detection based on Signals, reducing processing overhead. ' +
        'Reactive State: Strict use of signal() for local state, computed() for derived logic, and toSignal() for RxJS integration. ' +
        'UI Stack: Tailwind CSS with Spartan UI (Helm) under a Premium Dark aesthetic. ' +
        'Development Standard: 3-file rule (.ts, .html, .css) with dependency injection via inject(). ' +
        'Communication: Agnostic network layer using REST/JSON, functional interceptors for security (JWT) and observability (OpenTelemetry/trace_parent).',
      testingCommand: 'cd frontend && bun run test',
      testingLocation: 'frontend/src/**/*.spec.ts',
      testingTags: ['Vitest', 'JSDOM', 'Bun'],
      codeSnippet:
        `// app.config.ts — Core Configuration
export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(), // Zoneless Performance
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, traceInterceptor])
    )
  ]
};

// Standard Component with Signals
export class InventoryComponent {
  private service = inject(InventoryService);
  items = this.service.items; // Signal-based state
}`,
      tags: ['Angular 21', 'Zoneless', 'Signals', 'Tailwind CSS', 'Spartan UI', 'Bun', 'OpenTelemetry']
    },
    {
      id: 'backend',
      title: 'Backend Core (.NET)',
      description:
        'Transactional core built on .NET 9, evolving Clean Architecture principles through Vertical Slices. ' +
        'Each functionality is an autonomous module within the Features/ folder, encapsulating its Request, Handler, and Endpoint. ' +
        'Minimal APIs act solely as a lightweight HTTP bridge, keeping the web layer free of business rules. ' +
        'Security: OAuth2 implementation validating Google IdTokens and issuing locally signed JWTs with Role-Based Access Control (RBAC) claims. ' +
        'AI Interop: High-performance communication with the Python Worker via gRPC (HTTP/2 + Protocol Buffers). ' +
        'ORM: Entity Framework Core 9 usage with DbSet injected directly into Handlers (avoiding bureaucratic generic repositories) and a strict rule of using .AsNoTracking() for read queries to maximize performance.',
      testingCommand: 'dotnet test backend/Inventory.API.IntegrationTests/Inventory.API.IntegrationTests.csproj',
      testingLocation: 'backend/Inventory.API.IntegrationTests/',
      testingTags: ['xUnit', 'Testcontainers', 'PostgreSQL 17'],
      codeSnippet:
        `// Features/AddProduct/AddProductHandler.cs
public class AddProductHandler(InventoryDbContext db, AiClient ai)
    : IRequestHandler<AddProductCommand, AddProductResponse>
{
    public async Task<AddProductResponse> Handle(
        AddProductCommand cmd, CancellationToken ct)
    {
        // Low-latency gRPC communication
        var structured = await ai.ExtractAsync(cmd.RawText, ct);
        
        // Mapping and persistence with EF Core
        db.Products.Add(structured.ToEntity());
        await db.SaveChangesAsync(ct);
        
        return new AddProductResponse(structured.Id);
    }
}`,
      tags: ['.NET 9', 'Vertical Slices', 'Minimal APIs', 'MediatR', 'OAuth2', 'JWT', 'EF Core 9', 'gRPC Client']
    },
    {
      id: 'db',
      title: 'Database & High-Performance Search',
      description:
        'Hybrid storage built on PostgreSQL 16+. ' +
        'Combines a strict relational model for core transactions with schemaless JSONB storage for dynamic attributes extracted by AI. ' +
        'The schema is optimized as a high-concurrency search engine capable of scanning millions of records in milliseconds. ' +
        'Prevents query blocking using GIN indexing (Generalized Inverted Index) and native extensions: ' +
        'Fuzzy Search with trigrams (pg_trgm) for typo tolerance, and Full-Text Search (FTS) with search vectors calculated by real-time Triggers. ' +
        'Dynamic property searches utilize the containment operator (@>) over jsonb_path_ops indexes.',
      codeSnippet:
        `-- 1. GIN Index for typo tolerance (Fuzzy Search)
CREATE INDEX IX_products_name_trgm ON products USING GIN (name gin_trgm_ops);

-- 2. Scalable GIN Index for ultra-fast dynamic attribute filtering
CREATE INDEX idx_products_jsonb_fast ON products USING GIN (dynamic_attributes jsonb_path_ops);

-- 3. Atomic Trigger for Lexical Search synchronization (FTS)
CREATE TRIGGER trg_products_search_vector_update
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION products_search_vector_update();`,
      tags: ['PostgreSQL 16', 'JSONB', 'GIN Index', 'pg_trgm', 'Fuzzy Search', 'FTS']
    },
    {
      id: 'ai',
      title: 'AI Engine (Python)',
      description:
        'High-performance microservice built on Python 3.13, specialized in the normalization and extraction of unstructured data. ' +
        'The engine uses Gemini 2.0 Flash as the primary LLM due to its low latency and wide context window. ' +
        'Data Standardization: Implements the Instructor library to enforce Structured Outputs via Pydantic schemas, ensuring the AI responds with valid, typed JSON. ' +
        'gRPC Communication: Exposes a gRPC server over HTTP/2, allowing the .NET backend to invoke inference processes with binary payloads (Protobuf), eliminating JSON serialization overhead within the internal network. ' +
        'Processing: The worker automatically translates technical inventory attributes into English and categorizes products based on a dynamic taxonomy defined in the system.',
      testingCommand: 'cd ai && pytest',
      testingLocation: 'ai/tests/',
      testingTags: ['Pytest', 'gRPC', 'Instructor'],
      codeSnippet:
        `# extractor.py — Typed inference with Instructor
import instructor
import google.generativeai as genai
from .schemas import ProductSchema

# Client configuration with Gemini 2.0
client = instructor.from_gemini(
    client=genai.GenerativeModel("gemini-2.0-flash"),
    mode=instructor.Mode.GEMINI_JSON,
)

async def extract_product_data(raw_text: str) -> ProductSchema:
    return client.chat.completions.create(
        response_model=ProductSchema,
        messages=[{"role": "user", "content": raw_text}]
    )

# gRPC Service Definition (Protocol Buffers)
# service AiProcessor { rpc ExtractData(RawRequest) returns (ProductResponse); }`,
      tags: ['Python 3.13', 'Gemini 2.0', 'gRPC Server', 'Instructor', 'Pydantic', 'Protobuf']
    },
    {
      id: 'testing',
      title: 'Testing Stack & QA',
      description:
        'The platform implements a multi-layer testing strategy to ensure data integrity, UI stability, and AI reliability. ' +
        'Tests are categorized into Backend Integration, Frontend Component/Logic, and AI Validation layers. ' +
        'The suite can be executed individually for granular debugging or as a full block for CI/CD validation.',
      codeSnippet:
        `# A. Backend Layer (Core & Persistence)
# TECHNOLOGY: .NET 9 + xUnit + Testcontainers (PostgreSQL 17)
dotnet test backend/Inventory.API.IntegrationTests/Inventory.API.IntegrationTests.csproj

# B. Frontend Layer (UI & Logic)
# TECHNOLOGY: Vitest + JSDOM + Bun Runtime
cd frontend && bun run test

# C. AI Layer (Intelligence Microservice)
# TECHNOLOGY: Pytest + gRPC + Instructor
cd ai && pytest

# --- Full Execution (Sequential) ---
# Runs all layers one after another
dotnet test backend/Inventory.API.IntegrationTests/Inventory.API.IntegrationTests.csproj && \\
(cd frontend && bun run test) && \\
(cd ai && pytest)`,
      tags: ['xUnit', 'Testcontainers', 'Vitest', 'Bun', 'Pytest', 'Integration Testing']
    }
  ]);

  // Computed signal for the active section
  readonly activeSection = computed(() =>
    this.sections().find(s => s.id === this.selectedSectionId())
  );

  selectSection(id: string): void {
    this.selectedSectionId.set(id);
  }

  copyToClipboard(text: string): void {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      // Optional: Add a toast notification logic here if available
      console.log('Command copied to clipboard');
    });
  }
}