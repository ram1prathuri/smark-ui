import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Simple signal to hold authentication state
  private authenticated = signal<boolean>(false);

  // Expose as readonly signal
  isAuthenticated = this.authenticated.asReadonly();

  constructor() {
    // Check if we have a token in localStorage to persist auth
    const token = localStorage.getItem('app_token');
    if (token) {
      this.authenticated.set(true);
    }
  }

  login(email: string, password: string): Promise<boolean> {
    // Simulate an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          localStorage.setItem('app_token', 'mock_jwt_token_12345');
          this.authenticated.set(true);
          resolve(true);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem('app_token');
    this.authenticated.set(false);
  }
}
