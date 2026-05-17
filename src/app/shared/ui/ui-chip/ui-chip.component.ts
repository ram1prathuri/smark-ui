import { Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-chip',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule],
  template: `
    <mat-chip class="ui-chip" [class]="'ui-chip--' + color()" [highlighted]="highlighted()">
      @if (icon()) { <mat-icon matChipAvatar>{{ icon() }}</mat-icon> }
      <ng-content />
    </mat-chip>
  `,
  styles: [`
    .ui-chip {
      font-size: 12px !important;
      font-weight: 500 !important;
      transition: all var(--app-transition) !important;

      &--primary  { --mdc-chip-label-text-color: var(--app-primary); background: color-mix(in srgb, var(--app-primary) 12%, transparent) !important; }
      &--accent   { --mdc-chip-label-text-color: var(--app-accent); background: color-mix(in srgb, var(--app-accent) 12%, transparent) !important; }
      &--success  { --mdc-chip-label-text-color: #065f46; background: #d1fae5 !important; }
      &--warning  { --mdc-chip-label-text-color: #92400e; background: #fef3c7 !important; }
      &--danger   { --mdc-chip-label-text-color: #991b1b; background: #fee2e2 !important; }
    }
  `]
})
export class UiChipComponent {
  color       = input<'primary' | 'accent' | 'success' | 'warning' | 'danger'>('primary');
  icon        = input<string>('');
  highlighted = input<boolean>(false);
}
