import { Component, OnInit, NgZone, signal } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';

interface GoogleCredentialResponse {
  credential: string;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (res: GoogleCredentialResponse) => void }) => void;
          renderButton: (parent: HTMLElement | null, config: Record<string, string | number | boolean>) => void;
        };
      };
    };
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.authService.logout();
    }
    this.initGoogleAuth();
  }

  private initGoogleAuth() {
    const checkGoogle = setInterval(() => {
      if (window.google) {
        clearInterval(checkGoogle);
        window.google.accounts.id.initialize({
          client_id: '977952175712-i072hpkjgq51ualf0hlkgj4boa48f0mp.apps.googleusercontent.com',
          callback: (response: GoogleCredentialResponse) => this.handleCredentialResponse(response),
        });
        window.google.accounts.id.renderButton(document.getElementById('googleBtn'), {
          theme: 'filled_blue',
          size: 'large',
          width: 320,
        });
      }
    }, 100);
  }

  handleCredentialResponse(response: GoogleCredentialResponse) {
    this.ngZone.run(() => {
      this.loading.set(true);
      this.error.set(null);
      this.authService.handleGoogleLogin(response.credential).subscribe({
        next: () => this.loading.set(false),
        error: () => {
          this.loading.set(false);
          this.error.set("No se pudo conectar con el servidor. ¿Hiciste 'make dev'?");
        },
      });
    });
  }
}
