import { Component, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiTreeNodeComponent } from './ui-tree-node.component';
import { UiTreeNode } from './ui-tree.models';

@Component({
  selector: 'ui-tree',
  standalone: true,
  imports: [CommonModule, UiTreeNodeComponent],
  template: `
    <div class="ui-tree-container">
      @for (node of data; track node.id) {
        <ui-tree-node 
          [node]="node" 
          [depthColors]="depthColors"
          (nodeClick)="onNodeClick($event)">
        </ui-tree-node>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .ui-tree-container {
      padding: 16px;
      overflow-x: auto;
    }
  `]
})
export class UiTreeComponent {
  /** The hierarchical data structure to render */
  @Input({ required: true }) data: UiTreeNode[] = [];

  /** 
   * An array of colors to use for different depths. 
   * It will cycle through these colors based on node depth.
   */
  @Input() depthColors: string[] = [
    'var(--app-primary)',
    'var(--app-accent)',
    'var(--app-success)',
    'var(--app-warning)',
    'var(--app-info)'
  ];

  /** Emitted when any node is clicked */
  nodeClick = output<UiTreeNode>();

  onNodeClick(node: UiTreeNode) {
    this.nodeClick.emit(node);
  }
}
