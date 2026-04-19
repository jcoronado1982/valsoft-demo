import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService, UserSystemRecord } from '../../../core/users/users.service';
import { HlmButton } from '@spartan-ng/helm/button';
import { DataTableComponent, DataTableColumnDirective, TableColumn } from '../../../shared/ui/data-table/data-table.component';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, HlmButton, DataTableComponent, DataTableColumnDirective],
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full'
  }
})
export class UserListComponent implements OnInit {
  authService = inject(AuthService);
  usersService = inject(UsersService);

  users = this.usersService.users;
  isLoading = this.usersService.isLoading;
  brokenImages = signal<Set<number>>(new Set());

  columns: TableColumn[] = [
    { key: 'email', label: 'User Details' },
    { key: 'role', label: 'System Role', className: 'text-center', headerClassName: 'text-center' },
    { key: 'createdAt', label: 'Joined', className: 'text-center', headerClassName: 'text-center' },
    { key: 'actions', label: 'Access Control', className: 'text-center', headerClassName: 'text-center' }
  ];

  ngOnInit() {
    this.usersService.loadUsers();
  }

  async updateRole(user: UserSystemRecord, selectElement: HTMLSelectElement) {
    const newRole = selectElement.value;
    if (newRole === user.role) return;

    const confirmMsg = `Are you sure you want to change ${user.email} from ${user.role} to ${newRole.toUpperCase()}?`;
    
    if (confirm(confirmMsg)) {
      try {
        await this.usersService.updateUserRole(user.id, newRole);
      } catch (error) {
        alert('Failed to update role. Ensure you have proper permissions.');
        selectElement.value = user.role; // Reset
      }
    } else {
      selectElement.value = user.role; // Reset
    }
  }

  handleImageError(userId: number) {
    this.brokenImages.update(set => {
      const newSet = new Set(set);
      newSet.add(userId);
      return newSet;
    });
  }
}
