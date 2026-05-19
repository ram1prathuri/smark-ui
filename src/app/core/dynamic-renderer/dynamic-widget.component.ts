import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentMetadata } from '../../features/page-builder/page-builder.models';
import { UiButtonComponent, UiAlertComponent, UiDividerComponent, UiCardComponent } from '../../shared/ui';

@Component({
  selector: 'app-dynamic-widget',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, UiAlertComponent, UiDividerComponent, UiCardComponent],
  template: `
    @switch (metadata.type) {
      @case ('BUTTON') {
        <ui-button 
          [variant]="metadata.properties['variant'] || 'primary'"
          [size]="metadata.properties['size'] || 'md'"
          [fullWidth]="metadata.properties['fullWidth'] || false"
          [icon]="metadata.properties['icon'] || ''">
          {{ metadata.properties['label'] || 'Button' }}
        </ui-button>
      }
      @case ('ALERT') {
        <ui-alert 
          [type]="metadata.properties['type'] || 'info'"
          [title]="metadata.properties['title'] || ''">
          {{ metadata.properties['message'] || '' }}
        </ui-alert>
      }
      @case ('DIVIDER') {
        <ui-divider [label]="metadata.properties['label'] || ''"></ui-divider>
      }
      @case ('CARD') {
        <ui-card 
          [title]="metadata.properties['title'] || ''"
          [subtitle]="metadata.properties['subtitle'] || ''"
          [variant]="metadata.properties['variant'] || 'default'">
          <p>{{ metadata.properties['content'] || 'Card Content' }}</p>
        </ui-card>
      }
      @case ('CONTAINER') {
        <div class="dynamic-container" [ngStyle]="{'padding': metadata.properties['padding'], 'background-color': metadata.properties['backgroundColor']}">
          @for (child of metadata.children || []; track child.id) {
            <app-dynamic-widget [metadata]="child"></app-dynamic-widget>
          }
        </div>
      }
      @case ('COLUMNS') {
        <div class="dynamic-columns" [ngStyle]="{'gap': metadata.properties['gap']}">
          @for (child of metadata.children || []; track child.id) {
            <app-dynamic-widget [metadata]="child"></app-dynamic-widget>
          }
        </div>
      }
      @default {
        <div class="unknown-widget">Unknown widget type: {{ metadata.type }}</div>
      }
    }
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .unknown-widget {
      padding: 12px;
      background: rgba(255,0,0,0.1);
      color: red;
      border: 1px dashed red;
    }
    .dynamic-columns {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .dynamic-columns > * {
      flex: 1;
      min-width: 0;
    }
  `]
})
export class DynamicWidgetComponent {
  @Input({ required: true }) metadata!: ComponentMetadata;
}
