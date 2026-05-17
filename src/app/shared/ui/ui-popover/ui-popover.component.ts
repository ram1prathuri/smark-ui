import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-popover',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-template #popoverTemplate>
      <div class="ui-popover-container animate-fadeInUp">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
  styles: [`
    .ui-popover-container {
      background: var(--app-surface-card);
      border: 1px solid var(--app-border);
      border-radius: var(--app-border-radius);
      box-shadow: var(--app-shadow-lg);
      padding: 12px;
      min-width: 200px;
      color: var(--app-text-primary);
    }
  `]
})
export class UiPopoverComponent {
  @ViewChild('popoverTemplate') template!: TemplateRef<any>;
}
