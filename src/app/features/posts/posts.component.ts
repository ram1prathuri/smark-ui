import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UiTableComponent, UiTableColumn } from '../../shared/ui/ui-table/ui-table.component';
import { PostsActions } from '../../core/store/posts/posts.actions';
import { selectAllPosts, selectPostsLoading } from '../../core/store/posts/posts.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, UiTableComponent],
  template: `
    <div class="page-container animate-fadeInUp">
      <div class="page-header">
        <h1 class="page-title">Posts</h1>
        <p class="page-subtitle">Data fetched from JSONPlaceholder using NgRx</p>
      </div>

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
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 20px; max-width: 1200px; }
    .page-header { margin-bottom: 8px; }
    .page-title { font-size: 26px; font-weight: 700; color: var(--app-text-primary); margin: 0 0 4px; }
    .page-subtitle { font-size: 14px; color: var(--app-text-muted); margin: 0; }
  `]
})
export class PostsComponent implements OnInit {
  private store = inject(Store);

  posts$ = this.store.select(selectAllPosts);
  loading$ = this.store.select(selectPostsLoading);

  columns: UiTableColumn[] = [
    { key: 'id', label: 'ID', width: '60px', align: 'center', sortable: true },
    { key: 'userId', label: 'User ID', width: '80px', align: 'center', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'body', label: 'Content' }
  ];

  ngOnInit() {
    this.store.dispatch(PostsActions.loadPosts());
  }
}
