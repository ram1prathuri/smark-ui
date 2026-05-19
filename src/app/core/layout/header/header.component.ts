import { Component, inject, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterLink, Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatTooltipModule, MatBadgeModule, RouterLink],
  template: `
    <mat-toolbar class="app-header-toolbar">
      <!-- Left: Menu toggle + Brand -->
      <div class="header-left">
        <button mat-icon-button
                id="sidebar-toggle-btn"
                class="menu-btn"
                (click)="menuToggle.emit()"
                matTooltip="Toggle Sidebar"
                aria-label="Toggle navigation sidebar">
          <mat-icon>menu</mat-icon>
        </button>

        <a routerLink="/" class="brand-link" aria-label="App Home">
          <div class="brand-logo" aria-hidden="true">
            <span class="brand-icon">◈</span>
          </div>
          <div class="brand-text">
            <span class="brand-name">SmarkUI</span>
            <span class="brand-tagline">Component Library</span>
          </div>
        </a>
      </div>

      <!-- Center: Search Bar -->
      <div class="header-search" role="search">
        <mat-icon class="search-icon" aria-hidden="true">search</mat-icon>
        <input type="text"
               id="header-search-input"
               class="search-input"
               placeholder="Search components, pages..."
               aria-label="Search">
        <kbd class="search-kbd" aria-label="Keyboard shortcut">⌘K</kbd>
      </div>

      <!-- Right: Actions -->
      <div class="header-actions">
        <button mat-icon-button
                id="dark-mode-toggle-btn"
                class="action-btn"
                (click)="themeService.toggleDarkMode()"
                [matTooltip]="themeService.isDark() ? 'Light Mode' : 'Dark Mode'"
                [attr.aria-label]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'">
          <mat-icon>{{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>

        <button mat-icon-button
                id="notifications-btn"
                class="action-btn"
                [matBadge]="'3'"
                matBadgeColor="warn"
                matTooltip="Notifications"
                aria-label="View notifications">
          <mat-icon>notifications_none</mat-icon>
        </button>

        <button mat-icon-button
                id="theme-settings-btn"
                class="action-btn"
                routerLink="/theme-settings"
                matTooltip="Theme Settings"
                aria-label="Open theme settings">
          <mat-icon>palette</mat-icon>
        </button>

        <div class="avatar-wrapper">
          <button id="user-avatar-btn"
                  class="avatar-btn"
                  (click)="logout()"
                  aria-label="User menu"
                  matTooltip="Logout">
            <span class="avatar-initials" aria-hidden="true">AD</span>
          </button>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .app-header-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: var(--app-header-height);
      background: var(--app-primary) !important;
      color: var(--app-primary-contrast) !important;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 16px rgba(0,0,0,0.18);
      transition: background var(--app-transition);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    .menu-btn {
      color: rgba(255,255,255,0.9) !important;
      transition: color var(--app-transition), transform var(--app-transition);
      &:hover { color: #fff !important; transform: rotate(90deg); }
    }

    .brand-link {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: inherit;
    }

    .brand-logo {
      width: 36px;
      height: 36px;
      background: rgba(255,255,255,0.18);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
    }

    .brand-icon {
      font-size: 18px;
      font-weight: bold;
      color: #fff;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }

    .brand-name {
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      font-size: 16px;
      letter-spacing: -0.3px;
      color: #fff;
    }

    .brand-tagline {
      font-size: 10px;
      font-weight: 400;
      color: rgba(255,255,255,0.65);
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .header-search {
      flex: 1;
      max-width: 400px;
      margin: 0 32px;
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      font-size: 18px;
      color: rgba(255,255,255,0.6);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      height: 36px;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 20px;
      padding: 0 36px 0 40px;
      color: #fff;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
      outline: none;
      transition: background var(--app-transition), border-color var(--app-transition);
      &::placeholder { color: rgba(255,255,255,0.55); }
      &:focus {
        background: rgba(255,255,255,0.22);
        border-color: rgba(255,255,255,0.4);
      }
    }

    .search-kbd {
      position: absolute;
      right: 12px;
      background: rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.7);
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 11px;
      font-family: monospace;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    .action-btn {
      color: rgba(255,255,255,0.85) !important;
      transition: color var(--app-transition), background var(--app-transition);
      &:hover { color: #fff !important; background: rgba(255,255,255,0.12) !important; }
    }

    .avatar-wrapper { margin-left: 8px; }

    .avatar-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.4);
      background: rgba(255,255,255,0.15);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--app-transition);
      &:hover { background: rgba(255,255,255,0.25); border-color: rgba(255,255,255,0.7); }
    }

    .avatar-initials {
      font-size: 12px;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.5px;
    }

    @media (max-width: 768px) {
      .header-search { display: none; }
      .brand-tagline { display: none; }
    }
  `]
})
export class HeaderComponent {
  menuToggle = output<void>();
  themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

