import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeColor = 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="ui-badge" [class]="'ui-badge--' + color()" [class.ui-badge--pill]="pill()">
      <ng-content />
    </span>
  `,
  styles: [`
    .ui-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      line-height: 1;

      &--pill { border-radius: 999px; }

      &--primary  { background: color-mix(in srgb, var(--app-primary) 15%, transparent); color: var(--app-primary); }
      &--accent   { background: color-mix(in srgb, var(--app-accent) 15%, transparent); color: var(--app-accent); }
      &--success  { background: #d1fae5; color: #065f46; }
      &--warning  { background: #fef3c7; color: #92400e; }
      &--danger   { background: #fee2e2; color: #991b1b; }
      &--info     { background: #dbeafe; color: #1e40af; }
      &--neutral  { background: var(--app-border); color: var(--app-text-secondary); }
    }
  `]
})
export class UiBadgeComponent {
  color = input<BadgeColor>('primary');
  pill  = input<boolean>(true);
}
