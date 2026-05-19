import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="app-footer" role="contentinfo">
      <div class="footer-inner">
        <span class="footer-copy">© 2026 <strong>SmarkUI</strong>. All rights reserved.</span>
        <div class="footer-links" role="list">
          <a routerLink="/" class="footer-link" role="listitem">Home</a>
          <a routerLink="/theme-settings" class="footer-link" role="listitem">Themes</a>
          <a routerLink="/components" class="footer-link" role="listitem">Components</a>
        </div>
        <span class="footer-version">v1.0.0 · Angular {{ ngVersion }}</span>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      height: 48px;
      background: var(--app-surface-card);
      border-top: 1px solid var(--app-border);
      display: flex;
      align-items: center;
      padding: 0 24px;
      flex-shrink: 0;
    }
    .footer-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
    .footer-copy, .footer-version {
      font-size: 12px;
      color: var(--app-text-muted);
    }
    .footer-links {
      display: flex;
      gap: 20px;
    }
    .footer-link {
      font-size: 12px;
      color: var(--app-text-secondary);
      text-decoration: none;
      transition: color var(--app-transition);
      &:hover { color: var(--app-primary); }
    }
    @media (max-width: 640px) {
      .footer-copy, .footer-version { display: none; }
    }
  `]
})
export class FooterComponent {
  ngVersion = '19';
}
