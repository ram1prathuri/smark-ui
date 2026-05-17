import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-stat-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="stat-card" [class.stat-card--gradient]="gradient()">
      <div class="stat-card-top">
        <div class="stat-icon-wrap" [style.background]="gradient() ? 'rgba(255,255,255,0.2)' : 'color-mix(in srgb, var(--app-primary) 10%, transparent)'">
          <mat-icon class="stat-icon" [style.color]="gradient() ? '#fff' : 'var(--app-primary)'">{{ icon() }}</mat-icon>
        </div>
        <div class="stat-trend" [class.stat-trend--up]="trendUp()" [class.stat-trend--down]="!trendUp()">
          <mat-icon class="trend-icon">{{ trendUp() ? 'trending_up' : 'trending_down' }}</mat-icon>
          <span>{{ trend() }}</span>
        </div>
      </div>
      <div class="stat-value" [style.color]="gradient() ? '#fff' : 'var(--app-text-primary)'">{{ value() }}</div>
      <div class="stat-label" [style.color]="gradient() ? 'rgba(255,255,255,0.8)' : 'var(--app-text-muted)'">{{ label() }}</div>
      @if (sublabel()) {
        <div class="stat-sub" [style.color]="gradient() ? 'rgba(255,255,255,0.65)' : 'var(--app-text-muted)'">{{ sublabel() }}</div>
      }
    </div>
  `,
  styles: [`
    .stat-card {
      background: var(--app-surface-card);
      border: 1px solid var(--app-border);
      border-radius: var(--app-border-radius);
      padding: 20px;
      transition: all var(--app-transition);
      &:hover { transform: translateY(-2px); box-shadow: var(--app-shadow-md); }
      &--gradient {
        background: linear-gradient(135deg, var(--app-primary), var(--app-accent));
        border: none;
        box-shadow: 0 6px 20px color-mix(in srgb, var(--app-primary) 35%, transparent);
      }
    }
    .stat-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
    .stat-icon-wrap { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .stat-icon { font-size: 22px; }
    .stat-trend { display: flex; align-items: center; gap: 2px; font-size: 12px; font-weight: 600;
      &--up   { color: #10b981; }
      &--down { color: #ef4444; }
    }
    .trend-icon { font-size: 14px; width: 14px; height: 14px; }
    .stat-value { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; line-height: 1; margin-bottom: 6px; }
    .stat-label { font-size: 14px; font-weight: 500; margin-bottom: 2px; }
    .stat-sub   { font-size: 12px; margin-top: 4px; }
  `]
})
export class UiStatCardComponent {
  value    = input<string>('0');
  label    = input<string>('');
  sublabel = input<string>('');
  icon     = input<string>('bar_chart');
  trend    = input<string>('');
  trendUp  = input<boolean>(true);
  gradient = input<boolean>(false);
}
