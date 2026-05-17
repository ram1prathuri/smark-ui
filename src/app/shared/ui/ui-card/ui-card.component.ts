import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export type UiCardVariant = 'default' | 'elevated' | 'outlined' | 'glass' | 'gradient';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="ui-card" [class]="'ui-card--' + variant()" [class.ui-card--hoverable]="hoverable()">
      @if (title() || subtitle() || headerIcon()) {
        <mat-card-header class="ui-card-header">
          @if (headerIcon()) {
            <div class="card-icon-wrap" [class.card-icon--accent]="accentIcon()" aria-hidden="true">
              <mat-icon>{{ headerIcon() }}</mat-icon>
            </div>
          }
          <mat-card-title-group>
            @if (title()) { <mat-card-title class="card-title">{{ title() }}</mat-card-title> }
            @if (subtitle()) { <mat-card-subtitle class="card-subtitle">{{ subtitle() }}</mat-card-subtitle> }
          </mat-card-title-group>
          <div class="card-header-actions">
            <ng-content select="[card-actions-header]" />
          </div>
        </mat-card-header>
      }

      <mat-card-content class="ui-card-content">
        <ng-content />
      </mat-card-content>

      <ng-content select="mat-card-actions" />
    </mat-card>
  `,
  styles: [`
    .ui-card {
      border-radius: var(--app-border-radius) !important;
      overflow: hidden;
      transition: all var(--app-transition);
      padding: 0 !important;

      &--default {
        background: var(--app-surface-card) !important;
        border: 1px solid var(--app-border) !important;
        box-shadow: var(--app-shadow-sm) !important;
      }

      &--elevated {
        background: var(--app-surface-card) !important;
        box-shadow: var(--app-shadow-md) !important;
        border: none !important;
      }

      &--outlined {
        background: transparent !important;
        border: 1.5px solid var(--app-border) !important;
        box-shadow: none !important;
      }

      &--glass {
        background: rgba(255,255,255,0.6) !important;
        backdrop-filter: blur(16px) !important;
        border: 1px solid rgba(255,255,255,0.4) !important;
        box-shadow: var(--app-shadow-md) !important;
      }

      &--gradient {
        background: linear-gradient(135deg, var(--app-primary), var(--app-accent)) !important;
        border: none !important;
        box-shadow: 0 8px 24px color-mix(in srgb, var(--app-primary) 35%, transparent) !important;
        color: #fff !important;
        .card-title { color: #fff !important; }
        .card-subtitle { color: rgba(255,255,255,0.75) !important; }
      }

      &--hoverable:hover {
        transform: translateY(-3px);
        box-shadow: var(--app-shadow-lg) !important;
      }
    }

    .ui-card-header {
      display: flex;
      align-items: center;
      padding: 16px 20px 12px !important;
      gap: 12px;
      border-bottom: 1px solid var(--app-border);
    }

    .card-icon-wrap {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: color-mix(in srgb, var(--app-primary) 12%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      mat-icon { color: var(--app-primary); font-size: 20px; }

      &.card-icon--accent {
        background: color-mix(in srgb, var(--app-accent) 12%, transparent);
        mat-icon { color: var(--app-accent); }
      }
    }

    .card-title {
      font-size: 15px !important;
      font-weight: 600 !important;
      color: var(--app-text-primary) !important;
      margin: 0 !important;
    }

    .card-subtitle {
      font-size: 13px !important;
      color: var(--app-text-muted) !important;
      margin: 2px 0 0 !important;
    }

    .card-header-actions { margin-left: auto; }

    .ui-card-content {
      padding: 20px !important;
    }
  `]
})
export class UiCardComponent {
  variant    = input<UiCardVariant>('default');
  title      = input<string>('');
  subtitle   = input<string>('');
  headerIcon = input<string>('');
  accentIcon = input<boolean>(false);
  hoverable  = input<boolean>(false);
}
