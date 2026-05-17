import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  badge?: string | number;
  children?: NavItem[];
  expanded?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/' },
  {
    id: 'resources', label: 'Resources', icon: 'folder',
    expanded: false,
    children: [
      { id: 'users', label: 'Users', icon: 'people', route: '/users' },
      { id: 'posts', label: 'Posts', icon: 'article', route: '/posts' },
    ]
  },
  { id: 'components', label: 'Components', icon: 'widgets', route: '/components' },
  { id: 'typography', label: 'Typography', icon: 'text_fields', route: '/typography' },
  { id: 'colors', label: 'Colors & Theme', icon: 'palette', route: '/theme-settings', badge: 'NEW' },
  { id: 'forms', label: 'Forms', icon: 'dynamic_form', route: '/forms' },
  { id: 'tables', label: 'Tables', icon: 'table_chart', route: '/tables' },
  { id: 'charts', label: 'Charts', icon: 'bar_chart', route: '/charts' },
  { id: 'settings', label: 'Settings', icon: 'settings', route: '/settings' },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatTooltipModule, MatRippleModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed()" role="navigation" aria-label="Main navigation">
      <!-- Collapse Toggle -->
      <button id="sidebar-collapse-btn"
              class="collapse-btn"
              (click)="collapsed.set(!collapsed())"
              [attr.aria-label]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
              [matTooltip]="collapsed() ? 'Expand' : 'Collapse'"
              matTooltipPosition="right">
        <mat-icon>{{ collapsed() ? 'chevron_right' : 'chevron_left' }}</mat-icon>
      </button>

      <!-- User Profile Card -->
      <div class="user-card" [class.compact]="collapsed()">
        <div class="user-avatar" aria-hidden="true">
          <span class="avatar-text">AD</span>
          <span class="online-dot" title="Online"></span>
        </div>
        @if (!collapsed()) {
          <div class="user-info animate-fadeInUp">
            <span class="user-name">Admin User</span>
            <span class="user-role">Super Administrator</span>
          </div>
        }
      </div>

      <div class="nav-divider" aria-hidden="true"></div>

      <!-- Navigation Links -->
      <nav class="nav-list" role="list">
        @for (item of navItems; track item.id) {

          <!-- Item without children -->
          @if (!item.children) {
            <a [id]="'nav-' + item.id"
               class="nav-item"
               [routerLink]="item.route"
               routerLinkActive="active"
               [routerLinkActiveOptions]="{ exact: item.route === '/' }"
               [attr.aria-label]="item.label"
               [matTooltip]="collapsed() ? item.label : ''"
               matTooltipPosition="right"
               matRipple
               role="listitem">
              <span class="nav-icon-wrap" aria-hidden="true">
                <mat-icon class="nav-icon">{{ item.icon }}</mat-icon>
              </span>
              @if (!collapsed()) {
                <span class="nav-label">{{ item.label }}</span>
                @if (item.badge) {
                  <span class="nav-badge">{{ item.badge }}</span>
                }
              }
              <span class="active-indicator" aria-hidden="true"></span>
            </a>
          }

          <!-- Item with children -->
          @if (item.children) {
            <div class="nav-group" role="listitem">
              <button class="nav-item"
                      (click)="toggleExpand(item)"
                      [attr.aria-expanded]="item.expanded"
                      [matTooltip]="collapsed() ? item.label : ''"
                      matTooltipPosition="right"
                      matRipple>
                <span class="nav-icon-wrap" aria-hidden="true">
                  <mat-icon class="nav-icon">{{ item.icon }}</mat-icon>
                </span>
                @if (!collapsed()) {
                  <span class="nav-label">{{ item.label }}</span>
                  <mat-icon class="expand-icon" [class.expanded]="item.expanded">expand_more</mat-icon>
                }
              </button>

              @if (item.expanded && !collapsed()) {
                <div class="nav-children" [@slideInOut]>
                  @for (child of item.children; track child.id) {
                    <a [id]="'nav-' + child.id"
                       class="nav-child-item"
                       [routerLink]="child.route"
                       routerLinkActive="active"
                       matRipple>
                      <span class="nav-icon-wrap" aria-hidden="true">
                        <mat-icon class="nav-icon child-icon">{{ child.icon }}</mat-icon>
                      </span>
                      <span class="nav-label">{{ child.label }}</span>
                    </a>
                  }
                </div>
              }
            </div>
          }
        }
      </nav>

      <div class="sidebar-footer">
        <div class="nav-divider" aria-hidden="true"></div>
        <div class="theme-preview" [class.compact]="collapsed()">
          <div class="color-dots" aria-hidden="true">
            <span class="dot primary-dot" [style.background]="themeService.theme().primary"></span>
            <span class="dot accent-dot" [style.background]="themeService.theme().accent"></span>
          </div>
          @if (!collapsed()) {
            <span class="theme-label">Active Theme</span>
          }
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: var(--app-sidebar-width);
      height: 100%;
      background: var(--app-surface-card);
      border-right: 1px solid var(--app-border);
      display: flex;
      flex-direction: column;
      position: relative;
      transition: width var(--app-transition-slow) cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }
    .sidebar.collapsed { width: var(--app-sidebar-collapsed-width); }

    .collapse-btn {
      position: absolute; top: 72px; right: -14px; width: 28px; height: 28px;
      border-radius: 50%; background: var(--app-primary); color: #fff;
      border: 2px solid var(--app-surface-card); cursor: pointer; display: flex;
      align-items: center; justify-content: center; z-index: 10;
      box-shadow: var(--app-shadow-md); transition: background var(--app-transition), transform var(--app-transition);
      &:hover { background: var(--app-primary-dark); transform: scale(1.1); }
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }

    .user-card {
      display: flex; align-items: center; gap: 12px; padding: 16px; margin: 12px;
      background: linear-gradient(135deg, var(--app-primary), var(--app-accent));
      border-radius: var(--app-border-radius); overflow: hidden; min-height: 68px;
      transition: all var(--app-transition);
      &.compact { justify-content: center; }
    }
    .user-avatar { position: relative; width: 40px; height: 40px; background: rgba(255,255,255,0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .avatar-text { font-size: 13px; font-weight: 700; color: #fff; letter-spacing: 0.5px; }
    .online-dot { position: absolute; bottom: 1px; right: 1px; width: 10px; height: 10px; background: #4caf50; border-radius: 50%; border: 2px solid #fff; }

    .user-info { flex: 1; min-width: 0; }
    .user-name { display: block; font-size: 14px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .user-role { display: block; font-size: 11px; color: rgba(255,255,255,0.75); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .nav-divider { height: 1px; background: var(--app-border); margin: 8px 16px; }

    .nav-list { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 4px 10px; display: flex; flex-direction: column; gap: 2px; }

    .nav-item, .nav-child-item {
      display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: var(--app-border-radius-sm);
      color: var(--app-text-secondary); text-decoration: none; font-size: 14px; font-weight: 500;
      position: relative; overflow: hidden; transition: all var(--app-transition); white-space: nowrap; cursor: pointer;
      border: none; background: transparent; width: 100%; text-align: left; font-family: inherit;
    }
    .nav-item:hover, .nav-child-item:hover {
      background: rgba(0,0,0,0.04); color: var(--app-text-primary);
      .nav-icon { color: var(--app-primary); }
    }
    .nav-item.active, .nav-child-item.active {
      background: color-mix(in srgb, var(--app-primary) 12%, transparent); color: var(--app-primary); font-weight: 600;
      .nav-icon { color: var(--app-primary); }
      .active-indicator { opacity: 1; }
    }

    .nav-child-item { padding-left: 44px; font-size: 13px; }
    .child-icon { font-size: 16px; width: 16px; height: 16px; }

    .nav-group { display: flex; flex-direction: column; }
    .nav-children { display: flex; flex-direction: column; overflow: hidden; }

    .nav-icon-wrap { display: flex; flex-shrink: 0; }
    .nav-icon { font-size: 20px; width: 20px; height: 20px; color: var(--app-text-muted); transition: color var(--app-transition); }

    .nav-label { flex: 1; }
    .nav-badge { background: var(--app-accent); color: #fff; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 10px; letter-spacing: 0.5px; }

    .expand-icon { font-size: 20px; color: var(--app-text-muted); transition: transform 0.3s; &.expanded { transform: rotate(180deg); } }

    .active-indicator { position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 60%; background: var(--app-primary); border-radius: 2px 0 0 2px; opacity: 0; transition: opacity var(--app-transition); }

    .sidebar-footer { padding-bottom: 8px; }
    .theme-preview { display: flex; align-items: center; gap: 8px; padding: 10px 16px; &.compact { justify-content: center; } }
    .color-dots { display: flex; gap: 4px; }
    .dot { width: 14px; height: 14px; border-radius: 50%; border: 2px solid var(--app-border); transition: background var(--app-transition); }
    .theme-label { font-size: 12px; color: var(--app-text-muted); }
  `],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('200ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class SidebarComponent {
  collapsed = signal(false);
  navItems = NAV_ITEMS;
  themeService = inject(ThemeService);

  toggleExpand(item: NavItem): void {
    if (this.collapsed()) {
      this.collapsed.set(false);
    }
    item.expanded = !item.expanded;
  }
}
