import { Component, Input, TemplateRef, ViewChild, inject } from '@angular/core';
import { UiModalService, UiModalOptions } from './ui-modal.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-template #modalTemplate>
      <div class="ui-modal-container">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
  styles: [`
    .ui-modal-container {
      background: var(--app-surface-card);
      color: var(--app-text-primary);
      border-radius: var(--app-border-radius-lg);
      padding: 24px;
    }
  `]
})
export class UiModalComponent {
  @ViewChild('modalTemplate') template!: TemplateRef<any>;
  
  @Input() width: string = '500px';

  private modalService = inject(UiModalService);
  private dialogRef: MatDialogRef<any> | null = null;

  open(data?: any) {
    if (!this.template) return;
    this.dialogRef = this.modalService.open(this.template, {
      width: this.width,
      data
    });
    return this.dialogRef;
  }

  close(result?: any) {
    if (this.dialogRef) {
      this.dialogRef.close(result);
      this.dialogRef = null;
    }
  }
}
