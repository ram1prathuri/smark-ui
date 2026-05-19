import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UiCardComponent } from '../../../shared/ui/ui-card/ui-card.component';
import { UiInputComponent } from '../../../shared/ui/ui-input/ui-input.component';
import { UiButtonComponent } from '../../../shared/ui/ui-button/ui-button.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, UiCardComponent, UiInputComponent, UiButtonComponent, MatIconModule, MatSnackBarModule],
  template: `
    <div class="login-layout">
      <!-- Background elements -->
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      
      <div class="login-container animate-fadeInUp">
        <div class="login-header">
          <div class="logo">
            <mat-icon>layers</mat-icon>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to access the SmarkUI Dashboard</p>
        </div>

        <ui-card variant="elevated" class="login-card">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            
            <ui-input
              label="Email Address"
              [control]="loginForm.controls.email"
              type="email"
              placeholder="admin@example.com"
              prefixIcon="mail"
            />
            
            <ui-input
              label="Password"
              [control]="loginForm.controls.password"
              type="password"
              placeholder="••••••••"
              prefixIcon="lock"
            />

            <div class="form-actions">
              <ui-button 
                variant="primary" 
                type="submit" 
                [fullWidth]="true" 
                [loading]="isLoading()"
                [disabled]="loginForm.invalid || isLoading()">
                Sign In
              </ui-button>
            </div>
          </form>

          <div class="demo-credentials">
            <small>Demo credentials:<br/><strong>admin&#64;example.com</strong> / <strong>any password</strong></small>
          </div>
        </ui-card>
      </div>
    </div>
  `,
  styles: [`
    .login-layout {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--app-background);
      overflow: hidden;
      z-index: 9999; /* Ensure it overlays everything if needed, though routing handles it */
    }

    /* Decorative background shapes */
    .bg-shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      z-index: 0;
      opacity: 0.5;
    }
    .shape-1 {
      top: -10%;
      left: -5%;
      width: 500px;
      height: 500px;
      background: var(--app-primary);
    }
    .shape-2 {
      bottom: -15%;
      right: -10%;
      width: 600px;
      height: 600px;
      background: var(--app-accent);
    }

    .login-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 420px;
      padding: 20px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, var(--app-primary), var(--app-accent));
      color: white;
      border-radius: 16px;
      margin-bottom: 16px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
      
      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
    }
    .login-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: var(--app-text-primary);
      margin: 0 0 8px;
    }
    .login-header p {
      font-size: 15px;
      color: var(--app-text-secondary);
      margin: 0;
    }

    .login-card {
      padding: 32px 24px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-actions {
      margin-top: 12px;
    }

    .demo-credentials {
      margin-top: 24px;
      text-align: center;
      padding-top: 16px;
      border-top: 1px solid var(--app-border);
      color: var(--app-text-muted);
      
      small {
        font-size: 13px;
        line-height: 1.6;
      }
      strong {
        color: var(--app-text-primary);
      }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(false);

  loginForm = this.fb.nonNullable.group({
    email: ['admin@example.com', [Validators.required, Validators.email]],
    password: ['password123', [Validators.required, Validators.minLength(6)]]
  });

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    const { email, password } = this.loginForm.getRawValue();

    try {
      await this.authService.login(email, password);
      this.snackBar.open('Login successful!', 'Close', { duration: 2000 });
      this.router.navigate(['/']); // Redirect to dashboard
    } catch (error) {
      this.snackBar.open('Invalid credentials.', 'Close', { duration: 3000, panelClass: 'error-snackbar' });
    } finally {
      this.isLoading.set(false);
    }
  }
}
