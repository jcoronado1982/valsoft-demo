import { Component, Input, ChangeDetectionStrategy, ContentChildren, QueryList, TemplateRef, Directive, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Directive({
  selector: '[appDataTableColumn]',
  standalone: true
})
export class DataTableColumnDirective {
  @Input('appDataTableColumn') name: string = '';
  constructor(public template: TemplateRef<any>) {}
}

export interface TableColumn {
  key: string;
  label: string;
  className?: string;
  headerClassName?: string;
  icon?: string; // Lucide icon name or SVG path
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="variant === 'cards' ? 'bg-transparent border-0' : 'bg-card rounded-xl border border-border overflow-hidden'">
      <div class="overflow-x-auto overflow-y-visible">
        <table 
          class="w-full text-left border-collapse"
          [class.border-separate]="variant === 'cards'"
          [class.border-spacing-y-1]="variant === 'cards'"
        >
          <thead>
            <tr [class]="variant === 'cards' ? 'text-muted-foreground' : 'border-b border-border bg-muted/50'">
              @if (showIndex) {
                 <th class="p-2 text-[16px] font-semibold uppercase tracking-wider text-foreground w-12 text-center border-b-2 border-primary">Nº</th>
              }
              @for (col of columns; track col.key) {
              <th 
                  class="p-2 text-[16px] font-semibold uppercase tracking-wider text-foreground border-b-2 border-primary"
                  [ngClass]="(col.headerClassName || '').split(' ')"
                >
                  <div class="flex items-center gap-2" [class.justify-center]="(col.headerClassName || '').includes('text-center')">
                    @if (col.icon) {
                       <span [innerHTML]="col.icon" class="opacity-60"></span>
                    }
                    {{ col.label }}
                  </div>
                </th>
              }
            </tr>
          </thead>
          <tbody [class.before:block before:h-2]="variant === 'cards'">
            @for (item of data; track item[trackBy]; let i = $index) {
              <tr 
                class="transition-all duration-200 group"
                [class.border-b]="variant === 'standard'"
                [class.border-border]="variant === 'standard'"
                [class.last:border-0]="variant === 'standard'"
                [class.hover:bg-muted/30]="variant === 'standard'"
                
                [class.bg-card]="variant === 'cards'"
                [class.rounded-xl]="variant === 'cards'"
                [class.shadow-sm]="variant === 'cards'"
                [class.hover:shadow-md]="variant === 'cards'"
                [class.hover:-translate-y-0.5]="variant === 'cards'"
              >
                @if (showIndex) {
                   <td class="p-2 text-center" [class.rounded-l-xl]="variant === 'cards'">
                      <div class="w-8 h-8 rounded-full border border-border flex items-center justify-center text-xs font-medium text-muted-foreground group-hover:border-primary/30 transition-colors">
                        {{ i + 1 }}
                      </div>
                   </td>
                }
                @for (col of columns; track col.key; let firstCol = $first; let lastCol = $last) {
                  <td 
                    class="p-2" 
                    [ngClass]="(col.className || '').split(' ')" 
                    [class.rounded-l-xl]="variant === 'cards' && !showIndex && firstCol"
                    [class.rounded-r-xl]="variant === 'cards' && lastCol"
                  >
                    @if (getTemplate(col.key); as template) {
                      <ng-container *ngTemplateOutlet="template; context: { $implicit: item }"></ng-container>
                    } @else {
                      <span class="font-medium text-foreground">{{ item[col.key] }}</span>
                    }
                  </td>
                }
              </tr>
            } @empty {
              <tr>
                <td [attr.colspan]="columns.length + (showIndex ? 1 : 0)" class="p-0">
                  <ng-content select="[emptyState]"></ng-content>
                  @if (!hasCustomEmptyState) {
                    <div class="p-8 text-center text-muted-foreground bg-card rounded-xl border border-dashed">
                      No items found.
                    </div>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent {
  @Input({ required: true }) data: any[] = [];
  @Input({ required: true }) columns: TableColumn[] = [];
  @Input() trackBy: string = 'id';
  @Input() variant: 'standard' | 'cards' = 'standard';
  @Input() showIndex: boolean = false;
  
  @ContentChildren(DataTableColumnDirective) columnTemplates?: QueryList<DataTableColumnDirective>;
  @ContentChild('emptyState') emptyStateContent?: any;

  get hasCustomEmptyState(): boolean {
    return !!this.emptyStateContent;
  }

  getTemplate(columnKey: string): TemplateRef<any> | null {
    return this.columnTemplates?.find(c => c.name === columnKey)?.template || null;
  }
}
