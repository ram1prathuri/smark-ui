import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, copyArrayItem, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UiButtonComponent } from '../../shared/ui';
import { DynamicWidgetComponent } from '../../core/dynamic-renderer/dynamic-widget.component';
import { PageBuilderService } from './page-builder.service';
import { WIDGET_PALETTE, ComponentMetadata } from './page-builder.models';

@Component({
  selector: 'app-page-builder',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, DragDropModule, 
    MatIconModule, MatButtonModule, MatTooltipModule,
    UiButtonComponent, 
    DynamicWidgetComponent
  ],
  template: `
    <div class="builder-layout animate-fadeInUp">
      
      <!-- HEADER -->
      <div class="builder-header">
        <div>
          <h1 class="page-title">Page Builder</h1>
          <p class="page-subtitle">Drag and drop components to design your page</p>
        </div>
        <div class="header-actions">
          <ui-button variant="secondary" icon="visibility">Preview</ui-button>
          <ui-button variant="primary" icon="save" (click)="saveDesign()">Save Design</ui-button>
        </div>
      </div>

      <div class="builder-workspace" cdkDropListGroup>
        
        <!-- LEFT: Palette -->
        <div class="sidebar palette-sidebar">
          <h3>Components</h3>
          <div 
            class="palette-list"
            id="paletteList"
            cdkDropList
            [cdkDropListData]="palette"
            cdkDropListSortingDisabled>
            
            @for (item of palette; track item.id) {
              <div class="palette-item" cdkDrag [cdkDragData]="item">
                <mat-icon>{{ getIconForType(item.type) }}</mat-icon>
                <span>{{ item.type }}</span>
                <!-- Custom drag preview to look nicer -->
                <div *cdkDragPreview class="drag-preview">
                   <mat-icon>{{ getIconForType(item.type) }}</mat-icon> {{ item.type }}
                </div>
              </div>
            }
          </div>
        </div>

        <!-- CENTER: Canvas -->
        <div class="canvas-area">
          <div class="canvas-wrapper">
            <ng-container *ngTemplateOutlet="canvasNodeTemplate; context: { nodes: canvasComponents() }"></ng-container>
          </div>
        </div>

        <ng-template #canvasNodeTemplate let-nodes="nodes" let-isHorizontal="isHorizontal">
          <div 
            class="canvas-list"
            cdkDropList
            [cdkDropListData]="nodes"
            (cdkDropListDropped)="onDrop($event)"
            [class.horizontal]="isHorizontal"
            [class.empty]="nodes.length === 0">
            
            @if (nodes.length === 0) {
              <div class="empty-placeholder">Drop items here</div>
            }

            @for (comp of nodes; track comp.id) {
              <div 
                class="canvas-item" 
                cdkDrag 
                [cdkDragData]="comp"
                (click)="selectComponent(comp); $event.stopPropagation()"
                [class.selected]="selectedComponent()?.id === comp.id"
                [class.layout-item]="comp.type === 'CONTAINER' || comp.type === 'COLUMNS'">
                
                <div class="item-actions">
                  <button mat-icon-button class="delete-btn" (click)="deleteComponent(comp.id, $event)">
                    <mat-icon>delete</mat-icon>
                  </button>
                  <div class="drag-handle" cdkDragHandle>
                    <mat-icon>drag_handle</mat-icon>
                  </div>
                </div>

                <div class="widget-wrapper">
                  @if (comp.type === 'CONTAINER') {
                    <div class="layout-container" [ngStyle]="{'padding': comp.properties['padding'], 'background-color': comp.properties['backgroundColor']}">
                      <ng-container *ngTemplateOutlet="canvasNodeTemplate; context: { nodes: comp.children || [] }"></ng-container>
                    </div>
                  } @else if (comp.type === 'COLUMNS') {
                    <div class="layout-columns" [ngStyle]="{'gap': comp.properties['gap']}">
                      <ng-container *ngTemplateOutlet="canvasNodeTemplate; context: { nodes: comp.children || [], isHorizontal: true }"></ng-container>
                    </div>
                  } @else {
                    <app-dynamic-widget [metadata]="comp"></app-dynamic-widget>
                  }
                </div>
              </div>
            }
          </div>
        </ng-template>

        <!-- RIGHT: Properties Panel -->
        <div class="sidebar properties-sidebar">
          <h3>Properties</h3>
          
          @if (selectedComponent()) {
            <div class="properties-form">
              <p class="selected-type">Editing: <strong>{{ selectedComponent()!.type }}</strong></p>
              
              <form [formGroup]="propertiesForm">
                <!-- Dynamically render inputs based on properties map keys -->
                @for (key of getPropertyKeys(); track key) {
                  <div class="form-field">
                    <label>{{ key }}</label>
                    <input class="prop-input" [formControlName]="key" (input)="onPropertyChange()" />
                  </div>
                }
              </form>
            </div>
          } @else {
            <div class="empty-properties">
              <mat-icon>tune</mat-icon>
              <p>Select a component on the canvas to edit its properties.</p>
            </div>
          }
        </div>

      </div>
    </div>
  `,
  styles: [`
    .builder-layout { display: flex; flex-direction: column; height: calc(100vh - var(--app-header-height) - 40px); margin: -20px; background: var(--app-background); }
    .builder-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid var(--app-border); background: var(--app-surface-card); }
    .page-title { font-size: 24px; font-weight: 700; margin: 0 0 4px; }
    .page-subtitle { font-size: 14px; color: var(--app-text-muted); margin: 0; }
    .header-actions { display: flex; gap: 12px; }

    .builder-workspace { display: flex; flex: 1; overflow: hidden; }

    .sidebar { width: 300px; background: var(--app-surface-card); border-right: 1px solid var(--app-border); display: flex; flex-direction: column; }
    .properties-sidebar { border-right: none; border-left: 1px solid var(--app-border); width: 320px; }
    .sidebar h3 { padding: 16px 20px; margin: 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--app-border); color: var(--app-text-secondary); }

    /* Palette */
    .palette-list { padding: 16px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
    .palette-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--app-background); border: 1px solid var(--app-border); border-radius: 8px; cursor: grab; font-weight: 500; font-size: 14px; transition: all 0.2s; }
    .palette-item:hover { border-color: var(--app-primary); color: var(--app-primary); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .palette-item mat-icon { opacity: 0.7; }
    
    .drag-preview { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--app-primary); color: #fff; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); font-weight: 500; }

    /* Canvas */
    .canvas-area { flex: 1; padding: 32px; overflow-y: auto; background: var(--app-background-alt, #f8f9fa); display: flex; justify-content: center; }
    /* Dark mode override for canvas bg */
    :host-context(body.dark-theme) .canvas-area { background: #0f1115; }
    
    .canvas-wrapper { width: 100%; max-width: 800px; min-height: 500px; background: var(--app-surface-card); border-radius: 12px; box-shadow: var(--app-shadow-md); border: 1px solid var(--app-border); }
    .canvas-list { min-height: 60px; padding: 16px; display: flex; flex-direction: column; gap: 16px; border: 1px dashed var(--app-border); border-radius: 8px; background: rgba(0,0,0,0.02); position: relative; }
    .canvas-wrapper > .canvas-list { min-height: 500px; padding: 24px; border: none; background: transparent; }
    
    .canvas-list.empty { justify-content: center; align-items: center; }
    .empty-placeholder { color: var(--app-text-muted); font-size: 13px; font-style: italic; pointer-events: none; }
    .canvas-list.horizontal { flex-direction: row; }
    .canvas-list.horizontal > .canvas-item { flex: 1; min-width: 0; }
    
    .empty-canvas { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--app-text-muted); opacity: 0.6; padding: 40px; }
    .empty-canvas mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; }

    .canvas-item { position: relative; border: 2px dashed transparent; border-radius: 8px; padding: 8px; transition: all 0.2s; }
    .canvas-item:hover { border-color: var(--app-border); }
    .canvas-item.selected { border-color: var(--app-primary); border-style: solid; background: rgba(var(--app-primary-rgb), 0.02); }
    
    .widget-wrapper { pointer-events: none; } /* Prevent clicking inside the widget from stealing focus while in builder */
    .layout-container, .layout-columns { pointer-events: auto; }

    .item-actions { position: absolute; top: -14px; right: 16px; display: none; background: var(--app-surface-card); border: 1px solid var(--app-border); border-radius: 20px; padding: 2px; box-shadow: var(--app-shadow-sm); z-index: 10; }
    .canvas-item:hover .item-actions, .canvas-item.selected .item-actions { display: flex; align-items: center; }
    .drag-handle { cursor: grab; padding: 4px; display: flex; align-items: center; color: var(--app-text-muted); }
    .drag-handle:hover { color: var(--app-text-primary); }
    .delete-btn { width: 28px; height: 28px; line-height: 28px; color: var(--app-danger); }
    .delete-btn mat-icon { font-size: 18px; width: 18px; height: 18px; }

    /* CDK Drag & Drop styles */
    .cdk-drag-placeholder { opacity: 0.3; background: var(--app-border); border-radius: 8px; }
    .cdk-drag-animating { transition: transform 250ms cubic-bezier(0, 0, 0.2, 1); }
    .canvas-list.cdk-drop-list-dragging .canvas-item:not(.cdk-drag-placeholder) { transition: transform 250ms cubic-bezier(0, 0, 0.2, 1); }

    /* Properties */
    .properties-form { padding: 20px; }
    .selected-type { margin: 0 0 20px; font-size: 13px; color: var(--app-text-secondary); }
    .selected-type strong { color: var(--app-primary); }
    
    .form-field { margin-bottom: 16px; display: flex; flex-direction: column; gap: 6px; }
    .form-field label { font-size: 12px; font-weight: 600; color: var(--app-text-secondary); text-transform: uppercase; }
    .prop-input { height: 36px; padding: 0 12px; border-radius: 6px; border: 1px solid var(--app-border); background: var(--app-background); color: var(--app-text-primary); font-family: inherit; font-size: 14px; outline: none; transition: border-color 0.2s; }
    .prop-input:focus { border-color: var(--app-primary); }
    
    .empty-properties { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; text-align: center; color: var(--app-text-muted); opacity: 0.7; }
    .empty-properties mat-icon { font-size: 32px; width: 32px; height: 32px; margin-bottom: 12px; }
  `]
})
export class PageBuilderComponent {
  private builderService = inject(PageBuilderService);
  private fb = inject(FormBuilder);

  palette = WIDGET_PALETTE;
  canvasComponents = this.builderService.canvasComponents;
  selectedComponent = this.builderService.selectedComponent;

  propertiesForm: FormGroup = this.fb.group({});

  getIconForType(type: string): string {
    const icons: Record<string, string> = {
      'BUTTON': 'smart_button',
      'ALERT': 'announcement',
      'DIVIDER': 'horizontal_rule',
      'CARD': 'crop_square',
      'INPUT': 'edit'
    };
    return icons[type] || 'widgets';
  }

  onDrop(event: CdkDragDrop<ComponentMetadata[]>) {
    if (event.previousContainer === event.container) {
      // Reordering within canvas
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.builderService.triggerUpdate();
    } else {
      // Dropped from palette or another container
      const isFromPalette = event.previousContainer.id === 'paletteList';
      let item = event.previousContainer.data[event.previousIndex];
      
      if (isFromPalette) {
        item = this.builderService.cloneFromPalette(item);
        event.container.data.splice(event.currentIndex, 0, item);
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }
      
      this.builderService.triggerUpdate();
      
      if (isFromPalette) {
        this.selectComponent(item);
      }
    }
  }

  selectComponent(comp: ComponentMetadata) {
    this.builderService.selectComponent(comp);
    
    // Rebuild form based on component properties
    this.propertiesForm = this.fb.group({});
    Object.keys(comp.properties).forEach(key => {
      this.propertiesForm.addControl(key, this.fb.control(comp.properties[key]));
    });
  }

  deleteComponent(id: string, event: Event | string) {
    if (event instanceof Event) {
      event.stopPropagation();
    }
    this.builderService.deleteComponent(id);
  }

  getPropertyKeys(): string[] {
    const selected = this.selectedComponent();
    return selected ? Object.keys(selected.properties) : [];
  }

  onPropertyChange() {
    this.builderService.updateSelectedComponent(this.propertiesForm.value);
  }

  saveDesign() {
    const metadata = this.builderService.exportMetadata();
    // Simulate saving to a file or database
    console.log('Saved Metadata:', JSON.stringify(metadata, null, 2));
    alert('Design saved! Check console for JSON metadata.');
  }
}
