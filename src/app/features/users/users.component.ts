import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UiTableComponent, UiTableColumn } from '../../shared/ui/ui-table/ui-table.component';
import { UsersActions } from '../../core/store/users/users.actions';
import { selectAllUsers, selectUsersLoading } from '../../core/store/users/users.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UiTableComponent],
  template: `
    <div class="page-container animate-fadeInUp">
      <div class="page-header">
        <h1 class="page-title">Users</h1>
        <p class="page-subtitle">Data fetched from JSONPlaceholder using NgRx</p>
      </div>

      <ui-table
        title="Directory"
        [columns]="columns"
        [data]="(users$ | async) || []"
        [loading]="(loading$ | async) || false"
        [searchable]="true"
        [paginated]="true"
        [pageSize]="10"
        emptyMessage="No users found."
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
export class UsersComponent implements OnInit {
  private store = inject(Store);

  users$ = this.store.select(selectAllUsers);
  loading$ = this.store.select(selectUsersLoading);

  columns: UiTableColumn[] = [
    { key: 'id', label: 'ID', width: '60px', align: 'center', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'username', label: 'Username', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'website', label: 'Website' },
    { key: 'company', label: 'Company', render: (row: any) => row.company?.name || '' }
  ];

  ngOnInit() {
    this.store.dispatch(UsersActions.loadUsers());
  }
}
