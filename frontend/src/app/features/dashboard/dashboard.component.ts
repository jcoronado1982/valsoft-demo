import { Component, ChangeDetectionStrategy, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryListComponent } from '../inventory/inventory-list/inventory-list.component';
import { InventoryService } from '../inventory/inventory.service';

export interface KpiCard {
  title: string;
  value: string;
  change: string;
  changePositive: boolean;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, InventoryListComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full'
  }
})
export class DashboardComponent implements OnInit {
  private inventoryService = inject(InventoryService);

  ngOnInit() {
    this.inventoryService.loadItems();
  }

  kpis = computed<KpiCard[]>(() => {
    const items = this.inventoryService.items();
    
    const totalProducts = items.length;
    const lowStockCount = items.filter((i: any) => i.stock > 0 && i.stock <= 10).length;
    const categories = new Set(items.map((i: any) => i.category)).size;
    const totalValue = items.reduce((acc: number, curr: any) => acc + ((curr.price || 0) * (curr.stock || 0)), 0);

    return [
      {
        title: 'Total Products',
        value: totalProducts.toLocaleString(),
        change: '+12% this month',
        changePositive: true,
        icon: 'box',
        color: 'blue',
      },
      {
        title: 'Low Stock Alerts',
        value: lowStockCount.toString(),
        change: '+5 since yesterday',
        changePositive: false,
        icon: 'alert',
        color: 'yellow',
      },
      {
        title: 'Categories',
        value: categories.toString(),
        change: '+2 new categories',
        changePositive: true,
        icon: 'tag',
        color: 'purple',
      },
      {
        title: 'Total Value',
        value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalValue),
        change: '+8.3% this quarter',
        changePositive: true,
        icon: 'dollar',
        color: 'green',
      },
    ];
  });
}
