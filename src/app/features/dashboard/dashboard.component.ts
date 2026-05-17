import { Component } from '@angular/core';
import { UiStatCardComponent } from '../../shared/ui/ui-stat-card/ui-stat-card.component';
import { UiCardComponent } from '../../shared/ui/ui-card/ui-card.component';
import { UiBadgeComponent } from '../../shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '../../shared/ui/ui-button/ui-button.component';
import { UiAlertComponent } from '../../shared/ui/ui-alert/ui-alert.component';
import { UiChipComponent } from '../../shared/ui/ui-chip/ui-chip.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    UiStatCardComponent, UiCardComponent, UiBadgeComponent,
    UiButtonComponent, UiAlertComponent, UiChipComponent,
    MatIconModule, MatProgressBarModule, MatChipsModule, RouterLink
  ],
  template: `
    <div class="dashboard animate-fadeInUp">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Welcome back, Admin! Here's what's happening today.</p>
        </div>
        <div class="page-header-actions">
          <ui-button variant="secondary" icon="download" size="sm">Export</ui-button>
          <ui-button variant="primary" icon="add" routerLink="/components">New Report</ui-button>
        </div>
      </div>

      <!-- Stats Grid -->
      <section class="stats-grid" aria-label="Key metrics">
        <ui-stat-card value="24,521" label="Total Users" sublabel="Registered accounts" icon="people" trend="+12.5%" [trendUp]="true" [gradient]="true" />
        <ui-stat-card value="$94.2K" label="Revenue" sublabel="Monthly revenue" icon="payments" trend="+8.3%" [trendUp]="true" />
        <ui-stat-card value="1,284" label="Orders" sublabel="This month" icon="shopping_cart" trend="-2.1%" [trendUp]="false" />
        <ui-stat-card value="98.6%" label="Uptime" sublabel="Last 30 days" icon="speed" trend="+0.2%" [trendUp]="true" />
      </section>

      <!-- Alert banner -->
      <ui-alert type="info" title="New Feature Available">
        Visit the <strong>Colors &amp; Theme</strong> screen to customize your application's color palette in real-time.
      </ui-alert>

      <!-- Two-column section -->
      <div class="two-col">
        <!-- Recent Activity -->
        <ui-card title="Recent Activity" subtitle="Last 7 days" headerIcon="history">
          <div class="activity-list" role="list">
            @for (item of activities; track item.id) {
              <div class="activity-item" role="listitem">
                <div class="activity-dot" [class]="'dot--' + item.type" aria-hidden="true"></div>
                <div class="activity-body">
                  <span class="activity-title">{{ item.title }}</span>
                  <span class="activity-time">{{ item.time }}</span>
                </div>
                <ui-badge [color]="item.badge">{{ item.status }}</ui-badge>
              </div>
            }
          </div>
        </ui-card>

        <!-- Quick Actions -->
        <ui-card title="Quick Actions" subtitle="Common tasks" headerIcon="bolt" [accentIcon]="true">
          <div class="quick-actions" role="list">
            @for (action of quickActions; track action.label) {
              <button class="quick-action-btn" role="listitem" [attr.aria-label]="action.label">
                <div class="qa-icon" [style.background]="action.bg">
                  <mat-icon [style.color]="action.color">{{ action.icon }}</mat-icon>
                </div>
                <span class="qa-label">{{ action.label }}</span>
                <mat-icon class="qa-arrow">chevron_right</mat-icon>
              </button>
            }
          </div>
        </ui-card>
      </div>

      <!-- Tech Stack Card -->
      <ui-card title="Component Library" subtitle="Available UI components" headerIcon="widgets" variant="elevated">
        <div class="lib-grid">
          @for (comp of components; track comp) {
            <ui-chip color="primary">{{ comp }}</ui-chip>
          }
        </div>
        <div style="margin-top:16px">
          <ui-button variant="secondary" icon="open_in_new" iconPosition="right" routerLink="/components">
            View All Components
          </ui-button>
        </div>
      </ui-card>
    </div>
  `,
  styles: [`
    .dashboard { display: flex; flex-direction: column; gap: 20px; max-width: 1400px; }

    .page-header {
      display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
      flex-wrap: wrap;
    }
    .page-title { font-size: 26px; font-weight: 700; color: var(--app-text-primary); margin: 0 0 4px; }
    .page-subtitle { font-size: 14px; color: var(--app-text-muted); margin: 0; }
    .page-header-actions { display: flex; gap: 10px; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .activity-list { display: flex; flex-direction: column; gap: 12px; }
    .activity-item { display: flex; align-items: center; gap: 12px; }
    .activity-dot {
      width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
      &.dot--success { background: #10b981; }
      &.dot--warning { background: #f59e0b; }
      &.dot--info    { background: #3b82f6; }
      &.dot--danger  { background: #ef4444; }
    }
    .activity-body { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .activity-title { font-size: 13px; font-weight: 500; color: var(--app-text-primary); }
    .activity-time  { font-size: 11px; color: var(--app-text-muted); }

    .quick-actions { display: flex; flex-direction: column; gap: 4px; }
    .quick-action-btn {
      display: flex; align-items: center; gap: 12px; padding: 10px 8px;
      border: none; background: none; cursor: pointer; border-radius: var(--app-border-radius-sm);
      text-align: left; width: 100%; transition: background var(--app-transition);
      &:hover { background: rgba(0,0,0,0.04); }
    }
    .qa-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; mat-icon { font-size: 18px; } }
    .qa-label { flex: 1; font-size: 14px; font-weight: 500; color: var(--app-text-primary); }
    .qa-arrow { color: var(--app-text-muted); font-size: 18px; }

    .lib-grid { display: flex; flex-wrap: wrap; gap: 8px; }

    @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }
    @media (max-width: 600px) { .page-header-actions { flex-direction: column; } }
  `]
})
export class DashboardComponent {
  activities = [
    { id: 1, title: 'New user registered: john@example.com', time: '2 mins ago', badge: 'success' as const, status: 'New', type: 'success' },
    { id: 2, title: 'Order #4521 placed successfully', time: '15 mins ago', badge: 'info' as const, status: 'Completed', type: 'info' },
    { id: 3, title: 'Server memory usage at 85%', time: '1 hr ago', badge: 'warning' as const, status: 'Warning', type: 'warning' },
    { id: 4, title: 'Failed login attempt detected', time: '2 hrs ago', badge: 'danger' as const, status: 'Alert', type: 'danger' },
    { id: 5, title: 'Database backup completed', time: '5 hrs ago', badge: 'success' as const, status: 'Done', type: 'success' },
  ];

  quickActions = [
    { label: 'Create New User', icon: 'person_add', bg: '#ede9fe', color: '#7c3aed' },
    { label: 'View Reports', icon: 'bar_chart', bg: '#dbeafe', color: '#2563eb' },
    { label: 'Manage Theme', icon: 'palette', bg: '#fce7f3', color: '#db2777' },
    { label: 'System Settings', icon: 'settings', bg: '#d1fae5', color: '#059669' },
  ];

  components = [
    'ui-button', 'ui-card', 'ui-input', 'ui-badge',
    'ui-chip', 'ui-alert', 'ui-spinner', 'ui-divider', 'ui-stat-card'
  ];
}
