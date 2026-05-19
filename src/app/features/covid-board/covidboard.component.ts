import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UiTableComponent, UiTableColumn } from '../../shared/ui/ui-table/ui-table.component';
import { UiTreeComponent, UiTreeNode } from '../../shared/ui';
import { PostsActions } from '../../core/store/posts/posts.actions';
import { selectAllPosts, selectPostsLoading } from '../../core/store/posts/posts.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-covid-board',
  standalone: true,
  imports: [CommonModule, UiTableComponent, UiTreeComponent],
  template: `
    <div class="page-container animate-fadeInUp">
      <div class="page-header">
        <h1 class="page-title">COVID-19 Dashboard</h1>
        <p class="page-subtitle">Tracking data and statistics</p>
      </div>

      <!-- Tree View for Hierarchical Data -->
      <div class="dashboard-section">
        <h2 class="section-title">Regional Breakdown</h2>
        <div class="tree-container">
          <ui-tree [data]="covidRegions"></ui-tree>
        </div>
      </div>

      <!-- Table View for Posts/Articles -->
      <div class="dashboard-section">
        <h2 class="section-title">Latest Updates (Posts)</h2>
        <ui-table
          title="Articles"
          [columns]="columns"
          [data]="(posts$ | async) || []"
          [loading]="(loading$ | async) || false"
          [searchable]="true"
          [paginated]="true"
          [pageSize]="10"
          emptyMessage="No posts found."
        />
      </div>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 24px; max-width: 1200px; padding-bottom: 40px; }
    .page-header { margin-bottom: 8px; }
    .page-title { font-size: 26px; font-weight: 700; color: var(--app-text-primary); margin: 0 0 4px; }
    .page-subtitle { font-size: 14px; color: var(--app-text-muted); margin: 0; }
    
    .dashboard-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--app-text-primary);
      margin: 0;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--app-border);
    }

    .tree-container {
      background: var(--app-surface-card);
      border-radius: var(--app-border-radius-lg);
      box-shadow: var(--app-shadow-sm);
      border: 1px solid var(--app-border);
      padding: 8px;
    }
  `]
})
export class CovidBoardComponent implements OnInit {
  private store = inject(Store);

  posts$ = this.store.select(selectAllPosts);
  loading$ = this.store.select(selectPostsLoading);

  columns: UiTableColumn[] = [
    { key: 'id', label: 'ID', width: '60px', align: 'center', sortable: true },
    { key: 'userId', label: 'User ID', width: '80px', align: 'center', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'body', label: 'Content' }
  ];

  // Dummy Hierarchical COVID Data
  covidRegions: UiTreeNode[] = [
    {
      id: 'global',
      label: 'Global Summary (Cases: 676M)',
      icon: 'public',
      expanded: true,
      children: [
        {
          id: 'na',
          label: 'North America',
          icon: 'map',
          expanded: true,
          children: [
            {
              id: 'us',
              label: 'United States (103M)',
              icon: 'flag',
              children: [
                { id: 'us-ca', label: 'California (12M)' },
                { id: 'us-tx', label: 'Texas (8M)' },
                { id: 'us-fl', label: 'Florida (7M)' },
                { id: 'us-ny', label: 'New York (6M)' }
              ]
            },
            {
              id: 'ca',
              label: 'Canada (4.6M)',
              icon: 'flag',
              children: [
                { id: 'ca-on', label: 'Ontario (1.6M)' },
                { id: 'ca-qc', label: 'Quebec (1.3M)' }
              ]
            }
          ]
        },
        {
          id: 'eu',
          label: 'Europe',
          icon: 'map',
          children: [
            { id: 'fr', label: 'France (40M)', icon: 'flag' },
            { id: 'de', label: 'Germany (38M)', icon: 'flag' },
            { id: 'uk', label: 'United Kingdom (24M)', icon: 'flag' }
          ]
        },
        {
          id: 'as',
          label: 'Asia',
          icon: 'map',
          children: [
            { id: 'in', label: 'India (44M)', icon: 'flag' },
            { id: 'cn', label: 'China (99M)', icon: 'flag' },
            { id: 'jp', label: 'Japan (33M)', icon: 'flag' }
          ]
        }
      ]
    }
  ];

  ngOnInit() {
    this.store.dispatch(PostsActions.loadPosts());
  }
}
