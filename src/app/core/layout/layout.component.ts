import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  template: `
    <div class="app-shell">
      <!-- Fixed Header -->
      <app-header (menuToggle)="sidebar.collapsed.set(!sidebar.collapsed())" />

      <!-- Body below header -->
      <div class="shell-body">
        <!-- Sidebar -->
        <app-sidebar #sidebar />

        <!-- Main Content Area -->
        <main class="shell-main" role="main" id="main-content">
          <div class="content-wrapper">
            <router-outlet />
          </div>
          <app-footer />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .shell-body {
      display: flex;
      flex: 1;
      overflow: hidden;
      margin-top: var(--app-header-height);
    }

    .shell-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-width: 0;
    }

    .content-wrapper {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 24px;
      background: var(--app-bg);
      transition: background var(--app-transition);
    }

    @media (max-width: 768px) {
      app-sidebar {
        position: fixed;
        left: 0;
        top: var(--app-header-height);
        bottom: 0;
        z-index: 900;
        box-shadow: var(--app-shadow-lg);
      }
    }
  `]
})
export class LayoutComponent {}
