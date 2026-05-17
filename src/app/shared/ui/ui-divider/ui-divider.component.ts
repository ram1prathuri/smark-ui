import { Component, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'ui-divider',
  standalone: true,
  imports: [MatDividerModule],
  template: `
    @if (label()) {
      <div class="ui-divider-labeled">
        <mat-divider class="ui-divider" />
        <span class="divider-label">{{ label() }}</span>
        <mat-divider class="ui-divider" />
      </div>
    } @else {
      <mat-divider class="ui-divider" [vertical]="vertical()" />
    }
  `,
  styles: [`
    .ui-divider {
      border-color: var(--app-border) !important;
    }
    .ui-divider-labeled {
      display: flex;
      align-items: center;
      gap: 12px;
      mat-divider { flex: 1; }
    }
    .divider-label {
      font-size: 12px;
      color: var(--app-text-muted);
      white-space: nowrap;
      font-weight: 500;
    }
  `]
})
export class UiDividerComponent {
  label    = input<string>('');
  vertical = input<boolean>(false);
}
