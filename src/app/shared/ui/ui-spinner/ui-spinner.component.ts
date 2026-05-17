import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="ui-spinner-wrap" [class.ui-spinner--overlay]="overlay()" role="status" [attr.aria-label]="label() || 'Loading'">
      <mat-spinner [diameter]="diameter()" [strokeWidth]="strokeWidth()" class="ui-spinner" />
      @if (label()) {
        <span class="spinner-label">{{ label() }}</span>
      }
    </div>
  `,
  styles: [`
    .ui-spinner-wrap {
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
      &--overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.8); backdrop-filter: blur(4px); z-index: 100; border-radius: inherit; }
    }
    .ui-spinner ::ng-deep circle { stroke: var(--app-primary) !important; }
    .spinner-label { font-size: 13px; color: var(--app-text-muted); }
  `]
})
export class UiSpinnerComponent {
  diameter    = input<number>(40);
  strokeWidth = input<number>(3);
  label       = input<string>('');
  overlay     = input<boolean>(false);
}
