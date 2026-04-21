import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  stock: number;
  quantity?: number; // legacy/mapping
  category: string;
  categoryId?: string;
  status: 'In Stock' | 'Low Stock' | 'Ordered' | 'Discontinued';
  brand?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/items`;

  private _items = signal<InventoryItem[]>([]);
  private _categories = signal<any[]>([]);
  private _dynamicFilters = signal<any[]>([]);
  
  // Pagination State
  private _totalItems = signal(0);
  private _currentPage = signal(1);
  private _pageSize = signal(10);

  // No auto-load in constructor: service is root singleton instantiated before auth is established.
  // Call loadItems() explicitly from the component on init.

  async loadItems(search?: string, categoryId?: number | null, dynamicFilters?: Record<string, string>, page: number = 1, pageSize: number = 10) {
    try {
      this._currentPage.set(page);
      let url = this.apiUrl;
      const params = new URLSearchParams();
      if (search) params.append('term', search);
      if (categoryId) params.append('categoryId', categoryId.toString());
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());

      if (dynamicFilters) {
        Object.entries(dynamicFilters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const response = await firstValueFrom(this.http.get<any>(url));
      const items = response.items || [];
      this._totalItems.set(response.totalCount || 0);
      
      if (response.facets) {
        this._dynamicFilters.set(response.facets);
      }

      this._items.set(items.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        description: item.description,
        price: item.price,
        stock: item.quantity,
        quantity: item.quantity,
        category: item.categoryName || 'General',
        categoryId: item.categoryId?.toString(),
        status: (item.status === 'En Stock' ? 'In Stock' : item.status === 'Stock Bajo' ? 'Low Stock' : item.status) || 'In Stock',
        brand: item.brand
      })));
    } catch (error) {
      console.error('Error loading inventory items', error);
    }
  }

  async loadFilters() {
    try {
      const response = await firstValueFrom(this.http.get<any>(`${environment.apiUrl}/filters`));
      this._categories.set(response.categories || []);
      // dynamicFilters are now contextually loaded via loadItems()
    } catch (error) {
      console.error('Error loading filters', error);
    }
  }

  items = this._items.asReadonly();
  categories = this._categories.asReadonly();
  dynamicFilters = this._dynamicFilters.asReadonly();
  totalItems = this._totalItems.asReadonly();
  currentPage = this._currentPage.asReadonly();
  pageSize = this._pageSize.asReadonly();
  searchTerm = signal('');

  async addItem(item: any) {
    try {
      // Map frontend 'stock' to backend 'Quantity'
      const backendItem = {
        ...item,
        quantity: item.stock ?? item.quantity ?? 0,
        categoryId: item.categoryId ? parseInt(item.categoryId) : null // Backend expects int, null triggers AI classification
      };
      const newItem = await firstValueFrom(this.http.post<any>(this.apiUrl, backendItem));
      this.loadItems(this.searchTerm(), null, {}, this.currentPage(), this.pageSize()); 
      this.loadFilters(); // Refresh filters and counts
      return newItem;
    } catch (error) {
      console.error('Error adding item', error);
      throw error;
    }
  }

  async deleteItem(id: string) {
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
      // Refresh both full list (to handle pagination) and sidebar filters
      await this.loadItems(this.searchTerm(), null, {}, this.currentPage(), this.pageSize());
      await this.loadFilters();
    } catch (error) {
      console.error('Error deleting item', error);
    }
  }

  async updateItem(id: string, updates: any) {
    try {
      const backendUpdates = {
        ...updates,
        id: parseInt(id),
        quantity: updates.stock ?? updates.quantity
      };
      const updated = await firstValueFrom(this.http.patch<any>(`${this.apiUrl}/${id}`, backendUpdates));
      await this.loadItems(this.searchTerm(), null, {}, this.currentPage(), this.pageSize());
      await this.loadFilters();
      return updated;
    } catch (error) {
      console.error('Error updating item', error);
      throw error;
    }
  }
}
