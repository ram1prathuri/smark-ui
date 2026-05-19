import { Component, inject } from '@angular/core';
import { UiButtonComponent } from '../../shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '../../shared/ui/ui-card/ui-card.component';
import { UiBadgeComponent } from '../../shared/ui/ui-badge/ui-badge.component';
import { UiChipComponent } from '../../shared/ui/ui-chip/ui-chip.component';
import { UiAlertComponent } from '../../shared/ui/ui-alert/ui-alert.component';
import { UiDividerComponent } from '../../shared/ui/ui-divider/ui-divider.component';
import { UiSpinnerComponent } from '../../shared/ui/ui-spinner/ui-spinner.component';
import { UiInputComponent } from '../../shared/ui/ui-input/ui-input.component';
import { UiStatCardComponent } from '../../shared/ui/ui-stat-card/ui-stat-card.component';
import { UiModalComponent } from '../../shared/ui/ui-modal/ui-modal.component';
import { UiModalService } from '../../shared/ui/ui-modal/ui-modal.service';
import { UiPopoverComponent } from '../../shared/ui/ui-popover/ui-popover.component';
import { UiPopoverDirective } from '../../shared/ui/ui-popover/ui-popover.directive';
import { UiTreeComponent } from '../../shared/ui/ui-tree/ui-tree.component';
import { UiTreeNode } from '../../shared/ui/ui-tree/ui-tree.models';
import { FormControl } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [
    UiButtonComponent, UiCardComponent, UiBadgeComponent, UiChipComponent,
    UiAlertComponent, UiDividerComponent, UiSpinnerComponent, UiInputComponent,
    UiStatCardComponent, MatChipsModule, UiModalComponent, UiPopoverComponent,
    UiPopoverDirective, MatIconModule, UiTreeComponent
  ],
  template: `
    <div class="comp-page animate-fadeInUp">
      <div class="page-header">
        <div>
          <h1 class="page-title">Component Library</h1>
          <p class="page-subtitle">All custom UI components extending Angular Material</p>
        </div>
      </div>

      <!-- Overlays -->
      <ui-card title="Overlays" subtitle="Modals and Popovers" headerIcon="layers" variant="elevated">
        <div class="demo-section">
          <p class="demo-label">Modal Examples</p>
          <div class="demo-row">
            <ui-button variant="primary" (click)="openServiceModal()">Open Confirm Modal (Service)</ui-button>
            <ui-button variant="accent" (click)="customModal.open()">Open Declarative Modal</ui-button>
          </div>
          
          <p class="demo-label" style="margin-top: 16px;">Popover Examples</p>
          <div class="demo-row">
            <ui-button variant="secondary" [uiPopover]="demoPopover" popoverTrigger="click">
              Click for Popover
            </ui-button>
            <ui-button variant="ghost" [uiPopover]="demoPopover" popoverTrigger="hover">
              Hover for Popover
            </ui-button>
          </div>

          <!-- Declarative Modal Template -->
          <ui-modal #customModal width="450px">
            <div style="text-align: center; padding: 16px 0;">
              <mat-icon style="font-size: 48px; width: 48px; height: 48px; color: var(--app-primary); margin-bottom: 16px;">celebration</mat-icon>
              <h3 style="margin: 0 0 12px; font-size: 24px;">Custom Modal Content</h3>
              <p style="color: var(--app-text-secondary); margin-bottom: 24px;">
                This modal is defined directly in the template using the <code>&lt;ui-modal&gt;</code> component.
              </p>
              <ui-button variant="primary" [fullWidth]="true" (click)="customModal.close()">Got it!</ui-button>
            </div>
          </ui-modal>

          <!-- Popover Template -->
          <ui-popover #demoPopover>
            <div style="padding: 8px;">
              <h4 style="margin: 0 0 8px; font-size: 14px; font-weight: 600;">Quick Action</h4>
              <p style="margin: 0 0 12px; font-size: 13px; color: var(--app-text-muted);">
                This is a rich popover powered by CDK Overlay.
              </p>
              <ui-button variant="primary" size="sm" [fullWidth]="true">Action</ui-button>
            </div>
          </ui-popover>
        </div>
      </ui-card>

      <!-- Tree View -->
      <ui-card title="Tree View" subtitle="Hierarchical animated data visualization" headerIcon="account_tree" variant="elevated">
        <ui-tree [data]="demoTreeData"></ui-tree>
      </ui-card>

      <!-- Buttons -->
      <ui-card title="ui-button" subtitle="Button variants, sizes, icons, and loading states" headerIcon="smart_button" variant="elevated">
        <div class="demo-section">
          <p class="demo-label">Variants</p>
          <div class="demo-row">
            <ui-button variant="primary">Primary</ui-button>
            <ui-button variant="secondary">Secondary</ui-button>
            <ui-button variant="accent">Accent</ui-button>
            <ui-button variant="ghost">Ghost</ui-button>
            <ui-button variant="danger">Danger</ui-button>
          </div>
          <p class="demo-label">Sizes</p>
          <div class="demo-row items-center">
            <ui-button variant="primary" size="sm">Small</ui-button>
            <ui-button variant="primary" size="md">Medium</ui-button>
            <ui-button variant="primary" size="lg">Large</ui-button>
          </div>
          <p class="demo-label">With Icons</p>
          <div class="demo-row">
            <ui-button variant="primary" icon="add">Add Item</ui-button>
            <ui-button variant="secondary" icon="download" iconPosition="right">Download</ui-button>
            <ui-button variant="accent" icon="send" iconPosition="right">Send</ui-button>
            <ui-button variant="primary" icon="favorite" [iconOnly]="true" size="md" ariaLabel="Favourite" />
          </div>
          <p class="demo-label">States</p>
          <div class="demo-row">
            <ui-button variant="primary" [loading]="true">Loading</ui-button>
            <ui-button variant="secondary" [disabled]="true">Disabled</ui-button>
          </div>
        </div>
      </ui-card>

      <!-- Badges & Chips -->
      <div class="two-col">
        <ui-card title="ui-badge" subtitle="Semantic status labels" headerIcon="label" variant="elevated">
          <div class="demo-row flex-wrap">
            <ui-badge color="primary">Primary</ui-badge>
            <ui-badge color="accent">Accent</ui-badge>
            <ui-badge color="success">Success</ui-badge>
            <ui-badge color="warning">Warning</ui-badge>
            <ui-badge color="danger">Danger</ui-badge>
            <ui-badge color="info">Info</ui-badge>
            <ui-badge color="neutral">Neutral</ui-badge>
          </div>
        </ui-card>

        <ui-card title="ui-chip" subtitle="Filterable tag chips" headerIcon="sell" variant="elevated">
          <mat-chip-set class="demo-row flex-wrap" aria-label="UI chips">
            <ui-chip color="primary" icon="check_circle">Completed</ui-chip>
            <ui-chip color="accent" icon="schedule">Pending</ui-chip>
            <ui-chip color="success" icon="verified">Verified</ui-chip>
            <ui-chip color="warning" icon="warning">Warning</ui-chip>
            <ui-chip color="danger" icon="cancel">Rejected</ui-chip>
          </mat-chip-set>
        </ui-card>
      </div>

      <!-- Alerts -->
      <ui-card title="ui-alert" subtitle="Contextual status messages" headerIcon="announcement" variant="elevated">
        <div class="demo-col">
          <ui-alert type="info" title="Information">This is an informational alert message.</ui-alert>
          <ui-alert type="success" title="Success">Your changes have been saved successfully.</ui-alert>
          <ui-alert type="warning" title="Warning">Please review before proceeding.</ui-alert>
          <ui-alert type="error" title="Error">Something went wrong. Please try again.</ui-alert>
        </div>
      </ui-card>

      <!-- Inputs -->
      <ui-card title="ui-input" subtitle="Form fields with icons and validation" headerIcon="edit" variant="elevated">
        <div class="demo-grid">
          <ui-input label="Full Name" prefixIcon="person" placeholder="John Doe" [control]="nameCtrl" />
          <ui-input label="Email Address" prefixIcon="email" type="email" placeholder="john@example.com" [control]="emailCtrl" />
          <ui-input label="Password" prefixIcon="lock" suffixIcon="visibility" type="password" [control]="passCtrl" />
          <ui-input label="Search" prefixIcon="search" placeholder="Search anything..." appearance="fill" [control]="searchCtrl" />
        </div>
      </ui-card>

      <!-- Stat Cards -->
      <ui-card title="ui-stat-card" subtitle="KPI metric cards for dashboards" headerIcon="bar_chart" variant="elevated">
        <div class="stats-demo">
          <ui-stat-card value="12,400" label="Total Users" icon="people" trend="+14%" [trendUp]="true" [gradient]="true" />
          <ui-stat-card value="$48.2K" label="Revenue" icon="attach_money" trend="+7.2%" [trendUp]="true" />
          <ui-stat-card value="342" label="Open Issues" icon="bug_report" trend="-5%" [trendUp]="false" sublabel="Needs attention" />
        </div>
      </ui-card>

      <!-- Divider -->
      <ui-card title="ui-divider" subtitle="Section separators" headerIcon="horizontal_rule" variant="elevated">
        <div class="demo-col">
          <ui-divider />
          <ui-divider label="OR" />
          <ui-divider label="Section Break" />
        </div>
      </ui-card>

      <!-- Spinner -->
      <ui-card title="ui-spinner" subtitle="Loading indicators" headerIcon="sync" variant="elevated">
        <div class="demo-row items-center">
          <ui-spinner [diameter]="24" label="" />
          <ui-spinner [diameter]="40" label="Loading..." />
          <ui-spinner [diameter]="60" label="Please wait" />
        </div>
      </ui-card>

      <!-- Card Variants -->
      <ui-card title="ui-card" subtitle="Card container variants" headerIcon="crop_square" variant="elevated">
        <div class="card-variants">
          <ui-card variant="default"   title="Default"   subtitle="Standard card" headerIcon="crop_square">Default content</ui-card>
          <ui-card variant="elevated"  title="Elevated"  subtitle="Raised shadow" headerIcon="layers">Elevated content</ui-card>
          <ui-card variant="outlined"  title="Outlined"  subtitle="Border only" headerIcon="border_outer">Outlined content</ui-card>
          <ui-card variant="glass"     title="Glass"     subtitle="Frosted glass" headerIcon="blur_on">Glass content</ui-card>
          <ui-card variant="gradient"  title="Gradient"  subtitle="Colored card" headerIcon="gradient">Gradient content</ui-card>
        </div>
      </ui-card>
    </div>
  `,
  styles: [`
    .comp-page { display: flex; flex-direction: column; gap: 20px; max-width: 1200px; }
    .page-header { margin-bottom: 4px; }
    .page-title { font-size: 26px; font-weight: 700; color: var(--app-text-primary); margin: 0 0 4px; }
    .page-subtitle { font-size: 14px; color: var(--app-text-muted); margin: 0; }
    .demo-label { font-size: 11px; font-weight: 600; color: var(--app-text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin: 12px 0 8px; }
    .demo-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: flex-start; }
    .demo-col { display: flex; flex-direction: column; gap: 10px; }
    .demo-section { display: flex; flex-direction: column; }
    .demo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .flex-wrap { flex-wrap: wrap; }
    .items-center { align-items: center; }
    .stats-demo { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .card-variants { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
    @media (max-width: 768px) {
      .two-col { grid-template-columns: 1fr; }
      .demo-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ComponentsComponent {
  private modalService = inject(UiModalService);

  nameCtrl   = new FormControl('');
  emailCtrl  = new FormControl('');
  passCtrl   = new FormControl('');
  searchCtrl = new FormControl('');

  openServiceModal() {
    this.modalService.openConfirm({
      title: 'Delete Project?',
      message: 'Are you sure you want to delete this project? This action cannot be undone and all associated data will be lost forever.',
      confirmText: 'Yes, Delete',
      cancelText: 'Keep Project',
      variant: 'danger'
    }).afterClosed().subscribe((result: any) => {
      console.log('Modal result:', result);
    });
  }

  demoTreeData: UiTreeNode[] = [
    {
      id: 'root-1',
      label: 'Design System Workspace',
      icon: 'folder',
      expanded: true,
      children: [
        {
          id: 'components',
          label: 'Components',
          icon: 'category',
          expanded: true,
          children: [
            { id: 'btn', label: 'Button', icon: 'smart_button' },
            { id: 'card', label: 'Card', icon: 'crop_square' },
            { id: 'input', label: 'Input', icon: 'edit' }
          ]
        },
        {
          id: 'styles',
          label: 'Styles & Theming',
          icon: 'palette',
          children: [
            { id: 'colors', label: 'Colors' },
            { id: 'typography', label: 'Typography' }
          ]
        }
      ]
    },
    {
      id: 'root-2',
      label: 'Documentation (Custom Colors)',
      icon: 'description',
      color: '#4caf50', // Custom green
      expanded: false,
      children: [
        { id: 'getting-started', label: 'Getting Started', color: '#ff9800' },
        { id: 'api', label: 'API Reference', color: '#2196f3' }
      ]
    }
  ];
}
