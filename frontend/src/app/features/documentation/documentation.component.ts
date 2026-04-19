import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <!-- Hero Section -->
      <section class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold text-[#042F59] mb-4">Documentation</h1>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our comprehensive guides and developer resources to make the most out of the Valsoft Inventory Platform.
        </p>
      </section>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <!-- Card 1 -->
        <div class="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
          <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
             <span class="text-primary text-xl font-bold">01</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">Getting Started</h3>
          <p class="text-muted-foreground text-sm">
            Learn the basics of the platform, from authentication to your first inventory item.
          </p>
          <button class="mt-4 text-primary text-sm font-semibold hover:underline cursor-not-allowed">Coming Soon</button>
        </div>

        <!-- Card 2 -->
        <div class="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
          <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
             <span class="text-primary text-xl font-bold">02</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">AI Microservice</h3>
          <p class="text-muted-foreground text-sm">
            Deep dive into the gRPC-powered AI engine and how it processes your inventory data.
          </p>
          <button class="mt-4 text-primary text-sm font-semibold hover:underline cursor-not-allowed">Coming Soon</button>
        </div>

        <!-- Card 3 -->
        <div class="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
          <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
             <span class="text-primary text-xl font-bold">03</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">API Reference</h3>
          <p class="text-muted-foreground text-sm">
            Explore the .NET 9 backend endpoints and how to integrate with the system.
          </p>
          <button class="mt-4 text-primary text-sm font-semibold hover:underline cursor-not-allowed">Coming Soon</button>
        </div>
      </div>

      <!-- Footer Placeholder -->
      <div class="mt-20 text-center p-12 bg-muted/30 rounded-3xl border border-dashed border-border max-w-4xl mx-auto">
        <p class="text-muted-foreground italic">
          More detailed guides and technical documentation will be added here soon.
        </p>
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
