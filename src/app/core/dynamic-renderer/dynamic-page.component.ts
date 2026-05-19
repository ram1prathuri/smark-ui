import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PageMetadata } from '../../features/page-builder/page-builder.models';
import { DynamicWidgetComponent } from './dynamic-widget.component';

@Component({
  selector: 'app-dynamic-page',
  standalone: true,
  imports: [CommonModule, DynamicWidgetComponent],
  template: `
    <div class="dynamic-page-container animate-fadeInUp">
      @if (pageData) {
        <div class="page-header">
          <h1 class="page-title">{{ pageData.title }}</h1>
        </div>

        <div class="page-content">
          @for (comp of pageData.components; track comp.id) {
            <div class="dynamic-widget-wrapper">
              <app-dynamic-widget [metadata]="comp"></app-dynamic-widget>
            </div>
          }
        </div>
      } @else {
        <div class="empty-state">
          <p>No page metadata found. Ensure the route has valid page data configured.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .dynamic-page-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0;
    }
    .page-header {
      margin-bottom: 8px;
      border-bottom: 1px solid var(--app-border);
      padding-bottom: 16px;
    }
    .page-title {
      font-size: 28px;
      font-weight: 700;
      color: var(--app-text-primary);
      margin: 0;
    }
    .page-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .dynamic-widget-wrapper {
      /* Base styles for widgets on the rendered page */
      width: 100%;
    }
    .empty-state {
      padding: 40px;
      text-align: center;
      color: var(--app-text-muted);
      background: var(--app-surface-card);
      border-radius: 12px;
      border: 1px dashed var(--app-border);
    }
  `]
})
export class DynamicPageComponent implements OnInit {
  pageData: PageMetadata | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // 1. Try reading from route data (static config)
    const routeData = this.route.snapshot.data['pageData'];
    if (routeData) {
      this.pageData = routeData as PageMetadata;
    }
    // 2. Alternatively, in a real app, you might fetch JSON from an API
    // const fileId = this.route.snapshot.paramMap.get('id');
    // if (fileId) { this.http.get(...) }
  }
}
