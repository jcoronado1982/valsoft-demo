import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';

export interface UserSystemRecord {
  id: number;
  email: string;
  role: string;
  pictureUrl?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  // Reactive state
  users = signal<UserSystemRecord[]>([]);
  isLoading = signal(false);

  async loadUsers() {
    this.isLoading.set(true);
    try {
      const users = await lastValueFrom(this.http.get<UserSystemRecord[]>(this.apiUrl));
      this.users.set(users);
    } catch (error) {
      console.error('Failed to load users', error);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async updateUserRole(userId: number, role: string) {
    try {
      await lastValueFrom(this.http.patch(`${this.apiUrl}/${userId}/role`, { id: userId, role }));
      // Update local state
      this.users.update(current => 
        current.map(u => u.id === userId ? { ...u, role } : u)
      );
    } catch (error) {
      console.error('Failed to update user role', error);
      throw error;
    }
  }
}
