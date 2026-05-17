import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { UiButtonComponent } from '../ui-button/ui-button.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-modal-wrapper',
  standalone: true,
  imports: [CommonModule, MatDialogModule, UiButtonComponent, MatIconModule],
  template: `
    <div class="ui-modal-container">
      <div class="ui-modal-header">
        <h2 class="ui-modal-title">{{ data.title }}</h2>
        <button mat-icon-button class="ui-modal-close" (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <div class="ui-modal-content">
        <p>{{ data.message }}</p>
      </div>

      <div class="ui-modal-footer">
        @if (!data.hideCancel) {
          <ui-button variant="ghost" (click)="close(false)">{{ data.cancelText }}</ui-button>
        }
        <ui-button [variant]="data.variant" (click)="close(true)">{{ data.confirmText }}</ui-button>
      </div>
    </div>
  `,
  styles: [`
    .ui-modal-container {
      display: flex;
      flex-direction: column;
      background: var(--app-surface-card);
      color: var(--app-text-primary);
      border-radius: var(--app-border-radius-lg);
      overflow: hidden;
    }

    .ui-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid var(--app-border);
    }

    .ui-modal-title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }

    .ui-modal-close {
      color: var(--app-text-muted);
      margin: -8px -8px -8px 0;
    }

    .ui-modal-content {
      padding: 24px;
      font-size: 15px;
      line-height: 1.5;
      color: var(--app-text-secondary);
      p { margin: 0; }
    }

    .ui-modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      background: var(--app-background);
      border-top: 1px solid var(--app-border);
    }
  `]
})
export class UiModalWrapperComponent {
  dialogRef = inject(MatDialogRef<UiModalWrapperComponent>);
  data = inject(MAT_DIALOG_DATA);

  close(result?: any) {
    this.dialogRef.close(result);
  }
}
