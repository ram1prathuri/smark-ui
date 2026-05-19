import { Injectable, signal } from '@angular/core';
import { ComponentMetadata, PageMetadata } from './page-builder.models';

@Injectable({
  providedIn: 'root'
})
export class PageBuilderService {
  private _canvasComponents = signal<ComponentMetadata[]>([]);
  private _selectedComponent = signal<ComponentMetadata | null>(null);
  
  canvasComponents = this._canvasComponents.asReadonly();
  selectedComponent = this._selectedComponent.asReadonly();

  // Create a deep copy of a palette item so we can edit it independently
  cloneFromPalette(paletteItem: ComponentMetadata): ComponentMetadata {
    return {
      id: `${paletteItem.type}_${new Date().getTime()}_${Math.floor(Math.random() * 1000)}`,
      type: paletteItem.type,
      properties: { ...paletteItem.properties },
      ...(paletteItem.children ? { children: paletteItem.children.map(c => this.cloneFromPalette(c)) } : {})
    };
  }

  setCanvas(components: ComponentMetadata[]) {
    this._canvasComponents.set([...components]);
  }

  selectComponent(component: ComponentMetadata | null) {
    this._selectedComponent.set(component);
  }

  updateSelectedComponent(properties: Record<string, any>) {
    const selected = this._selectedComponent();
    if (!selected) return;

    const updatedSelected = { ...selected, properties: { ...selected.properties, ...properties } };
    this._selectedComponent.set(updatedSelected);

    const updateTree = (nodes: ComponentMetadata[]): ComponentMetadata[] => {
      return nodes.map(node => {
        if (node.id === updatedSelected.id) return updatedSelected;
        if (node.children) return { ...node, children: updateTree(node.children) };
        return node;
      });
    };
    
    this._canvasComponents.set(updateTree(this._canvasComponents()));
  }

  deleteComponent(id: string) {
    const deleteFromTree = (nodes: ComponentMetadata[]): ComponentMetadata[] => {
      return nodes.filter(node => node.id !== id).map(node => {
        if (node.children) return { ...node, children: deleteFromTree(node.children) };
        return node;
      });
    };
    
    this._canvasComponents.set(deleteFromTree(this._canvasComponents()));
    if (this._selectedComponent()?.id === id) {
      this._selectedComponent.set(null);
    }
  }

  triggerUpdate() {
    // Force a signal update when CDK drag-and-drop mutates the array directly.
    // We deep clone via structuredClone to ensure Angular change detection catches nested list mutations.
    this._canvasComponents.set(structuredClone(this._canvasComponents()));
  }

  exportMetadata(): PageMetadata {
    return {
      id: `page_${new Date().getTime()}`,
      title: 'Custom Built Page',
      components: this._canvasComponents()
    };
  }
}
