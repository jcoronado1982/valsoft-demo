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

      <!-- Main Content Grid -->
      <div class="max-w-6xl mx-auto px-4 space-y-20">
        
        <!-- Quick Start Section -->
        <section>
          <div class="flex items-center gap-3 mb-8">
            <div class="p-2 rounded-lg bg-[#4187FF]/10 text-[#4187FF]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rocket"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3l1 1"/><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5l-1-1"/></svg>
            </div>
            <h2 class="text-2xl font-bold text-[#042F59]">Getting Started</h2>
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

        <!-- Python AI Microservice Section -->
        <section class="relative overflow-hidden p-8 md:p-12 rounded-[2rem] bg-gradient-to-br from-[#042F59] to-[#0a4a8c] text-white">
          <div class="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div class="flex-grow space-y-6">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-bold tracking-wider uppercase">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cpu"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
                AI & Data Extraction microservice
              </div>
              <h2 class="text-3xl md:text-4xl font-bold">AI Microservice (Python)</h2>
              <p class="text-white/80 leading-relaxed max-w-xl">
                Our high-performance AI engine is built with **Python 3.13** and **gRPC**. It leverages **Google Gemini 2.0 Flash Lite** to perform structured data extraction with sub-second latency.
              </p>
              <ul class="space-y-3">
                <li class="flex items-center gap-2 text-sm text-white/70">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                  Communication via high-speed gRPC buffers.
                </li>
                <li class="flex items-center gap-2 text-sm text-white/70">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                  Validated schemas using Pydantic and Instructor.
                </li>
              </ul>
            </div>
            
            <!-- Python Logo Visual -->
            <div class="flex-shrink-0 relative group">
              <div class="absolute inset-0 bg-white/20 blur-3xl rounded-full group-hover:bg-white/30 transition-all duration-700"></div>
              <div class="relative w-48 h-48 md:w-64 md:h-64 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-500">
                <!-- Python SVG Logo -->
                <svg viewBox="0 0 448 512" class="w-full h-full drop-shadow-2xl fill-white">
                  <path d="M439.8 200.5c-7.7-30.9-22.3-54.2-53.4-54.2h-40.1v47.4c0 36.8-31.2 67.8-66.8 67.8H172.7c-29.2 0-53.4 25-53.4 54.3v101.8c0 29 25.2 46 53.4 54.3 33.8 9.9 66.3 11.7 106.8 0 26.9-7.8 53.4-23.5 53.4-54.3v-40.7H226.2v-13.6h160.2c31.1 0 42.6-21.7 53.4-54.2 11.2-33.8 11-66.8 0-106.5zm-273.5 101.5c-13.3 0-24.1-10.8-24.1-24.1s10.8-24.1 24.1-24.1 24.1 10.8 24.1 24.1-10.8 24.1-24.1 24.1zM441.1 125.1c-15.6-32-35.1-51.4-74.4-51.4H240.7c-29.2 0-53.4 25-53.4 54.3v40.7h106.8v13.6H133.4c-31.1 0-42.6 21.7-53.4 54.2-11.2 33.8-11 66.8 0 106.5 7.7 30.9 22.3 54.2 53.4 54.2h40.1v-47.4c0-36.8 31.2-67.8 66.8-67.8h106.8c29.2 0 53.4-25 53.4-54.3V179.4c0-29-25.2-46-53.4-54.3-33.8-9.9-66.3-11.7-106.8 0-26.9 7.8-53.4 23.5-53.4 54.3v40.7h106.8v13.6H133.4c-31.1 0-42.6 21.7-53.4 54.2-11.2 33.8-11 66.8 0 106.5zm-54.2-225.8c-13.3 0-24.1-10.8-24.1-24.1s10.8-24.1 24.1-24.1 24.1 10.8 24.1 24.1-10.8 24.1-24.1 24.1z"/>
                </svg>
              </div>
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
