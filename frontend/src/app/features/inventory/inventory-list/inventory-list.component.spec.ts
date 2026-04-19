import { signal, Directive, Input, Component, ContentChildren, QueryList, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { InventoryListComponent } from './inventory-list.component';
import { InventoryService } from '../inventory.service';
import { AuthService } from '../../../core/auth/auth.service';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { DataTableComponent, DataTableColumnDirective } from '../../../shared/ui/data-table/data-table.component';

@Directive({ selector: '[hlmBtn]', standalone: true })
class HlmBtnMock { @Input() variant: any; @Input() size: any; @Input() class: any; }

@Directive({ selector: '[hlmInput]', standalone: true })
class HlmInputMock { @Input() class: any; }

@Component({ selector: 'app-data-table', standalone: true, template: '<ng-content></ng-content>' })
class DataTableMock { @Input() data: any; @Input() columns: any; @Input() variant: any; @Input() showIndex: any; @Input() class: any; }

@Directive({ selector: '[appDataTableColumn]', standalone: true })
class DataTableColumnMock { @Input('appDataTableColumn') name: string = ''; constructor(public template: TemplateRef<any>) {} }

describe('InventoryListComponent', () => {
  let component: InventoryListComponent;
  let fixture: ComponentFixture<InventoryListComponent>;
  let inventoryServiceMock: any;
  let authServiceMock: any;

  beforeEach(async () => {
    inventoryServiceMock = {
      items: signal([]),
      categories: signal([]),
      dynamicFilters: signal([]),
      totalItems: signal(0),
      currentPage: signal(1),
      pageSize: signal(20),
      searchTerm: signal(''),
      loadItems: vi.fn().mockResolvedValue(undefined),
      loadFilters: vi.fn().mockResolvedValue(undefined),
      addItem: vi.fn().mockResolvedValue({ id: 1, name: 'New Item' }),
      updateItem: vi.fn().mockResolvedValue({ id: 1, name: 'Updated Item' }),
      deleteItem: vi.fn().mockResolvedValue(true)
    };

    authServiceMock = {
      user: signal({ role: 'admin' })
    };

    await TestBed.configureTestingModule({
      imports: [InventoryListComponent, FormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: InventoryService, useValue: inventoryServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).overrideComponent(InventoryListComponent, {
      remove: { imports: [HlmButton, HlmInput, DataTableComponent, DataTableColumnDirective] },
      add: { imports: [HlmBtnMock, HlmInputMock, DataTableMock, DataTableColumnMock] }
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load items on init', () => {
    expect(inventoryServiceMock.loadItems).toHaveBeenCalled();
  });

  it('should call addItem on service when saveAdd is called', async () => {
    component.startAdd();
    component.addForm = {
      name: 'Test Product',
      price: 100,
      stock: 5,
      status: 'In Stock'
    };
    
    await component.saveAdd();
    
    expect(inventoryServiceMock.addItem).toHaveBeenCalledWith({
      name: 'Test Product',
      price: 100,
      stock: 5,
      status: 'In Stock'
    });
    expect(component.isAdding()).toBe(false);
  });

  it('should call updateItem on service when saveEdit is called', async () => {
    const mockItem = { id: '1', name: 'Original Name', stock: 10, category: 'Test', status: 'In Stock' as any };
    component.startEdit(mockItem);
    component.editForm.name = 'Updated Name';
    
    await component.saveEdit();
    
    expect(inventoryServiceMock.updateItem).toHaveBeenCalledWith('1', {
      name: 'Updated Name',
      price: 0,
      stock: 10,
      status: 'In Stock'
    });
    expect(component.editingItem()).toBeNull();
  });

  it('should call deleteItem on service when deleteItem is called and confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    component.deleteItem('1');
    
    expect(inventoryServiceMock.deleteItem).toHaveBeenCalledWith('1');
  });

  it('should update search term and call loadItems on performSearch', () => {
    component.onSearch('keyboard');
    expect(inventoryServiceMock.searchTerm()).toBe('keyboard');
    
    component.performSearch();
    expect(inventoryServiceMock.loadItems).toHaveBeenCalledWith('keyboard', null, {}, 1, 20);
  });
});
