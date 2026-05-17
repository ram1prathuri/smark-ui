import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

export type UiButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
export type UiButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatRippleModule],
  template: `
    <button
      [id]="buttonId()"
      class="ui-btn"
      [class]="'ui-btn--' + variant() + ' ui-btn--' + size()"
      [class.ui-btn--loading]="loading()"
      [class.ui-btn--icon-only]="iconOnly()"
      [disabled]="disabled() || loading()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-busy]="loading() || null"
      matRipple
      [matRippleDisabled]="disabled() || loading()"
    >
      @if (loading()) {
        <span class="btn-spinner" aria-hidden="true">
          <mat-spinner diameter="16" strokeWidth="2" />
        </span>
      } @else if (icon() && iconPosition() === 'left') {
        <mat-icon class="btn-icon btn-icon--left" aria-hidden="true">{{ icon() }}</mat-icon>
      }

      @if (!iconOnly()) {
        <span class="btn-label"><ng-content /></span>
      }

      @if (!loading() && icon() && iconPosition() === 'right') {
        <mat-icon class="btn-icon btn-icon--right" aria-hidden="true">{{ icon() }}</mat-icon>
      }
    </button>
  `,
  styles: [`
    .ui-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      border: none;
      border-radius: var(--app-border-radius-sm);
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.2s ease;
      letter-spacing: 0.2px;
      white-space: nowrap;

      &:disabled { opacity: 0.5; cursor: not-allowed; }

      /* Sizes */
      &--sm { height: 32px; padding: 0 14px; font-size: 12px; }
      &--md { height: 40px; padding: 0 20px; font-size: 14px; }
      &--lg { height: 48px; padding: 0 28px; font-size: 15px; }

      /* Variants */
      &--primary {
        background: var(--app-primary);
        color: var(--app-primary-contrast);
        box-shadow: 0 2px 8px color-mix(in srgb, var(--app-primary) 40%, transparent);
        &:hover:not(:disabled) {
          background: var(--app-primary-dark);
          box-shadow: 0 4px 16px color-mix(in srgb, var(--app-primary) 50%, transparent);
          transform: translateY(-1px);
        }
        &:active:not(:disabled) { transform: translateY(0); }
      }

      &--secondary {
        background: transparent;
        color: var(--app-primary);
        border: 1.5px solid var(--app-primary);
        &:hover:not(:disabled) {
          background: color-mix(in srgb, var(--app-primary) 8%, transparent);
          transform: translateY(-1px);
        }
      }

      &--accent {
        background: var(--app-accent);
        color: var(--app-accent-contrast);
        box-shadow: 0 2px 8px color-mix(in srgb, var(--app-accent) 40%, transparent);
        &:hover:not(:disabled) {
          background: var(--app-accent-dark);
          transform: translateY(-1px);
        }
      }

      &--ghost {
        background: transparent;
        color: var(--app-text-secondary);
        &:hover:not(:disabled) {
          background: rgba(0,0,0,0.05);
          color: var(--app-text-primary);
        }
      }

      &--danger {
        background: #ef4444;
        color: #fff;
        &:hover:not(:disabled) { background: #dc2626; transform: translateY(-1px); }
      }

      /* Icon only */
      &--icon-only {
        &.ui-btn--sm { width: 32px; padding: 0; }
        &.ui-btn--md { width: 40px; padding: 0; }
        &.ui-btn--lg { width: 48px; padding: 0; border-radius: 50%; }
      }

      /* Loading */
      &--loading { pointer-events: none; }
    }

    .btn-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      &--left { margin-right: 2px; }
      &--right { margin-left: 2px; }
    }

    .btn-label { line-height: 1; }

    .btn-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class UiButtonComponent {
  buttonId  = input<string>('');
  variant   = input<UiButtonVariant>('primary');
  size      = input<UiButtonSize>('md');
  icon      = input<string>('');
  iconPosition = input<'left' | 'right'>('left');
  iconOnly  = input<boolean>(false);
  loading   = input<boolean>(false);
  disabled  = input<boolean>(false);
  ariaLabel = input<string>('');
  fullWidth  = input<boolean>(false);
}
