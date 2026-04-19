import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <!-- Hero Section -->
      <section class="text-center mb-16 px-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 tracking-wider uppercase">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          Technical Knowledge Base
        </div>
        <h1 class="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#042F59] to-[#4187FF] mb-6">
          Documentation Portal
        </h1>
        <p class="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Master the architecture and deployment of the Valsoft Monorepo. Built with top-tier 2026 standards including .NET 9, Angular 21, and Python 3.13.
        </p>
      </section>

      <!-- Main Content -->
      <div class="max-w-6xl mx-auto px-4 space-y-20">
        
        <!-- Platform Modules Grid -->
        <section>
          <div class="flex items-center gap-3 mb-8">
            <div class="p-2 rounded-lg bg-[#4187FF]/10 text-[#4187FF]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            </div>
            <h2 class="text-2xl font-bold text-[#042F59]">Platform Modules</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Frontend Card -->
            <div class="group flex flex-col p-8 rounded-3xl bg-white border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
               <div class="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-monitor"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
               </div>
               <h4 class="text-xl font-bold mb-3 text-[#042F59]">Frontend</h4>
               <p class="text-sm text-muted-foreground leading-relaxed mb-4">
                 High-performance interface built with **Angular 21 (Zoneless)** and **Signals** via **@ngrx/signals**.
               </p>
               <div class="space-y-2">
                 <div class="flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded w-fit">
                   Testing: Vitest + Playwright
                 </div>
                 <p class="text-[11px] text-muted-foreground">
                   **Unit Testing**: Fast execution with **Vitest** and AnalogJS. <br>
                   **E2E Testing**: Robust browser automation with **Playwright**. <br>
                   **UI Patterns**: **Spartan UI** and **Storybook 10** for component isolation.
                 </p>
               </div>
            </div>

            <!-- Backend Card -->
            <div class="group flex flex-col p-8 rounded-3xl bg-white border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
               <div class="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-server"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>
               </div>
               <h4 class="text-xl font-bold mb-3 text-[#042F59]">Backend</h4>
               <p class="text-sm text-muted-foreground leading-relaxed">
                 Robust **.NET 9** core using **Vertical Slices Architecture**. Implements Clean Architecture principles to decouple business logic from infrastructure using EF Core.
               </p>
            </div>

            <!-- AI Card (Python Logo) -->
            <div class="group flex flex-col p-8 rounded-3xl bg-gradient-to-br from-[#042F59] to-[#0a4a8c] text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white/10">
               <div class="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                  <svg viewBox="0 0 448 512" class="w-6 h-6 fill-current">
                    <path d="M439.8 200.5c-7.7-30.9-22.3-54.2-53.4-54.2h-40.1v47.4c0 36.8-31.2 67.8-66.8 67.8H172.7c-29.2 0-53.4 25-53.4 54.3v101.8c0 29 25.2 46 53.4 54.3 33.8 9.9 66.3 11.7 106.8 0 26.9-7.8 53.4-23.5 53.4-54.3v-40.7H226.2v-13.6h160.2c31.1 0 42.6-21.7 53.4-54.2 11.2-33.8 11-66.8 0-106.5zm-273.5 101.5c-13.3 0-24.1-10.8-24.1-24.1s10.8-24.1 24.1-24.1 24.1 10.8 24.1 24.1-10.8 24.1-24.1 24.1zM441.1 125.1c-15.6-32-35.1-51.4-74.4-51.4H240.7c-29.2 0-53.4 25-53.4 54.3v40.7h106.8v13.6H133.4c-31.1 0-42.6 21.7-53.4 54.2-11.2 33.8-11 66.8 0 106.5 7.7 30.9 22.3 54.2 53.4 54.2h40.1v-47.4c0-36.8 31.2-67.8 66.8-67.8h106.8c29.2 0 53.4-25 53.4-54.3V179.4c0-29-25.2-46-53.4-54.3-33.8-9.9-66.3-11.7-106.8 0-26.9 7.8-53.4 23.5-53.4 54.3v40.7h106.8v13.6H133.4c-31.1 0-42.6 21.7-53.4 54.2-11.2 33.8-11 66.8 0 106.5zm-54.2-225.8c-13.3 0-24.1-10.8-24.1-24.1s10.8-24.1 24.1-24.1 24.1 10.8 24.1 24.1-10.8 24.1-24.1 24.1z"/>
                  </svg>
               </div>
               <h4 class="text-xl font-bold mb-3">AI (Python)</h4>
               <p class="text-sm text-white/80 leading-relaxed">
                 Advanced extractor built with **Python 3.13** and **gRPC**. Uses **Gemini 2.0 Flash Lite** for lightning-fast structured data extraction with sub-second response times.
               </p>
            </div>

            <!-- Database Card -->
            <div class="group flex flex-col p-8 rounded-3xl bg-white border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
               <div class="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-database"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
               </div>
               <h4 class="text-xl font-bold mb-3 text-[#042F59]">Database</h4>
               <p class="text-sm text-muted-foreground leading-relaxed">
                 High-performance **PostgreSQL** storage leveraging **Full-Text Search (FTS)**, GIN indexes for JSONB, and Trigram similarity for typo-tolerant inventory searching.
               </p>
            </div>

            <!-- Architecture Card -->
            <div class="group flex flex-col p-8 rounded-3xl bg-white border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
               <div class="w-12 h-12 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-graph"><path d="M5 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M5 6v12"/><path d="M5 18a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M12 12v6"/><path d="M12 18a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/><path d="M19 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19 12v6"/><path d="M19 18a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>
               </div>
               <h4 class="text-xl font-bold mb-3 text-[#042F59]">Architecture</h4>
               <p class="text-sm text-muted-foreground leading-relaxed">
                 Distributed Monorepo orchestrated by **.NET Aspire**. Includes integrated **OpenTelemetry** for full observability and automated CI/CD via GitHub Actions.
               </p>
            </div>

            <!-- Coming Soon Placeholder -->
            <div class="flex flex-col p-8 rounded-3xl bg-muted/20 border border-dashed border-border items-center justify-center text-center">
               <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Expansion</p>
               <h4 class="text-lg font-semibold text-[#042F59]/50 italic">More sections coming soon</h4>
            </div>
          </div>
        </section>

        <!-- Database Architecture & Scaling Section -->
        <section class="p-8 md:p-12 rounded-[2rem] bg-slate-50 border border-border">
          <div class="max-w-4xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold tracking-wider uppercase mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-database"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
              Standardized Data Core
            </div>
            <h2 class="text-3xl font-bold text-[#042F59] mb-6">Database Architecture & Scaling</h2>
            <p class="text-muted-foreground leading-relaxed mb-8">
              We leverage **PostgreSQL 16+** as our primary source of truth, utilizing a hybrid methodology that combines the strictness of relational data with the flexibility of NoSQL.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-4">
                <h4 class="font-bold text-[#042F59] flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Scaling to Millions of Records
                </h4>
                <p class="text-sm text-muted-foreground">
                  Unlike traditional solutions that slow down with growth, our system uses **GIN (Generalized Inverted Index)**. This allows searches across millions of rows and deep within JSONB objects to stay under **~50ms**.
                </p>
              </div>

              <div class="space-y-4">
                <h4 class="font-bold text-[#042F59] flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Fuzzy Search (Trigrams)
                </h4>
                <p class="text-sm text-muted-foreground">
                  Using `pg_trgm`, we implement similarity-based search. This handles spelling errors and partial matches without the performance penalty of `ILIKE` operations.
                </p>
              </div>

              <div class="space-y-4">
                <h4 class="font-bold text-[#042F59] flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  JSONB Methodology
                </h4>
                <p class="text-sm text-muted-foreground">
                  The `dynamic_attributes` column uses the binary JSON format (**JSONB**). This allows adding new product specifications (Color, Size, Material) on the fly without database migrations.
                </p>
              </div>

              <div class="space-y-4">
                <h4 class="font-bold text-[#042F59] flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Optimized Indexing
                </h4>
                <p class="text-sm text-muted-foreground">
                  We use `jsonb_path_ops` for ultra-fast traversal of nested objects, prioritizing query speed for complex filtering in large-scale inventories.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Fast Deployment Section -->
        <section>
          <div class="flex items-center gap-3 mb-8">
            <div class="p-2 rounded-lg bg-[#4187FF]/10 text-[#4187FF]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rocket"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3l1 1"/><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5l-1-1"/></svg>
            </div>
            <h2 class="text-2xl font-bold text-[#042F59]">Fast Deployment</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="flex flex-col p-6 rounded-2xl bg-white border border-border shadow-sm hover:border-[#4187FF]/50 transition-colors">
               <span class="text-xs font-bold text-[#4187FF] mb-2 uppercase">Step 01</span>
               <h4 class="font-bold mb-2">Init Configuration</h4>
               <p class="text-sm text-muted-foreground flex-grow">Run <code class="bg-muted px-1 rounded">./init-dev.sh</code> to create your local .env and appsettings files from the secure templates.</p>
            </div>
            <div class="flex flex-col p-6 rounded-2xl bg-white border border-border shadow-sm hover:border-[#4187FF]/50 transition-colors">
               <span class="text-xs font-bold text-[#4187FF] mb-2 uppercase">Step 02</span>
               <h4 class="font-bold mb-2">Automated Setup</h4>
               <p class="text-sm text-muted-foreground flex-grow">Run <code class="bg-muted px-1 rounded">make setup</code> to install runtime environments for .NET, Python, and Angular dependencies.</p>
            </div>
            <div class="flex flex-col p-6 rounded-2xl bg-white border border-border shadow-sm hover:border-[#4187FF]/50 transition-colors">
               <span class="text-xs font-bold text-[#4187FF] mb-2 uppercase">Step 03</span>
               <h4 class="font-bold mb-2">Aspire Launch</h4>
               <p class="text-sm text-muted-foreground flex-grow">Use <code class="bg-muted px-1 rounded">make dev</code> to start the .NET Aspire orchestrator and access the unified monitoring dashboard.</p>
            </div>
          </div>
        </section>

        <!-- Tech Stack Details -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div class="space-y-6">
              <h2 class="text-2xl font-bold text-[#042F59]">Backend Architecture</h2>
              <p class="text-muted-foreground">Standardized Clean Architecture with Vertical Slices using .NET 9. Optimized for PostgreSQL and OpenTelemetry tracing.</p>
              <div class="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                <div class="text-2xl font-mono font-black text-[#042F59]/20">01</div>
                <div>
                  <h5 class="font-bold text-sm">Entity Framework Core</h5>
                  <p class="text-xs text-muted-foreground">PostgreSQL specialized indexing and fuzzy search triggers.</p>
                </div>
              </div>
              <div class="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                <div class="text-2xl font-mono font-black text-[#042F59]/20">02</div>
                <div>
                  <h5 class="font-bold text-sm">Scalar API Documentation</h5>
                  <p class="text-xs text-muted-foreground">Interactive OpenApi 3.1 technical specifications.</p>
                </div>
              </div>
           </div>
           
           <div class="space-y-6">
              <h2 class="text-2xl font-bold text-[#042F59]">Frontend Core</h2>
              <p class="text-muted-foreground">Built with Angular 21 (Zoneless) for maximum performance and Signal-based state management.</p>
              <div class="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                <div class="text-2xl font-mono font-black text-[#042F59]/20">03</div>
                <div>
                  <h5 class="font-bold text-sm">Spartan UI & Tailwind</h5>
                  <p class="text-xs text-muted-foreground">Premium design system using shadcn/ui principles in Angular.</p>
                </div>
              </div>
              <div class="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                <div class="text-2xl font-mono font-black text-[#042F59]/20">04</div>
                <div>
                  <h5 class="font-bold text-sm">Bun Runtime</h5>
                  <p class="text-xs text-muted-foreground">Fast builds, testing, and package management.</p>
                </div>
              </div>
           </div>
        </section>

        <!-- Infrastructure Callout -->
        <div class="p-8 rounded-3xl bg-muted/20 border border-border text-center">
            <p class="text-sm font-medium text-muted-foreground italic max-w-2xl mx-auto">
              Deployment infrastructure is automated via GitHub Actions, prioritizing Vercel for Frontend, Neon for PostgreSQL, and GCP for the AI Workloads.
            </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class DocumentationComponent {}
