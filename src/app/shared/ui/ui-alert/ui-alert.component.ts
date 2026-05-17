import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'ui-alert',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="ui-alert" [class]="'ui-alert--' + type()" role="alert">
      <mat-icon class="alert-icon" aria-hidden="true">{{ icons[type()] }}</mat-icon>
      <div class="alert-body">
        @if (title()) { <strong class="alert-title">{{ title() }}</strong> }
        <span class="alert-msg"><ng-content /></span>
      </div>
    </div>
  `,
  styles: [`
    .ui-alert {
      display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px;
      border-radius: var(--app-border-radius-sm); border-left: 4px solid;
      &--info    { background: #dbeafe; border-color: #3b82f6; .alert-icon { color: #3b82f6; } }
      &--success { background: #d1fae5; border-color: #10b981; .alert-icon { color: #10b981; } }
      &--warning { background: #fef3c7; border-color: #f59e0b; .alert-icon { color: #f59e0b; } }
      &--error   { background: #fee2e2; border-color: #ef4444; .alert-icon { color: #ef4444; } }
    }
    .alert-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
    .alert-body { display: flex; flex-direction: column; gap: 2px; }
    .alert-title { font-size: 14px; font-weight: 600; color: var(--app-text-primary); }
    .alert-msg { font-size: 13px; color: var(--app-text-secondary); }
  `]
})
export class UiAlertComponent {
  type  = input<AlertType>('info');
  title = input<string>('');
  icons: Record<AlertType, string> = {
    info: 'info', success: 'check_circle', warning: 'warning', error: 'error'
  };
}
