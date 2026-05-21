import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'body-sm' | 'caption' | 'overline' | 'button-text';
export type TextColor = 'default' | 'primary' | 'accent' | 'secondary' | 'muted' | 'on-primary' | 'on-accent' | 'danger' | 'success' | 'warning';
export type TextWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold';

@Component({
  selector: 'ui-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    @switch (variant()) {
      @case ('h1') { <h1 [id]="textId()" [class]="classes()"><ng-content /></h1> }
      @case ('h2') { <h2 [id]="textId()" [class]="classes()"><ng-content /></h2> }
      @case ('h3') { <h3 [id]="textId()" [class]="classes()"><ng-content /></h3> }
      @case ('h4') { <h4 [id]="textId()" [class]="classes()"><ng-content /></h4> }
      @case ('h5') { <h5 [id]="textId()" [class]="classes()"><ng-content /></h5> }
      @case ('h6') { <h6 [id]="textId()" [class]="classes()"><ng-content /></h6> }
      @case ('overline') { <span [id]="textId()" [class]="classes()"><ng-content /></span> }
      @case ('caption') { <small [id]="textId()" [class]="classes()"><ng-content /></small> }
      @case ('button-text') { <span [id]="textId()" [class]="classes()"><ng-content /></span> }
      @default { <p [id]="textId()" [class]="classes()"><ng-content /></p> }
    }
  `,
  styles: [`
    :host {
      display: inline-block;
      width: 100%;
    }

    .ui-txt {
      margin: 0;
      font-family: 'Inter', 'Roboto', sans-serif;
      transition: color var(--app-transition);
      display: block;
      
      /* Variants */
      &--h1 { font-size: 2.25rem; line-height: 1.25; font-weight: 700; letter-spacing: -0.02em; }
      &--h2 { font-size: 1.875rem; line-height: 1.3; font-weight: 700; letter-spacing: -0.015em; }
      &--h3 { font-size: 1.5rem; line-height: 1.35; font-weight: 600; letter-spacing: -0.01em; }
      &--h4 { font-size: 1.25rem; line-height: 1.4; font-weight: 600; }
      &--h5 { font-size: 1.125rem; line-height: 1.45; font-weight: 600; }
      &--h6 { font-size: 1rem; line-height: 1.5; font-weight: 600; }
      &--body { font-size: 0.9375rem; line-height: 1.6; font-weight: 400; }
      &--body-sm { font-size: 0.875rem; line-height: 1.55; font-weight: 400; }
      &--caption { font-size: 0.75rem; line-height: 1.5; font-weight: 400; }
      &--overline { font-size: 0.75rem; line-height: 1.5; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
      &--button-text { font-size: 0.875rem; line-height: 1; font-weight: 600; letter-spacing: 0.02em; }

      /* Weights overrides */
      &--wt-light { font-weight: 300 !important; }
      &--wt-regular { font-weight: 400 !important; }
      &--wt-medium { font-weight: 500 !important; }
      &--wt-semibold { font-weight: 600 !important; }
      &--wt-bold { font-weight: 700 !important; }

      /* Color adaptive palette mapping */
      &--cl-default { color: var(--app-text-primary); }
      &--cl-secondary { color: var(--app-text-secondary); }
      &--cl-muted { color: var(--app-text-muted); }
      &--cl-primary { color: var(--app-primary); }
      &--cl-accent { color: var(--app-accent); }
      &--cl-on-primary { color: var(--app-primary-contrast); }
      &--cl-on-accent { color: var(--app-accent-contrast); }
      &--cl-danger { color: #ef4444; }
      &--cl-success { color: #10b981; }
      &--cl-warning { color: #f59e0b; }
    }
  `]
})
export class UiTextComponent {
  textId = input<string>('');
  variant = input<TextVariant>('body');
  color = input<TextColor>('default');
  weight = input<TextWeight | ''>('');

  classes(): string {
    let base = `ui-txt ui-txt--${this.variant()} ui-txt--cl-${this.color()}`;
    if (this.weight()) {
      base += ` ui-txt--wt-${this.weight()}`;
    }
    return base;
  }
}
