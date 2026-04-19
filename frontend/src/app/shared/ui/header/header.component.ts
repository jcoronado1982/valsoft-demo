import { Component, inject, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent {
  authService = inject(AuthService);
  imageError = signal(false);

  constructor() {
    effect(() => {
      // Reset image error state whenever the user signal changes
      this.authService.user();
      this.imageError.set(false);
    });
  }
}
