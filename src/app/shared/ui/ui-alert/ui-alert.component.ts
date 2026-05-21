import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UiTextComponent } from '../ui-text/ui-text.component';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'ui-alert',
  standalone: true,
  imports: [CommonModule, MatIconModule, UiTextComponent],
  template: `
    <div class="ui-alert" [class]="'ui-alert--' + type()" role="alert">
      <mat-icon class="alert-icon" aria-hidden="true">{{ icons[type()] }}</mat-icon>
      <div class="alert-body" style="width: 100%;">
        @if (title()) {
          <ui-text variant="body-sm" weight="semibold" class="alert-title"><strong style="color: inherit;">{{ title() }}</strong></ui-text>
        }
        <ui-text variant="caption" color="secondary" class="alert-msg"><ng-content /></ui-text>
      </div>
    </div>
  `,
  styles: [`
    .ui-alert {
      display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px;
      border-radius: var(--app-border-radius-sm); border-left: 4px solid;
      transition: all var(--app-transition);

      /* Info alert dynamically adapts to active primary theme colors! */
      &--info {
        background: color-mix(in srgb, var(--app-primary) 8%, var(--app-surface-card));
        border-color: var(--app-primary);
        .alert-icon { color: var(--app-primary); }
        .alert-title { color: var(--app-primary-dark, var(--app-primary)); }
      }

      /* Success alert uses standard alert green */
      &--success {
        background: color-mix(in srgb, #10b981 8%, var(--app-surface-card));
        border-color: #10b981;
        .alert-icon { color: #10b981; }
        .alert-title { color: #065f46; }
      }

      /* Warning alert uses standard alert amber */
      &--warning {
        background: color-mix(in srgb, #f59e0b 8%, var(--app-surface-card));
        border-color: #f59e0b;
        .alert-icon { color: #f59e0b; }
        .alert-title { color: #92400e; }
      }

      /* Error alert uses standard alert red */
      &--error {
        background: color-mix(in srgb, #ef4444 8%, var(--app-surface-card));
        border-color: #ef4444;
        .alert-icon { color: #ef4444; }
        .alert-title { color: #991b1b; }
      }
    }
    .alert-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
    .alert-body { display: flex; flex-direction: column; gap: 2px; }
    .alert-title { font-size: 14px; font-weight: 600; }
    .alert-msg { font-size: 13px; color: var(--app-text-secondary); }

    /* Premium dark-mode adaptive style overrides */
    :host-context(.dark-mode) {
      .ui-alert {
        &--info {
          background: color-mix(in srgb, var(--app-primary) 12%, var(--app-surface-card));
          .alert-title { color: var(--app-primary-light, var(--app-primary)); }
        }
        &--success {
          background: color-mix(in srgb, #10b981 12%, var(--app-surface-card));
          .alert-title { color: #34d399; }
        }
        &--warning {
          background: color-mix(in srgb, #f59e0b 12%, var(--app-surface-card));
          .alert-title { color: #fbbf24; }
        }
        &--error {
          background: color-mix(in srgb, #ef4444 12%, var(--app-surface-card));
          .alert-title { color: #f87171; }
        }
      }
    }
  `]
})
export class UiAlertComponent {
  type  = input<AlertType>('info');
  title = input<string>('');
  icons: Record<AlertType, string> = {
    info: 'info', success: 'check_circle', warning: 'warning', error: 'error'
  };
}
