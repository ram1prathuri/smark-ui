import { Injectable, inject, TemplateRef, Type } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UiModalWrapperComponent } from './ui-modal-wrapper.component';

export interface UiModalOptions<T = any> extends MatDialogConfig {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  hideCancel?: boolean;
  variant?: 'primary' | 'danger' | 'warning' | 'info';
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class UiModalService {
  private dialog = inject(MatDialog);

  /**
   * Opens a standard confirmation/alert modal using the DesignSys wrapper.
   */
  openConfirm(options: UiModalOptions): MatDialogRef<UiModalWrapperComponent> {
    const config: MatDialogConfig = {
      width: '400px',
      panelClass: 'ui-modal-panel',
      backdropClass: 'ui-modal-backdrop',
      ...options,
      data: {
        title: options.title || 'Confirm',
        message: options.message,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        hideCancel: options.hideCancel || false,
        variant: options.variant || 'primary',
        customData: options.data
      }
    };
    return this.dialog.open(UiModalWrapperComponent, config);
  }

  /**
   * Opens a custom component or template inside a standard MatDialog.
   */
  open<T>(componentOrTemplateRef: Type<T> | TemplateRef<T>, options?: MatDialogConfig): MatDialogRef<any> {
    return this.dialog.open(componentOrTemplateRef, {
      panelClass: 'ui-modal-panel',
      backdropClass: 'ui-modal-backdrop',
      ...options
    });
  }
}
