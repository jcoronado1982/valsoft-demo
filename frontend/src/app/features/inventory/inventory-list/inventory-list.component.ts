import { Component, ChangeDetectionStrategy, inject, OnInit, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService, InventoryItem } from '../inventory.service';
import { AuthService } from '../../../core/auth/auth.service';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { DataTableComponent, DataTableColumnDirective, TableColumn } from '../../../shared/ui/data-table/data-table.component';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmButton, HlmInput, DataTableComponent, DataTableColumnDirective],
  templateUrl: './inventory-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full'
  }
})
export class InventoryListComponent implements OnInit {
  protected readonly Math = Math;
  inventoryService = inject(InventoryService);
  authService = inject(AuthService);

  items = this.inventoryService.items;
  categories = this.inventoryService.categories;
  dynamicFilters = this.inventoryService.dynamicFilters;
  searchTerm = this.inventoryService.searchTerm;
  totalItems = this.inventoryService.totalItems;
  currentPage = this.inventoryService.currentPage;
  pageSize = this.inventoryService.pageSize;
  
  // State for filtering
  selectedCategoryId = signal<number | null>(null);
  selectedDynamicFilters = signal<Record<string, string>>({});
  
  hasActiveFilters = computed(() => {
    const hasSearch = !!this.searchTerm() && this.searchTerm().trim().length > 0;
    const hasCategory = this.selectedCategoryId() !== null;
    const hasDynamic = Object.keys(this.selectedDynamicFilters()).length > 0;
    return hasSearch || hasCategory || hasDynamic;
  });
  
  activeFilterChips = computed(() => {
    const chips: { type: string, key: string, label: string }[] = [];
    
    const catId = this.selectedCategoryId();
    if (catId) {
      const cat = this.categories().find(c => c.id === catId);
      if (cat) {
        chips.push({ type: 'category', key: 'category', label: cat.name });
      }
    }
    
    const dyn = this.selectedDynamicFilters();
    for (const [key, value] of Object.entries(dyn)) {
      chips.push({ type: 'dynamic', key: key, label: value });
    }
    
    return chips;
  });
  
  // State for UI (Expanded/Collapsed filters)
  expandedFilters = signal<Record<string, boolean>>({});
  expandedOptionsCount = signal<Record<string, number>>({});
  isFacetsLoading = signal(false);

  // State for editing and adding
  editingItem = signal<InventoryItem | null>(null);
  isAdding = signal(false);
  
  // Local form state to ensure [(ngModel)] binding works correctly with signals
  // We use a mutable object here that we transfer to the service on save
  addForm = {
    name: '',
    price: 0,
    stock: 0,
    status: 'In Stock' as 'In Stock' | 'Low Stock' | 'Ordered' | 'Discontinued'
  };

  editForm = {
    name: '',
    price: 0,
    stock: 0,
    status: 'In Stock' as 'In Stock' | 'Low Stock' | 'Ordered' | 'Discontinued'
  };

  constructor() {}

  ngOnInit() {
    this.inventoryService.loadItems();
    this.inventoryService.loadFilters();
  }

  columns: TableColumn[] = [
    { 
      key: 'name', 
      label: 'Product', 
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` 
    },
    { 
      key: 'brand', 
      label: 'Brand',
      headerClassName: 'text-center',
      className: 'text-center',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
    },
    { 
      key: 'category', 
      label: 'Category',
      headerClassName: 'text-center',
      className: 'text-center',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`
    },
    { 
      key: 'price', 
      label: 'Price',
      headerClassName: 'text-center',
      className: 'text-center',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
    },
    { 
      key: 'stock', 
      label: 'Quantity',
      headerClassName: 'text-center',
      className: 'text-center',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`
    },
    { 
      key: 'status', 
      label: 'Status',
      headerClassName: 'text-center',
      className: 'text-center',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
    },
    { key: 'actions', label: 'Actions', className: 'text-center', headerClassName: 'text-center' },
  ];

  onSearchEnter(value: string) {
    this.inventoryService.searchTerm.set(value);
    this.selectedCategoryId.set(null); // Reset filters on new search
    this.selectedDynamicFilters.set({});
    this.performSearch(1); // Go to first page on new search
  }

  onSearch(value: string) {
    // We no longer trigger search on every keystroke, but we keep the value in sync
    this.inventoryService.searchTerm.set(value);
  }

  selectCategory(id: number | null) {
    this.selectedCategoryId.set(id);
    this.performSearch(1);
  }

  clearFilters() {
    this.selectedCategoryId.set(null);
    this.selectedDynamicFilters.set({});
    this.inventoryService.searchTerm.set('');
    this.performSearch(1);
  }

  removeFilterChip(chip: { type: string, key: string, label: string }) {
    if (chip.type === 'category') {
      this.selectedCategoryId.set(null);
    } else if (chip.type === 'dynamic') {
      const dyn = { ...this.selectedDynamicFilters() };
      delete dyn[chip.key];
      this.selectedDynamicFilters.set(dyn);
    }
    this.performSearch(1);
  }

  toggleDynamicFilter(key: string, value: string | null) {
    const current = { ...this.selectedDynamicFilters() };
    if (value === null) {
      delete current[key];
    } else {
      current[key] = value;
    }
    this.selectedDynamicFilters.set(current);
    this.performSearch(1);
  }

  toggleFilterExpansion(key: string) {
    this.expandedFilters.update(current => ({
      ...current,
      [key]: !current[key]
    }));
  }

  showMoreOptions(key: string, currentLength: number) {
    this.expandedOptionsCount.update(current => ({
      ...current,
      [key]: currentLength
    }));
  }

  async performSearch(page: number = this.currentPage()) {
    this.isFacetsLoading.set(true);
    await this.inventoryService.loadItems(
      this.searchTerm(), 
      this.selectedCategoryId(), 
      this.selectedDynamicFilters(),
      page,
      this.pageSize()
    );
    this.isFacetsLoading.set(false);
  }

  changePage(page: number) {
    if (page < 1 || page > Math.ceil(this.totalItems() / this.pageSize())) return;
    this.performSearch(page);
  }

  deleteItem(id: string) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.inventoryService.deleteItem(id);
    }
  }

  startEdit(item: InventoryItem) {
    this.editingItem.set({ ...item });
    this.editForm = {
      name: item.name,
      price: item.price || 0,
      stock: item.stock,
      status: item.status as 'In Stock' | 'Low Stock' | 'Ordered' | 'Discontinued'
    };
  }

  cancelEdit() {
    this.editingItem.set(null);
  }

  async saveEdit() {
    const item = this.editingItem();
    if (item) {
      try {
        await this.inventoryService.updateItem(item.id, {
          name: this.editForm.name,
          price: this.editForm.price,
          stock: this.editForm.stock,
          status: this.editForm.status
        });
        this.editingItem.set(null);
      } catch (error) {
        console.error('Failed to update item', error);
      }
    }
  }

  // State for loading and errors
  isProcessing = signal(false);
  errorMessage = signal<string | null>(null);

  startAdd() {
    this.addForm = {
      name: '',
      price: 0,
      stock: 0,
      status: 'In Stock'
    };
    this.errorMessage.set(null);
    this.isProcessing.set(false);
    this.isAdding.set(true);
  }

  cancelAdd() {
    this.isAdding.set(false);
    this.errorMessage.set(null);
  }

  async saveAdd() {
    if (this.isProcessing()) return; // Prevent double clicks
    
    const item = this.addForm;
    if (item.name && item.price > 0 && item.stock > 0) {
      this.isProcessing.set(true);
      this.errorMessage.set(null);
      try {
        await this.inventoryService.addItem({
          name: item.name,
          price: item.price,
          stock: item.stock,
          status: item.status
        });
        this.isAdding.set(false);
      } catch (error: any) {
        console.error('Failed to add item', error);
        // Try to extract user-friendly error message, handle Axios or standard Errors
        const errorMsg = error?.error?.message || error?.message || 'Unknown error while creating the product.';
        this.errorMessage.set(errorMsg);
      } finally {
        // Only set isProcessing to false here. isAdding takes care of closing the modal.
        this.isProcessing.set(false);
      }
    } else {
       this.errorMessage.set('Please complete all fields with values greater than 0.');
    }
  }

  // Legacy/Internal method
  async addItem() {
    this.startAdd();
  }
}
