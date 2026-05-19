import { Component, Input, output, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { UiTreeNode } from './ui-tree.models';

@Component({
  selector: 'ui-tree-node',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  animations: [
    trigger('expandCollapse', [
      state('expanded', style({ height: '*', opacity: 1, paddingBottom: '8px' })),
      state('collapsed', style({ height: '0', opacity: 0, paddingBottom: '0', overflow: 'hidden' })),
      transition('expanded <=> collapsed', [
        animate('250ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ])
  ],
  template: `
    <div class="tree-node-wrapper">
      <!-- Node Content Box -->
      <div 
        class="tree-node-box" 
        [class.has-children]="hasChildren"
        [class.is-expanded]="node.expanded"
        [style.border-color]="nodeColor"
        [style.background-color]="nodeBgColor"
        (click)="toggleExpanded($event)"
      >
        <div class="tree-node-content">
          @if (hasChildren) {
            <mat-icon class="expand-icon" [style.color]="nodeColor">
              {{ node.expanded ? 'expand_more' : 'chevron_right' }}
            </mat-icon>
          } @else {
            <span class="no-children-spacer"></span>
          }
          
          @if (node.icon) {
            <mat-icon class="node-icon" [style.color]="nodeColor">{{ node.icon }}</mat-icon>
          }
          
          <span class="node-label" [style.color]="nodeTextColor">{{ node.label }}</span>
        </div>
      </div>

      <!-- Recursive Children Container -->
      @if (hasChildren) {
        <div class="tree-children-container" 
             [@expandCollapse]="node.expanded ? 'expanded' : 'collapsed'"
             [style.border-left-color]="nodeColor">
          @for (child of node.children; track child.id) {
            <div class="tree-child-item">
              <!-- Horizontal connector line -->
              <div class="tree-line-horizontal" [style.border-bottom-color]="nodeColor"></div>
              
              <!-- Recursive call -->
              <ui-tree-node 
                [node]="child" 
                [depth]="depth + 1"
                [depthColors]="depthColors"
                (nodeClick)="onChildClick($event)">
              </ui-tree-node>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .tree-node-wrapper {
      position: relative;
    }

    .tree-node-box {
      display: inline-flex;
      align-items: center;
      padding: 8px 16px 8px 8px;
      border-radius: var(--app-border-radius-lg);
      border: 2px solid;
      background-color: var(--app-surface-card);
      cursor: default;
      transition: all var(--app-transition);
      margin-bottom: 8px;
      box-shadow: var(--app-shadow-sm);
      min-width: 150px;
    }

    .tree-node-box.has-children {
      cursor: pointer;
    }

    .tree-node-box.has-children:hover {
      box-shadow: var(--app-shadow-md);
      transform: translateY(-1px);
      filter: brightness(1.05);
    }

    .tree-node-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .expand-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      transition: transform var(--app-transition);
    }

    .no-children-spacer {
      width: 20px;
    }

    .node-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      opacity: 0.8;
    }

    .node-label {
      font-size: 14px;
      font-weight: 500;
      font-family: 'Inter', sans-serif;
    }

    /* Children Layout with Connecting Lines */
    .tree-children-container {
      margin-left: 20px;
      padding-left: 24px;
      border-left: 2px solid;
      position: relative;
    }

    .tree-child-item {
      position: relative;
    }

    /* The horizontal line that connects the vertical border to the child node */
    .tree-line-horizontal {
      position: absolute;
      left: -24px;
      top: 18px; /* Aligns with the middle of the child box (approx 36px/2) */
      width: 16px;
      border-bottom: 2px solid;
    }

    /* Ensure the vertical line stops at the last child by masking the bottom */
    .tree-child-item:last-child::after {
      content: '';
      position: absolute;
      left: -26px; /* -24px padding + -2px border */
      top: 20px; /* Hide from the horizontal line downwards */
      bottom: -10px;
      width: 6px;
      background-color: var(--app-background); /* Needs to match page background */
    }
  `]
})
export class UiTreeNodeComponent {
  @Input({ required: true }) node!: UiTreeNode;
  @Input() depth: number = 0;
  
  // Default theme colors for different depths if none provided
  @Input() depthColors: string[] = [
    'var(--app-primary)',
    'var(--app-accent)',
    'var(--app-success)',
    'var(--app-warning)',
    'var(--app-info)'
  ];

  nodeClick = output<UiTreeNode>();

  get hasChildren(): boolean {
    return !!this.node.children && this.node.children.length > 0;
  }

  get nodeColor(): string {
    if (this.node.color) {
      return this.node.color;
    }
    // Loop through colors based on depth
    const index = this.depth % this.depthColors.length;
    return this.depthColors[index];
  }

  get nodeBgColor(): string {
    // Return a translucent version of the primary color for background, or surface color
    // A simple hack without color-mix is to rely on CSS variables or just use a surface card
    return 'var(--app-surface-card)';
  }

  get nodeTextColor(): string {
    return 'var(--app-text-primary)';
  }

  toggleExpanded(event: Event) {
    if (this.hasChildren) {
      event.stopPropagation();
      this.node.expanded = !this.node.expanded;
    }
    this.nodeClick.emit(this.node);
  }

  onChildClick(childNode: UiTreeNode) {
    this.nodeClick.emit(childNode);
  }
}
