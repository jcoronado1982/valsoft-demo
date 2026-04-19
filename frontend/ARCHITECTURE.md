# Frontend Architecture Standards (Angular 19+)

This document establishes the golden rules for frontend development in this project. Any new module or refactoring must strictly follow these standards.

## 1. Signals-Based Architecture (Signals-First)
Signals are the single source of truth for UI state.

- **Local State**: Use `signal()` instead of simple variables or `BehaviorSubject`.
- **Derived State**: Use `computed()` for any value that depends on other signals. This ensures synchronous and efficient updates.
- **RxJS Interop**: Keep RxJS only for complex asynchronous flows (e.g., HTTP requests). Use `toSignal()` to integrate this data into components.
- **Effects**: Use `effect()` only when you need side effects (e.g., logging, synchronization with external APIs that are not signals).

## 2. Zoneless Application
The project is configured to run **without zone.js**.

- **Configuration**: The `app.config.ts` file uses `provideExperimentalZonelessChangeDetection()`.
- **Reactivity**: Ensure all UI changes are triggered by Signals, DOM events, or the `AsyncPipe`. Without `zone.js`, Angular will not detect changes in normal variables outside of these mechanisms.

## 3. Component Structure (Rule of 3 Files)
To maintain cleanliness and scalability, each component must be separated into three physical files:

- `name.component.ts`: Logic and metadata.
- `name.component.html`: Structure (Template).
- `name.component.css`: Specific styles.

**FORBIDDEN**: Using `template: \`...\`` or `styles: [\`...\` ]` inside the `.ts` file.

## 4. Dependency Injection
- Use the `inject()` function instead of constructor injection.
  ```typescript
  private http = inject(HttpClient); // CORRECT
  constructor(private http: HttpClient) {} // AVOID
  ```

## 5. Navigation and Loading (Lazy Loading)
- All main routes must be lazy-loaded using `loadComponent`.
- Configuration in `app.routes.ts`.

## 6. Styling and UI
- **Tailwind CSS**: Core for all design.
- **Spartan UI (Helm)**: High-level UI component collection used in the project. See the `libs/` folder or `@spartan-ng/helm/*` imports.

## 7. Standard Component Example
```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, HlmButton],
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {
  private service = inject(MyService);
  
  // State
  count = signal(0);
  
  // Derived state
  doubleCount = computed(() => this.count() * 2);
  
  // Data from API
  data = toSignal(this.service.getData());

  increment() {
    this.count.update(c => c + 1);
  }
}
```
