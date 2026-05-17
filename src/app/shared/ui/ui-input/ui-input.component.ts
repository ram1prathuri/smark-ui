import { Component, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, FormsModule, ReactiveFormsModule],
  template: `
    <mat-form-field class="ui-input" [appearance]="appearance()" [class.ui-input--full]="fullWidth()">
      @if (label()) {
        <mat-label>{{ label() }}</mat-label>
      }
      @if (prefixIcon()) {
        <mat-icon matPrefix class="input-icon-prefix">{{ prefixIcon() }}</mat-icon>
      }
      <input matInput
             [id]="inputId()"
             [type]="type()"
             [placeholder]="placeholder()"
             [formControl]="control()"
             [required]="required()"
             [attr.aria-label]="label() || placeholder()" />
      @if (suffixIcon()) {
        <mat-icon matSuffix class="input-icon-suffix">{{ suffixIcon() }}</mat-icon>
      }
      @if (hint()) {
        <mat-hint>{{ hint() }}</mat-hint>
      }
      @if (control().invalid && control().touched && errorMsg()) {
        <mat-error>{{ errorMsg() }}</mat-error>
      }
    </mat-form-field>
  `,
  styles: [`
    .ui-input {
      &.ui-input--full { width: 100%; }
      ::ng-deep .mat-mdc-form-field-subscript-wrapper { margin-top: 2px; }
      ::ng-deep .mat-mdc-text-field-wrapper { border-radius: var(--app-border-radius-sm) !important; }
    }
    .input-icon-prefix { margin-right: 4px; color: var(--app-text-muted); font-size: 20px; }
    .input-icon-suffix { margin-left: 4px; color: var(--app-text-muted); font-size: 20px; }
  `]
})
export class UiInputComponent {
  inputId     = input<string>('');
  label       = input<string>('');
  placeholder = input<string>('');
  type        = input<string>('text');
  hint        = input<string>('');
  errorMsg    = input<string>('');
  prefixIcon  = input<string>('');
  suffixIcon  = input<string>('');
  required    = input<boolean>(false);
  fullWidth   = input<boolean>(true);
  appearance  = input<'fill' | 'outline'>('outline');
  control     = input<FormControl>(new FormControl(''));
}
